# Design

## Context

See `proposal.md` for motivation and `specs/` for the behavior contract. This change is documentation- and scripting-only; it does not alter lesson content, Terraform resources, or Go logic.

Observed state that shapes the approach:

- `workshop/scripts/common.sh` defines `PROJECT_ID` from `starter/.env`, plus `log_fail`, `require_project`, and read-only `check_*` helpers. There is no `die` helper and no `LAB_PROJECT_ID`.
- `apply.sh` and `destroy.sh` announce their effect and call `require_project`, but never compare the active gcloud project with `PROJECT_ID` and never prompt. `doctor.sh` and `plan.sh` are already read-only.
- `Makefile`, `Taskfile.yaml`, and `Setup.ps1` all live in `workshop/starter/`. `Setup.ps1` delegates to the shared scripts **only when `bash` exists**; otherwise it runs a second native implementation of all four verbs. `Setup.ps1` also bootstraps tool installs and creates `.env` as a side effect.
- `slides/check-outline.py` hardcodes `HERE.parent / "workshop" / "slides" / "outline.md"`; `slides/README.md`, the guides, and two published specs name that same path.
- The Dockerfile copies `keys/lab-key.json` into the image and `main.go` reads that path when present. Terraform creates a key resource but does not write the file; today the committed file is an invalid placeholder.
- `.gitignore` already covers `.terraform/`, state, and `.env`, but not `*.tfvars`.
- `openspec/specs/` currently contains only `anatomy-figure-embeds`, `revealjs-slide-deck`, and `source-repository-publishing`. `vulnerable-starter-stack`, `lab-cost-guardrails`, and `workshop-curriculum` exist only in the in-flight `gcp-misconfiguration-gemini-workshop` change (18/24 tasks done).
- `openspec/changes/archive/` contains historical documents that intentionally name old paths (`workshop/slides/outline.md`, `starter/`).

Constraints: the repo will be public, participants clone this exact repo, the session is live and facilitator-led, and the audience is non-expert students and juniors.

## Goals / Non-Goals

**Goals:**

- Make the first guess correct: one front door, one `slides/`, one self-describing starter folder, one command implementation.
- Guarantee that a mutating command cannot target a non-lab project and cannot act without an explicit confirmation.
- Make every generated or third-party file say what it is, and every failure say what to do next.
- Publish safely and verify publication from a fresh clone.

**Non-Goals:**

- No new tooling, benchmark suites, or seed scripts; changes stay in existing files/folders apart from the new root README.
- No restructuring of `openspec/`, no edits to archived change documents, and no changes to lesson content, Terraform resources, or application logic.
- No attempt to hide maintainer material from the clone; it is labelled instead.

## Decisions

### 1. One implementation, thin entry points

`workshop/scripts/*.sh` remains the single implementation of `doctor`, `plan`, `apply`, and `destroy`. A wrapper may only delegate to those scripts. The native PowerShell implementations in `Setup.ps1` are removed; if the shared shell is unavailable, the Windows entry point fails with an actionable message.

Alternative considered: keep the PowerShell implementations as a Windows fallback. Rejected because it creates exactly the drift this change is meant to remove — two definitions of `apply` that can behave differently.

### 2. Canonical wrapper and Windows bootstrap

`Makefile` is the canonical general wrapper because it is already present, `doctor.sh` already checks for `make`, and its targets are already pure delegation. `Taskfile.yaml` is removed. `Setup.ps1` is renamed to `setup-windows.ps1` and becomes a bootstrap plus delegator: it announces and performs prerequisite installation, then invokes the shared scripts through Git Bash or WSL.

Alternative considered: keep `task` as the cross-platform wrapper and drop `make`. Rejected because `make` is already the path used in the guides' primary platform row and is detected by `doctor`. If the confirmed OS mix is predominantly Windows without a shell, keep `task` as a documented alias that only calls the same scripts — never a second implementation.

### 3. Project guard and confirmation use the existing `PROJECT_ID`

The proposal's sketch uses `LAB_PROJECT_ID`, but the checked-out code uses `PROJECT_ID` in `.env` and `TF_VAR_project_id`. Renaming the variable would break every participant's copy and every guide command for little gain. Keep `PROJECT_ID` as the configuration key, but use the human-facing label "lab project" everywhere.

Add two helpers to `common.sh`, following the existing `log_fail`/`require_project` style rather than the proposed `die`:

- `require_lab_project` — fails when `PROJECT_ID` is empty or when `gcloud config get-value project` differs, printing the exact `gcloud config set project` command to fix it.
- `confirm_project` — prints project, region, resources, and a rough cost note, then requires the user to type the project ID.

`apply.sh` and `destroy.sh` call `require_lab_project` before `confirm_project`. A `--yes` flag skips only the typing prompt; it never bypasses `require_lab_project`. `doctor` and `plan` remain read-only and are not guarded by confirmation.

### 4. Renames are mechanical, with a scoped reference sweep

Rename `workshop/starter/` to `workshop/vulnerable-starter/` and move `workshop/slides/outline.md` to `slides/outline.md`. Update live references in scripts, wrappers, Terraform/Dockerfile contexts, guides, slides, `check-outline.py`, and current spec artifacts.

The stale-path sweep SHALL cover live code, docs, and current change artifacts, but SHALL exclude `openspec/changes/archive/`, whose documents are historical records of earlier decisions. Acceptance criterion 5 is interpreted with that scope; editing archives would rewrite history and is out of scope.

### 5. Placeholder key stays, with a conditional escape hatch

Because the Dockerfile copies the file and `main.go` reads it when present, deleting `lab-key.json` would change the app's vulnerable behavior and the lesson. Today's file is an invalid placeholder with explicit markers and is safe to publish. Keep it and add the danger banner. Add `*.tfvars` to `.gitignore` with an `!*.tfvars.example` exception.

If implementation discovers any script or workflow that writes a real key into that path, switch to the `lab-key.example.json` pattern, ignore the real path, and generate it at setup time. That decision is conditional on the first open question below.

### 6. Generated headers must survive regeneration

Adding a header to `slides/figures/*.svg` and `*.html` is not enough: the `.mjs` generators under `slides/figures/src/` emit those files. The header is added in the generator templates too, then figures are regenerated and the outputs checked. Otherwise the banner disappears on the next build — the very surprise this change addresses.

### 7. Public visibility is a spec change, not just a setting

`source-repository-publishing` currently mandates a private repository. Its delta removes that requirement and adds a public requirement, a publish-safe placeholder requirement, `.tfvars` exclusion, and a scratch-push verification. A fresh-clone check confirms no ignored local artifacts were published.

## Risks / Trade-offs

- **Renames break paths in Terraform, Dockerfile, scripts, or slides** → run a scoped repo-wide search, then a dry run from a fresh clone, before declaring done.
- **Stale references remain in archived documents** → accept them as history and state the search scope explicitly, so a reviewer does not read an archive hit as a defect.
- **The guard blocks a legitimate facilitator flow** → document `--yes` as an override of the prompt only; keep the project check mandatory.
- **GitHub push protection blocks the placeholder key** → scratch-push before the session; adjust placeholder formatting if needed.
- **Generated headers are overwritten** → change the generator templates and regenerate, then verify the output contains the header.
- **Participants still open `openspec/`** → root README labels it and the facilitator says so aloud.
- **Windows users lack a shell** → bootstrap reports the missing prerequisite with the install command instead of silently switching to a different command implementation.

## Migration Plan

1. Docs-only phase: root README, banners, vocabulary, generated headers (including generators), `.gitignore`.
2. Structure phase: folder rename, outline move, script/wrapper path updates, `Setup.ps1` rename.
3. Behavior phase: consolidate wrappers, add guard and confirmation, align errors and idempotency.
4. Verification phase: scoped stale-path search, fresh-clone dry run, stranger test, scratch push.
5. Rollback: each phase is a small commit; revert the commit and re-run the stale-path search. No cloud migration is involved, so no data rollback is needed.

## Open Questions

All questions that would change the approach were resolved with the user during planning; none remain open for implementation.

1. **What writes a real key into `lab-key.json`?** Resolved: nothing does. Keep the tracked placeholder, add the banner, and extend `.gitignore` with `*.tfvars` (Decision 5). The example-file pattern is not in scope.
2. **OS mix and wrapper.** Resolved: `make` is the only general wrapper; `Taskfile.yaml` is removed; `setup-windows.ps1` bootstraps and delegates via Git Bash or WSL (Decision 2). A `task` alias is not in scope.
3. **One shared lab project or one per participant?** Resolved: one project per participant/environment. Each environment's `.env` supplies `PROJECT_ID`, and the guard compares the active gcloud project with that value (Decision 3).
4. **Current script behavior.** Confirmed by reading the files: `doctor` and `plan` are read-only; `apply` and `destroy` announce but do not prompt and do not check the active project; there is no `die` helper. No further investigation needed.
5. **Hard-coded paths.** Confirmed: `check-outline.py` hardcodes `workshop/slides/outline.md`, and `slides/README.md`, the guides, `revealjs-slide-deck`, and `anatomy-figure-embeds` name it too.

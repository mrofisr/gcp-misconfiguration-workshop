# Tasks

## 1. Front door and notices (docs only)

- [x] 1.1 Create a root `README.md` that names `workshop/README.md` as the participant start, lists every top-level folder with its audience, and states both safety heads-ups; verify a reader can identify the first file to open and the first command to run without other instructions.
- [x] 1.2 Add a first-line banner to `workshop/facilitator-guide.md` stating it is for facilitators only and participants do not need it; verify the banner precedes all instructional content.
- [x] 1.3 Add a danger notice to the opening of the starter README stating the code is deliberately insecure and must only be deployed into the lab project; verify it appears before the contents list.
- [x] 1.4 Add a "generated from `src/` — edit the `.mjs`, not this file" header to the templates in `slides/figures/src/` and document `slides/vendor/` as third-party in `slides/README.md`; verify each generator emits the header.
- [x] 1.5 Regenerate all three figures and verify every `.svg` and `.html` under `slides/figures/` contains the header and is otherwise unchanged.
- [x] 1.6 Add "lab project" to `workshop/glossary.md` and align wording in `workshop/README.md`, the participant guide, and `slides/index.html`; verify no live guide or slide calls the same resource "your project".

## 2. Structure and references

- [x] 2.1 Rename `workshop/starter/` to `workshop/vulnerable-starter/` and update all live references in scripts, wrapper, Terraform, Dockerfile, Go comments, guides, slides, and current spec artifacts; verify a repo-wide search for `starter/` finds no hit outside `openspec/changes/archive/`.
- [x] 2.2 Move `workshop/slides/outline.md` to `slides/outline.md` and update `check-outline.py`, `slides/README.md`, the guides, and the two published specs that name the old path; verify `python3 slides/check-outline.py` passes from the repository root and `workshop/slides/` no longer exists.
- [x] 2.3 Rename `Setup.ps1` to `setup-windows.ps1` and update every guide and slide reference; verify no reference to the old filename remains outside the archive.
- [x] 2.4 Rewrite the command tables in `workshop/README.md` and both guides to show one wrapper plus the OS-specific bootstrap; verify each platform row names a single way to run each verb.

## 3. One command surface

- [x] 3.1 Delete `Taskfile.yaml` and remove the native PowerShell implementations of `doctor`, `plan`, `apply`, and `destroy` from `setup-windows.ps1`; verify the four verbs are defined only in `workshop/scripts/*.sh`.
- [x] 3.2 Rewrite `setup-windows.ps1` to announce prerequisite installation, then delegate each verb to the shared scripts through Git Bash or WSL; verify it prints the install list before installing and exits with an actionable shell-missing message when no shell is available.
- [x] 3.3 Keep `Makefile` as the only general wrapper, aligned to the four verb scripts; verify `make help` lists exactly `doctor`, `plan`, `apply`, and `destroy` and each target invokes its matching script.

## 4. Safe command behavior

- [x] 4.1 Add `require_lab_project` to `common.sh` using the existing `PROJECT_ID` and `log_fail` style, comparing `gcloud config get-value project` with the configured value; verify an empty configuration and a mismatch both abort before any cloud change and print the fixing command.
- [x] 4.2 Add `confirm_project` and call it from `apply.sh` and `destroy.sh` after the guard, printing project, region, resources, and a cost note, with a `--yes` flag that skips only the typing prompt; verify a wrong project ID cancels with "nothing was changed" and `--yes` still aborts on a project mismatch.
- [x] 4.3 Confirm `doctor` and `plan` remain read-only and do not create the local `.env`; verify `git status` is clean and no cloud resource changes after running both.
- [x] 4.4 Confirm `apply` and `destroy` are idempotent; verify a second consecutive run of each produces no duplicate resources and no error caused by the first run.
- [x] 4.5 Replace failures that lack a next step with actionable messages for "not logged in", missing ADC, and missing configuration; verify each message names the command or file to use.
- [x] 4.6 Align `PASS`/`WARN`/`FAIL` output with the "lab project" vocabulary; verify script output contains no conflicting label for the provisioned project.

## 5. Public repository safety

- [x] 5.1 Add `*.tfvars` and an `!*.tfvars.example` exception to `.gitignore`; verify `git check-ignore -v` ignores a value-bearing `.tfvars` while `.env.example` and the Terraform lock file remain tracked.
- [x] 5.2 Verify the committed `lab-key.json` still contains only `REPLACE_WITH_`/`PLACEHOLDER_` markers and no usable key material, with the banner from 1.3 in place; verify no real key path is tracked.
- [x] 5.3 Confirm repository visibility is public as an operator action and verify an unauthenticated clone succeeds; keep the visibility change as a human checkpoint.
- [x] 5.4 Push the content to a scratch public repository and verify secret scanning does not block the placeholder key; record the outcome.

## 6. Integration verification

- [x] 6.1 Run the scoped stale-path sweep across live code, docs, and current change artifacts, excluding `openspec/changes/archive/`; verify no hit for `starter/`, `workshop/slides`, or `Setup.ps1` remains.
- [x] 6.2 Clone the repository fresh and follow only the root README to the first lab checkpoint; verify no verbal help is needed and `python3 slides/check-outline.py` passes in the clone.
- [x] 6.3 Show the tree and command list to an uninvolved reviewer and record their predicted purpose for each folder and command; verify every wrong guess is fixed or the mismatch is logged with its resolution.

## Workflow follow-up

- Done (5.3): the remote `mrofisr/gcp-misconfiguration-workshop` is **PUBLIC**, verified with `gh repo view` and a credential-free clone.
- Done (5.4): pushed to `mrofisr/gdg-semarang-pola-scratch-20261128` (public); push succeeded and the committed `lab-key.json` still contains only `REPLACE_WITH_`/`PLACEHOLDER_` markers. The scratch repository was deleted after verification.
- Done (6.3): a fresh-context reviewer predicted all folder contents and all four commands correctly. Two audience/name ambiguities were fixed: the root README now says `slides/` is for facilitators and maintainers, and `vulnerable-starter/README.md` explains `.agents/`. The `pola` and `anatomy-figure-embeds` names are internal OpenSpec identifiers and were logged as intentional.
- Archive the change after review and verify the archived result.
- When `gcp-misconfiguration-gemini-workshop` is archived, reconcile its `vulnerable-starter-stack`, `lab-cost-guardrails`, and `workshop-curriculum` specs: remove the three-wrapper requirement, update the outline path, and add the facilitator banner.

# Proposal

## Why

Participants clone this exact repo, which will be public, but the repo currently reads like a maintainer's workspace: no root README, a large `openspec/` archive that looks like required reading, two folders named `slides`, three command wrappers, a facilitator guide sitting in the participant checkout, and cloud commands that can silently target the wrong project. This change applies the Principle of Least Astonishment so a newcomer's first guess about a folder or command is correct.

Grounding from the current tree: `workshop/starter/` holds the Make/Task/PowerShell wrappers; `Setup.ps1` contains a *second* native PowerShell implementation of all four verbs when `bash` is absent; `slides/check-outline.py` hardcodes `workshop/slides/outline.md`; `apply.sh` and `destroy.sh` announce but never prompt and do not compare the active gcloud project with `PROJECT_ID`; the Dockerfile copies `keys/lab-key.json` into the image and `main.go` references that path; `.gitignore` covers `.terraform/` and state but not `*.tfvars`.

## What Changes

- **BREAKING** Add a root `README.md` as the single front door: where participants start, what `openspec/` and `slides/` are, and the two safety heads-ups (deliberately insecure starter, fake key placeholder).
- **BREAKING** Rename `workshop/starter/` to `workshop/vulnerable-starter/` and update every reference (wrappers, scripts, Terraform/Dockerfile contexts, guides, slides, specs). The new name matches the existing `vulnerable-starter-stack` capability.
- **BREAKING** Move `workshop/slides/outline.md` to `slides/outline.md` so there is one `slides/` folder and the outline sits with `check-outline.py`; update `check-outline.py`, `slides/README.md`, guides, and the specs that name the old path.
- **BREAKING** Replace three command surfaces with one wrapper plus explicit platform entry points; keep `workshop/scripts/*.sh` as the single implementation of each verb and remove the duplicated native PowerShell command implementations. Rename `Setup.ps1` to an OS-explicit `setup-windows.ps1`; keep Windows bootstrap there but announce it before installing anything.
- Define one verb contract: `doctor` and `plan` are read-only; `apply` and `destroy` announce effect, require confirmation, refuse a project mismatch, and are idempotent. Failures name the next command. A documented non-interactive flag skips only the typing prompt, never the project check.
- Standardise on the term "lab project" in guides, slides, glossary, and script output, matching the existing `REPLACE_WITH_LAB_PROJECT` placeholder.
- Add banners: facilitator guide is facilitators-only; generated `slides/figures/*.svg` and `*.html` say "generated — edit the `.mjs` under `src/`"; `slides/vendor/` is marked third-party; the vulnerable starter opens with its danger notice.
- Resolve placeholder-key handling: today `lab-key.json` is an invalid, explicitly marked placeholder and is safe to publish, but the app and Dockerfile depend on it. If any real key is ever written there, switch to `lab-key.example.json` plus an ignored real path. Extend `.gitignore` for `*.tfvars` and verify a scratch public-repo push is not blocked.
- Publish the repository as public, reconciling the existing `source-repository-publishing` requirement that currently mandates private visibility.

## Capabilities

### New Capabilities

- `participant-onboarding`: A clone of the public repo is self-explanatory — one front door, unambiguous names, clearly labelled maintainer material, visible danger/placeholder notices, and consistent "lab project" vocabulary.
- `safe-lab-commands`: The four lab commands have one implementation and predictable, observable behavior — read-only verbs never mutate, mutating verbs announce and confirm, all refuse the wrong project, and failures tell the user what to run next.

### Modified Capabilities

- `source-repository-publishing`: Visibility changes from private to public; add requirements for publish-safe placeholder secrets, `.gitignore` coverage of value-bearing `tfvars`, and a verification push.
- `revealjs-slide-deck`: The authoritative outline path in "Full agenda coverage" changes from `workshop/slides/outline.md` to `slides/outline.md`.
- `anatomy-figure-embeds`: "Figure content accuracy" refers to the outline at its new path; figure outputs are labelled as generated from `src/`.

## Impact

- Affected files: new root `README.md`; `workshop/README.md`, `participant-lab-guide.md`, `facilitator-guide.md`, `glossary.md`; all `workshop/scripts/*.sh`; the chosen wrapper and `Setup.ps1`; `workshop/starter/**` (paths, Dockerfile, Go source comment, Terraform); `slides/README.md`, `slides/check-outline.py`, `slides/index.html`, `slides/figures/**`; `.gitignore`; the specs above.
- No change to lesson content, Terraform resources, or Go application logic.
- Sequencing: `vulnerable-starter-stack`, `lab-cost-guardrails`, and `workshop-curriculum` currently exist only in the in-flight `gcp-misconfiguration-gemini-workshop` change, not in `openspec/specs/`. This change carries their affected behavior in the two new capabilities above. When that change is archived, its specs must be reconciled: drop the three-wrapper requirement, move the outline path, and add the facilitator banner.
- Resolved during planning: `lab-key.json` stays a tracked placeholder; `make` is the only general wrapper with `setup-windows.ps1` delegating via Git Bash/WSL; and each participant/environment has its own lab project supplied through `.env`. Current script behavior and hard-coded paths were confirmed by reading the files; see `design.md`.

# Tasks

## 1. Baseline and guardrails

- [x] 1.1 Record `git rev-parse gh-pages` and `git status --short` before editing; verify the gh-pages hash is saved and the pre-existing unrelated `create-private-github-repo` and archived-change files are identified as work not to include.
- [x] 1.2 Run `openspec validate flatten-workshop-to-root`; verify the change and its delta spec validate with no issues.

## 2. Flatten the tree

- [x] 2.1 Move `glossary.md`, `participant-lab-guide.md`, and `scripts/` from `workshop/` to the repository root with `git mv`; verify each exists at the root and `workshop/` has no remaining guides.
- [x] 2.2 Move the immediate children of `vulnerable-starter/` — `Makefile`, `setup-windows.ps1`, `.env.example`, `.agents/`, `app/`, and `terraform/` — to the root with `git mv`; verify `app/` and `terraform/` remain directories and both old directories are empty.
- [x] 2.3 Merge the root README, `workshop/README.md`, and `vulnerable-starter/README.md` into one root `README.md`; verify the audience table, safety heads-ups, `gh-pages` pointer, objectives, cost note, guide and command tables, danger notice, and vulnerability table are present, with no facilitator-guide entry, then delete both old READMEs.
- [x] 2.4 Delete `facilitator-guide.md` and remove its links from the merged root README and `participant-lab-guide.md`; verify `git grep -n 'facilitator-guide' -- README.md participant-lab-guide.md` returns no matches.
- [x] 2.5 Remove the empty `workshop/` and `vulnerable-starter/` directories; verify neither path exists.

## 3. Rebase paths and references

- [x] 3.1 Update `scripts/common.sh` so its project root is the scripts directory's parent and `APP_DIR`, `TERRAFORM_DIR`, and the `.env` read point at root-level `app/`, `terraform/`, and `.env`; verify `doctor` and `plan` resolve those paths from a fresh checkout.
- [x] 3.2 Update `setup-windows.ps1` and the root `Makefile` so both delegate to the root `scripts/` directory; verify each entry point invokes the shared shell scripts and no `../scripts` reference remains.
- [x] 3.3 Rewrite guide links, example commands, and the `.env`/`.agents` copy instructions to use root-relative paths; verify `git grep -nE 'workshop/|vulnerable-starter/' -- README.md glossary.md participant-lab-guide.md scripts Makefile setup-windows.ps1 app terraform` returns no matches for current locations.
- [x] 3.4 Change the Go module path in `app/go.mod` from `workshop/vulnerable-starter/app` to `app`; verify `cd app && go build ./...` succeeds and the Dockerfile build context is unchanged.
- [x] 3.5 Create `.gitattributes` with `* text=auto eol=lf`, `*.ps1 text eol=crlf`, and `*.sh text eol=lf`; verify `git check-attr eol -- setup-windows.ps1 scripts/doctor.sh` reports `crlf` and `lf` respectively.

## 4. Verify behavior after the move

- [x] 4.1 Run `make doctor` from the repository root; verify its read-only checks complete with no `FAIL` caused by path resolution and that no cloud state changes.
- [x] 4.2 Run `terraform -chdir=terraform validate`; verify the configuration validates from the new root-level directory with no state or credentials required.
- [x] 4.3 Re-run `git rev-parse gh-pages`; verify the ref is unchanged and the published deck is untouched.

## 5. Commit

- [x] 5.1 Stage only the moved, merged, deleted, and added paths plus this change's artifacts; verify `git diff --cached --name-status` excludes the pre-existing `create-private-github-repo` deletions and untracked archive directories.
- [ ] 5.2 Commit the staged change on `master`; verify `git status --short` afterwards shows only the pre-existing unrelated working-tree changes.

## Workflow follow-up

- Archive or sync the change after review so the `source-repository-publishing` delta updates `openspec/specs/`; the published spec keeps the old paths until that step.
- Roll back by reverting the commit if the flattened layout breaks a lab command; `gh-pages` needs no rollback.

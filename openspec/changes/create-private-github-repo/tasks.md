# Tasks

## 1. Pre-flight checks

- [x] 1.1 Run `gh auth status` and confirm an authenticated account, then run `gh repo view gcp-misconfiguration-workshop` and confirm the name is not already taken; verify by reading the account login and a "not found" response for the repo.

## 2. Local repository setup

- [x] 2.1 Create a root `.gitignore` excluding `.terraform/`, `*.tfstate`, `*.tfstate.*`, `.env`, `.env.*` (with `!.env.example`), `.DS_Store`, `Thumbs.db`, `*.log`, `__pycache__/`, and `*.pyc`; verify with `git check-ignore -v` on sample paths and `git status --ignored`, and confirm `workshop/starter/terraform/.terraform.lock.hcl` is not ignored.
- [ ] 2.2 Run `git init` in the project root and stage everything with `git add -A`; verify `git status --short` lists `openspec/`, `workshop/`, `slides/`, and `.gitignore` as staged, with no local `.env` or Terraform state files.
- [ ] 2.3 Review the staged change set with `git diff --cached --stat` and `git diff --cached`; verify `workshop/starter/.env.example` is staged and no secrets or generated state are present.
- [ ] 2.4 Create the initial commit with a descriptive message; verify `git log -1 --oneline` shows the new commit.

## 3. Publish to GitHub

- [ ] 3.1 Create and push the repository with `gh repo create gcp-misconfiguration-workshop --private --source . --push --remote origin`; verify the command succeeds and `git remote -v` shows `origin` pointing at the new repository.

## 4. Verify published state

- [ ] 4.1 Run `gh repo view gcp-misconfiguration-workshop --json name,visibility,owner` and verify visibility is `PRIVATE`, the name is `gcp-misconfiguration-workshop`, and the owner is the expected account.
- [ ] 4.2 Clone the repository to a temporary directory and verify `openspec/`, `workshop/`, and `slides/` exist, `workshop/starter/.env.example` is present, and no ignored artifacts (`.terraform/`, state files, local `.env`) were published.
- [ ] 4.3 Run `git status --porcelain` and verify the output is empty; confirm the local HEAD commit matches the commit on the remote branch.

## Workflow follow-up

- Archive the change after review requirements are satisfied, then verify the archived result.

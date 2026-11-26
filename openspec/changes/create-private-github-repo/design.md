# Design

## Context

See `proposal.md` for motivation. The project directory `/home/ubuntu/Documents/projects/gdg-semarang` is currently not a Git repository. It contains three areas to publish: `openspec/`, `workshop/`, and `slides/`. The `gh` CLI is assumed to be already authenticated on this machine, and the target repository name is `gcp-misconfiguration-workshop` under the authenticated account. See `specs/source-repository-publishing/spec.md` for the behavior contract.

## Goals / Non-Goals

**Goals:**

- Turn the project directory into a Git repository and publish it as a private GitHub repository.
- Include the full project tree in a single initial commit.
- Keep local/generated artifacts and secrets out of the published repository.
- Verify the published result (privacy, remote, clean working tree).

**Non-Goals:**

- No `gh` authentication setup (assumed already configured).
- No edits to the workshop, slides, or OpenSpec content itself.
- No public repository, organization transfer, CI/CD, branch protection, or collaborator management.
- No preservation of prior history — there is no existing local Git history to migrate.

## Decisions

- **Use `gh repo create --private --source . --push`.** One command creates the remote as private, wires it up as `origin`, and pushes the initial commit. Alternative: manual `git init` + `git remote add` + `git push` plus creating the repo in the web UI, which adds steps where visibility could be set incorrectly.
- **Single initial commit of the full tree.** There is no prior history to preserve, so one commit is simplest and keeps verification straightforward.
- **Explicit `.gitignore` before staging.** Ignore generated/local artifacts (`.terraform/`, `*.tfstate*`, `.env` and `.env.*` except `.env.example`, OS/editor junk such as `.DS_Store` and `Thumbs.db`, logs, caches). Keep `workshop/starter/terraform/.terraform.lock.hcl` because it is an intentionally tracked lock file. Alternative: stage everything and rely on review — too easy to commit machine-local secrets or Terraform state.
- **Assume `gh` authentication.** Per the request, no auth bootstrap step is included; the operator is responsible for a valid `gh auth` session before running the tasks.
- **Verify after push.** Confirm privacy, remote URL, and a clean working tree before considering the change done.

## Risks / Trade-offs

- [Risk] Example config could be mistaken for a secret, or a real secret could be committed → Mitigation: audit staged files before commit; retain only `.env.example` and non-sensitive config.
- [Risk] Repository created under the wrong account or with public visibility → Mitigation: check `gh auth status` and confirm the repo shows `private` after creation.
- [Risk] A repo named `gcp-misconfiguration-workshop` already exists → Mitigation: check `gh repo view` first; stop and ask the user if it is taken rather than overwriting.
- [Risk] Push fails due to network or permission issues → Mitigation: keep the local commit intact, report the failure, and retry after the issue is resolved.
- [Risk] Local generated files slip into the commit → Mitigation: review `git status --ignored` and the staged diff before committing.

## Migration Plan

One-time setup with no data migration. If incorrect content is published, correct it with a follow-up commit and push; deleting or force-pushing the repository is a consequential action that requires explicit user confirmation and is out of scope here.

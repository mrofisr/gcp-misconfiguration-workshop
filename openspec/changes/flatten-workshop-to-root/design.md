# Design

## Context

See `proposal.md` for motivation. On `master`, the root holds `README.md`, `.gitignore`, `openspec/`, and `workshop/`. The workshop tree holds three guides, `scripts/`, and `vulnerable-starter/`, which in turn holds `Makefile`, `setup-windows.ps1`, `.env.example`, `.agents/`, `app/`, and `terraform/`. Slide assets are no longer in this tree; they live on `gh-pages`.

Flattening `vulnerable-starter/` breaks the old relative arrangement: `scripts/common.sh` currently sets `VULNERABLE_STARTER_DIR` to the scripts directory's `vulnerable-starter` sibling, `setup-windows.ps1` derives its scripts directory from the starter folder's parent, and `Makefile` points at `../scripts`. After the move, `scripts/`, `app/`, `terraform/`, `.env`, and the wrappers are all siblings at the repository root, so these path calculations must be rewritten — the command behavior stays the same, but the paths it reads do not.

Three documents carry front-door material: the root README (audience table, safety heads-ups, `gh-pages` pointer), `workshop/README.md` (objectives, cost note, guides and commands), and `vulnerable-starter/README.md` (danger notice, vulnerability table). The facilitator guide is not moved: it is deleted, and its two live links (in the workshop README and the participant guide) are removed. There is no `.gitattributes` today, so line endings depend on each contributor's Git settings.

Archived change documents and the in-progress change intentionally keep old paths as history. The working tree also contains unrelated uncommitted changes from a previous archived change; implementation must not include them.

## Goals / Non-Goals

**Goals:**

- Put lab material at the repository root and remove both `workshop/` and `vulnerable-starter/`.
- Leave one front door: the root `README.md`, containing the maintainer, lab, and starter front-page content, with no facilitator-only guide.
- Ensure no live document, command message, or current spec names the old directories as current locations.
- Keep `doctor`, `plan`, `apply`, and `destroy` reading and changing the same resources as before.
- Give the flat tree a deterministic line-ending policy across Windows, Linux, and macOS.

**Non-Goals:**

- Unpacking `app/` or `terraform/` into individual root files; only immediate children of `vulnerable-starter/` move.
- Renaming moved files other than retiring the two old READMEs and removing the facilitator guide.
- Changing Terraform, Go application behavior, the Dockerfile, or the deliberately vulnerable resources.
- Editing `openspec/`, archived change documents, the in-progress change, or the `gh-pages` branch.
- Changing `.gitignore` or untracking `openspec/`; that is handled in a separate change.

## Decisions

1. **Move immediate children with `git mv` and delete both directories.** Rename detection keeps the staged diff reviewable; the user chose to stop flattening at `app/` and `terraform/`.
2. **Merge three READMEs into the root rather than overwrite one.** Audience table, safety heads-ups, and `gh-pages` pointer come from the root README; objectives, cost note, command tables, and the guides list (minus the facilitator entry) from the workshop README; danger notice and vulnerability table from the starter README. Rejected alternative: keep a second front-page file at the root.
3. **Delete `facilitator-guide.md` rather than move it.** Its facilitator-only preflight, troubleshooting, and optional Security Command Center demo are dropped; the participant guide keeps its "ask the facilitator or organizer" fallback. Rejected alternative: move it to the root, which would leave a maintainer-only file in the participant-facing flat tree.
4. **Rebase command-layer paths on the repository root.** `scripts/common.sh` derives the project root from its own location and points `APP_DIR`, `TERRAFORM_DIR`, and the `.env` read at root-level siblings; `setup-windows.ps1` points at the root `scripts/`; the root `Makefile` uses `SCRIPTS := scripts`. Rejected alternative: leave a thin `vulnerable-starter/` compatibility directory — the user asked for it to be gone.
5. **Update the Go module path to `app`.** It is a local lab module, not a published dependency; the Docker build context stays `app/` because the Dockerfile remains there.
6. **Add `.gitattributes` with LF as the repository default.** Use `* text=auto eol=lf`, `*.ps1 text eol=crlf` so Windows PowerShell scripts check out with CRLF, and `*.sh text eol=lf` so shell scripts stay LF everywhere. Rejected alternative: rely on `core.autocrlf` per machine, which produces inconsistent bytes and noisy diffs across the three platforms.
7. **Update published requirements through a delta spec.** The main spec changes only on archive/sync. Archived and in-progress change documents keep their historical paths.
8. **Stage explicit paths only.** Unrelated uncommitted work is present; avoid `git add -A` and verify the staged list before committing.

## Risks / Trade-offs

- **[Facilitator troubleshooting is lost]** Deleting the guide removes its preflight checklist, troubleshooting table, and optional SCC demo → Mitigation: accepted by user; participants keep the guide's fallback instruction to ask the facilitator or organizer.
- **[Line-ending normalization churn]** Adding `.gitattributes` can make Git report whole-file changes for text files whose bytes differ from the new policy → Mitigation: accept a one-time normalization in the same commit and verify `git check-attr eol -- <file>` for `.ps1` and `.sh`.
- **[Command-layer path drift]** `scripts/`, `app/`, `terraform/`, and `.env` move together, so a missed derivation breaks every verb → Mitigation: update all three entry points and verify read-only `doctor` plus `terraform validate` from the new layout.
- **[Front-door content lost in a three-way merge]** Three sources carry different warnings → Mitigation: merge section by section and verify the heads-up bullets, audience table, `gh-pages` note, danger notice, and vulnerability table all survive.
- **[Old links and commands break]** `workshop/...`, `vulnerable-starter/...`, and `facilitator-guide.md` references no longer resolve → Mitigation: rewrite every live reference and verify with a repo-wide search, excluding archived/in-progress change documents.
- **[Go module path becomes stale]** `module workshop/vulnerable-starter/app` would point at a nonexistent path → Mitigation: change it to `app` and verify the app still builds.
- **[Unrelated working-tree changes could be committed]** → Mitigation: stage only the moved/edited files and inspect `git diff --cached` before committing.

## Migration Plan

1. Record the `gh-pages` ref and working-tree status before editing; identify the pre-existing unrelated changes.
2. Move the guides and `scripts/` from `workshop/`, and the immediate children of `vulnerable-starter/`, to the root with `git mv`; merge all three READMEs into root `README.md`, dropping facilitator links; delete `facilitator-guide.md`, the old READMEs, and both empty directories.
3. Rebase path resolution in `scripts/common.sh`, `setup-windows.ps1`, and the root `Makefile`; update guide links, `.env` and `.agents` copy instructions, the Go module path, and the delta spec. Create `.gitattributes` with the LF/CRLF policy. Verify no live document names the old directories or facilitator guide.
4. Verify from the new root layout: `make doctor` completes its read-only checks, `terraform -chdir=terraform validate` succeeds, `go build ./...` succeeds in `app/`, and `git check-attr eol` reports `crlf` for `setup-windows.ps1` and `lf` for a shell script.
5. Stage only the intended paths and commit; leave the pre-existing unrelated changes in the working tree.
6. Rollback: revert the commit, which restores both directories, the three READMEs, and the facilitator guide; `gh-pages` needs no rollback.

# Design

## Context

See `proposal.md` for motivation. The repository currently tracks 41 files under `openspec/` (config, published specs, active and archived changes). The root README describes `openspec/` as maintainer tooling that must not be renamed or moved, and the published `source-repository-publishing` spec requires it in the source tree. Adding `openspec/` to `.gitignore` would not untrack those files, because Git ignores only untracked paths.

This change depends on `flatten-workshop-to-root` being applied and its spec synced first, so the requirement being edited describes the flat root rather than `workshop/`. The user has accepted that OpenSpec artifacts become local-only after this change.

## Goals / Non-Goals

**Goals:**

- Remove `openspec/` from the Git index without deleting or editing its local files.
- Make Git ignore `openspec/` from then on.
- Update the published spec and root README so they describe the local-only tooling.
- Keep this change's own artifacts committable before the directory becomes untracked.

**Non-Goals:**

- Deleting local OpenSpec files or changing their contents.
- Editing the `gh-pages` branch, lab code, or cloud resources.
- Changing any `.gitignore` rule other than adding `openspec/`.
- Providing OpenSpec workflows inside a fresh clone; they remain local to maintainer machines.

## Decisions

1. **Use `git rm -r --cached openspec/`, not a filesystem delete.** It removes tracking only; the files remain on disk and stay readable. Rejected alternative: `rm -rf openspec/`, which would destroy the design history.
2. **Add `openspec/` to `.gitignore` and verify with `git check-ignore -v openspec/config.yaml`.** This keeps future local files untracked. Rejected alternative: `.git/info/exclude`, which is not shared with other local clones of the repo.
3. **Commit in two steps.** First commit the README edit, the delta spec, and this change's artifacts while `openspec/` is still tracked. Then untrack the directory and add the ignore rule in a final commit. Rejected alternative: untrack first — the change's own artifacts would become untracked and could not be committed normally, leaving the change incomplete.
4. **Change published requirements through two MODIFIED blocks.** `Complete project content published` drops `openspec/`; `Local and generated artifacts excluded` names it as a local-only ignored directory. Archived change documents keep their historical text.
5. **Sequence after `flatten-workshop-to-root`.** Both changes edit the same published requirement; applying the flat-root change first gives this delta a stable baseline. Rejected alternative: apply in parallel and merge conflicting deltas at archive time.
6. **Update the README front door.** Replace the `openspec/` folder row and tool-convention note with a short statement that the directory is local-only and absent from clones.

## Risks / Trade-offs

- **[Planning artifacts stop being shared]** Future proposals/applies/archives are local-only → Mitigation: accepted by user; force-add specific files if a change must be shared.
- **[Fresh clone has no openspec/]** OpenSpec CLI commands fail in a clone → Mitigation: README states the directory is local-only; maintainers run these workflows on their own machines.
- **[Accidental file deletion]** `git rm -r` without `--cached` would remove files from disk → Mitigation: always use `--cached`, then verify the local files still exist.
- **[Large staged deletion set]** 41 files will appear as staged deletions → Mitigation: inspect `git diff --cached --name-status` and confirm no unrelated paths are staged.
- **[Spec delta baseline drift]** If the flatten change has not been synced, the delta targets the wrong requirement text → Mitigation: verify the published spec describes the flat root before applying.

## Migration Plan

1. Record the current `git ls-files openspec` count, the README location, and the `gh-pages` ref; confirm the flatten change has been applied and synced.
2. Edit the root README and the delta spec, then commit them together with this change's artifacts while `openspec/` is still tracked.
3. Run `git rm -r --cached openspec/`, add `openspec/` to `.gitignore`, and verify that local files remain on disk, `git ls-files openspec` is empty, and `git check-ignore -v openspec/config.yaml` reports the new rule.
4. Commit the untracking and ignore-rule changes as the final commit; verify a fresh clone contains no `openspec/` directory.
5. Rollback: revert the final commit to restore tracking; local files were never deleted, so no file restoration is needed.

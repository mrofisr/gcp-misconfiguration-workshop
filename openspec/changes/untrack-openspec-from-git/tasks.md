# Tasks

## 1. Baseline and guardrails

- [x] 1.1 Record `git ls-files openspec | wc -l`, `git rev-parse gh-pages`, and `git status --short` before editing; verify the tracked count is captured and the flatten change has been applied and synced so the published spec describes the flat root.
- [x] 1.2 Run `openspec validate untrack-openspec-from-git`; verify the change and its delta spec validate with no issues.

## 2. Publish the plan and docs while openspec/ is still tracked

- [x] 2.1 Remove the `openspec/` folder row and the "do not rename or move" tool-convention note from the root README, and add a short statement that OpenSpec artifacts are local-only and absent from clones; verify `README.md` no longer presents `openspec/` as part of the published source tree.
- [x] 2.2 Review the delta spec against the flattened `source-repository-publishing` requirement; verify both MODIFIED headers match published requirements and the delta states that `openspec/` is untracked and ignored.
- [ ] 2.3 Stage only `README.md`, the delta spec, and this change's artifacts, then commit; verify `git ls-files openspec` still lists files and `git diff --cached --name-status` excludes unrelated paths.

## 3. Untrack openspec/ in a final commit

- [ ] 3.1 Run `git rm -r --cached openspec/`; verify every local file under `openspec/` still exists and `git ls-files openspec` is empty.
- [ ] 3.2 Add `openspec/` to `.gitignore`; verify `git check-ignore -v openspec/config.yaml` reports the new rule and `git status --short` does not show local OpenSpec files as untracked.
- [ ] 3.3 Stage only the untracking deletions and `.gitignore`, then commit; verify `git diff --cached --name-status` contains only `openspec/...` deletions and `.gitignore`, with no unrelated paths.

## 4. Verify the published result

- [ ] 4.1 Clone the repository to a temporary directory and verify the clone contains the flat lab root but no `openspec/` directory; verify the local working tree still has its `openspec/` files intact.
- [ ] 4.2 Re-run `git rev-parse gh-pages`; verify the ref is unchanged and the published deck is untouched.

## Workflow follow-up

- Archive or sync this change locally after review, before the directory is fully out of normal Git workflows; the published spec keeps `openspec/` until then.
- If a future change must be shared with collaborators, explicitly force-add the required `openspec/` files; otherwise OpenSpec planning remains local-only.
- Roll back by reverting the final untracking commit; local files were never deleted, so no restoration is needed.

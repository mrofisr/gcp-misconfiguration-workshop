# Tasks

## 1. Baseline and guardrails

- [x] 1.1 Record `git rev-parse gh-pages` and `git status --short` before editing; verify the gh-pages commit hash is saved and the pre-existing `create-private-github-repo` deletions/untracked archive are identified as unrelated work.
- [x] 1.2 Run `openspec validate remove-slides-from-main`; verify the change and all three delta specs validate with no issues.

## 2. Remove the slide assets from the main branch

- [x] 2.1 List the deck files on the source branch with `git ls-tree -r --name-only master -- slides` and on `gh-pages` with `git ls-tree -r --name-only gh-pages`; verify the gh-pages tree contains `index.html`, `slides.css`, `outline.md`, `check-outline.py`, `README.md`, `figures/`, and `vendor/` at its root so nothing is lost by the deletion.
- [x] 2.2 Delete the top-level `slides/` directory from the `master` working tree; verify the directory is gone and `git status --short` shows deletions only under `slides/`.
- [x] 2.3 Re-run `git rev-parse gh-pages` and `git ls-tree -r --name-only gh-pages`; verify the ref hash is identical to the baseline and every deck file is still present at the branch root.

## 3. Rewrite live references on the main branch

- [x] 3.1 Remove the `slides/` row from root `README.md` and state in its place that the slide deck is maintained on the `gh-pages` branch; verify `README.md` contains no `slides/` path and still describes `workshop/` and `openspec/` accurately.
- [x] 3.2 Replace the `../slides/outline.md` link in `workshop/README.md` (both occurrences) and in `workshop/facilitator-guide.md` (one occurrence) with prose pointing to the deck on the `gh-pages` branch; verify `git grep -n 'slides/' -- README.md workshop/` returns no matches.
- [x] 3.3 Verify no other live document on `master` names the removed directory by checking `git grep -n 'slides/' -- ':!openspec/changes' ':!openspec/specs'` returns no matches outside the OpenSpec change and spec artifacts, which intentionally describe the old location.

## 4. Reconcile the published specs

- [x] 4.1 Review the three delta specs under `openspec/changes/remove-slides-from-main/specs/` against `openspec/specs/`; verify every MODIFIED header exactly matches an existing published requirement and that no delta treats `slides/` as the current deck location (it appears only in "no `slides/` directory" assertions).
- [x] 4.2 Verify the deltas cover all three changes — the source tree excludes slides, the deck/outline/checker live at the gh-pages root, and figures/vendor assets drop the `slides/` prefix — by reading each delta file and checking the corresponding requirement text.
- [x] 4.3 Record the known pre-existing `gh-pages:README.md` drift in the implementation handoff; verify `proposal.md` and `design.md` both state that its `slides/`-style commands are out of scope for this change.

## 5. Commit and final verification

- [x] 5.1 Stage only the intended paths — the `slides/` deletions, `README.md`, `workshop/README.md`, `workshop/facilitator-guide.md`, and the new `openspec/changes/remove-slides-from-main/` directory; verify `git diff --cached --name-status` lists only those paths and no `create-private-github-repo` files.
- [ ] 5.2 Commit the staged change on `master`; verify `git status --short` afterwards shows only the pre-existing unrelated working-tree changes and no leftover deletions from this change.
- [ ] 5.3 Verify the deck remains published and reachable from `gh-pages` after the commit by opening `index.html` through a static server rooted at a gh-pages checkout; verify all seven agenda segments render without external asset requests.

## Workflow follow-up

- Archive or sync the change after review so the three deltas update `openspec/specs/`; the published specs keep the old paths until that step.
- Open a separate change to correct `gh-pages:README.md` ("top-level `slides/`" wording and `--directory slides` commands), which was deliberately left untouched here.

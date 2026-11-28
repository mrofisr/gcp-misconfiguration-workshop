# Design

## Context

See `proposal.md` for motivation. The repository has two relevant branches: `master`, the default development branch, which holds a top-level `slides/` tree; and `gh-pages`, which already holds the complete deck at its root (`index.html`, `slides.css`, `outline.md`, `check-outline.py`, `README.md`, `figures/**` with sources, and `vendor/**`). There is no `main` branch, so "main" in the request is read as `master`.

Live references to the source-branch copy are limited and known:

- root `README.md` — one table row describing `slides/`;
- `workshop/README.md` — two links to `../slides/outline.md`;
- `workshop/facilitator-guide.md` — one link to `../slides/outline.md`;
- the three published specs under `openspec/specs/` — `slides/`-prefixed paths.

Archived change documents also name old paths, but they are history and stay untouched. The working tree contains unrelated uncommitted changes from a previously archived change; implementation must not include them.

User decisions that constrain this design: rewrite all live references on `master` (including the published specs via deltas), and leave `gh-pages` byte-for-byte unchanged, recording its stale README wording as a pre-existing issue.

## Goals / Non-Goals

**Goals:**

- Make the `gh-pages` branch the only place that carries slide assets.
- Leave `master` with a source tree of `openspec/`, `workshop/`, `README.md`, and `.gitignore` — no `slides/`.
- Ensure no live document or current spec on `master` points at a removed `slides/` path.
- Keep `gh-pages` content completely unchanged.

**Non-Goals:**

- Fixing the `gh-pages` `README.md`, whose `--directory slides` commands and "top-level `slides/`" wording do not match root hosting.
- Renaming branches, rewriting history, force-pushing, or deleting the `gh-pages` branch.
- Changing deck content, the pinned reveal.js 6.0.2 distribution, figure generation, or any `workshop/` lab material.
- Editing archived change documents or the unrelated uncommitted `create-private-github-repo` files.

## Decisions

1. **Delete `slides/` from `master` outright, with no pointer stub.** A `slides/README.md` stub would preserve the very folder the change removes and would keep the two-location model alive. Rejected alternative: keep a stub that links to `gh-pages` — the source branch would still contain a slide directory.
2. **Replace the broken links with prose, not a guessed URL.** No GitHub Pages URL is recorded in the repository, so writing one would risk a dead link. Document that the deck is maintained on the `gh-pages` branch. Rejected alternative: hard-code a `github.io` URL without confirming it.
3. **Change published requirements through delta specs, not by editing `openspec/specs/` directly.** This is the OpenSpec boundary: the three deltas in this change update the published specs when the change is archived/synced. Rejected alternative: edit main specs in place, which would bypass review and leave no record of the change.
4. **`gh-pages` is read-only for this change.** Its README drift is recorded in `proposal.md` and in Risks below. Rejected alternative: fix those commands in the same change, which the user explicitly scoped out.
5. **Stage only the intended paths.** Because unrelated changes exist in the working tree, implementation stages the explicit files/directories it edits rather than using `git add -A`, and verifies the diff before committing.

## Risks / Trade-offs

- **[Bookmarked source paths break]** Links such as `master:slides/outline.md` no longer resolve → Mitigation: master docs name the `gh-pages` branch instead; the published deck itself is never removed.
- **[Deck instructions contract is not fully met on gh-pages]** The modified `revealjs-slide-deck` requirement expects README commands to match the deck root, but `gh-pages:README.md` still uses `--directory slides` → Mitigation: explicitly out of scope by user decision; log it as a known pre-existing issue for a separate change rather than silently editing `gh-pages`.
- **[Outline no longer editable from a source checkout]** Maintainers must switch to `gh-pages` to edit the outline, figures, and deck → Mitigation: state the maintenance location in the root README; this is the accepted cost of one canonical copy.
- **[Published specs lag until archive]** `openspec/specs/` still shows old `slides/` paths until this change is archived or synced → Mitigation: validate the deltas during implementation and call out the archive/sync step as a follow-up owned by the maintainer.
- **[Unrelated working-tree changes could be swept in]** Existing deletions and an untracked archive directory are present → Mitigation: stage explicit paths and inspect `git diff --cached` before committing.

## Migration Plan

1. Apply the change on `master`: delete the `slides/` tree, rewrite the three live document references, and verify no tracked text on `master` (outside `openspec/changes/archive/`) still names `slides/`.
2. Leave `gh-pages` untouched; verify with `git rev-parse gh-pages` before and after that the ref is unchanged.
3. Validate the three delta specs and review them against the published specs; archiving or syncing the change is a separate maintainer step that updates `openspec/specs/`.
4. Commit only the intended paths on `master` (no `-A`), leaving the pre-existing unrelated changes in the working tree.
5. Rollback: restore the deleted directory from the parent commit on `master` and revert the three document edits; `gh-pages` needs no rollback because it was never changed.

# Proposal

## Why

The workshop keeps the same slide deck in two places: a top-level `slides/` directory on the main development branch (`master`) and a published copy at the root of the `gh-pages` branch. Keeping deck assets in the source branch makes maintainers edit in two places, bloats a source repository that is meant to hold the workshop material, and leaves live docs and specs on `master` describing a folder that is not the published surface. This change makes `gh-pages` the single home of the deck and removes slide assets from the source branch.

## What Changes

- **BREAKING** Delete the top-level `slides/` directory from the main development branch (`master`): `index.html`, `slides.css`, `outline.md`, `check-outline.py`, `README.md`, `figures/**` (including sources), and `vendor/**`. No slide file is removed from `gh-pages`.
- **BREAKING** Rewrite every live reference to `slides/` on `master`: remove the `slides/` row from the root `README.md` and state instead that the deck is maintained on the `gh-pages` branch; replace the `../slides/outline.md` links in `workshop/README.md` and `workshop/facilitator-guide.md` with prose pointing to the deck on `gh-pages`. Archived change documents stay untouched as history.
- Revise the three published specs so they describe the deck at the root of `gh-pages` rather than under `slides/` on the source branch: the source tree holds `openspec/` and `workshop/` only; the deck, outline, consistency checker, figures, and vendored assets use root-relative paths on `gh-pages`.
- Leave the `gh-pages` branch byte-for-byte unchanged. Its `README.md` still uses `slides/`-style wording and commands; that drift is a known pre-existing issue and is explicitly out of scope here.

Assumptions recorded for planning:

- "Main" in the request means the repository's default development branch, which is `master` (there is no `main` branch).
- `gh-pages` is already the correct publication surface and needs no content changes to host the deck.
- The deck's rendered behavior, pinned reveal.js version, and interactive figures are unchanged; only their branch and path location change.

## Capabilities

### New Capabilities

- none

### Modified Capabilities

- `source-repository-publishing`: the published source repository no longer contains `slides/`; it holds `openspec/` and `workshop/`, while the deck remains published on the `gh-pages` branch.
- `revealjs-slide-deck`: the deck, its authoritative agenda, and its consistency checker live at the root of the `gh-pages` branch and are described with root-relative paths instead of `slides/`-prefixed paths on the source branch.
- `anatomy-figure-embeds`: figure outputs, their generator sources, and vendored third-party assets live at the root of the `gh-pages` branch and drop the `slides/` path prefix.

## Impact

- Removed on `master`: the entire `slides/` tree, including `slides/README.md`, `slides/index.html`, `slides/slides.css`, `slides/outline.md`, `slides/check-outline.py`, `slides/figures/**`, and `slides/vendor/**`.
- Edited on `master`: root `README.md`, `workshop/README.md`, `workshop/facilitator-guide.md`, plus the delta specs in this change that update the published specs under `openspec/specs/`.
- Git operations: a deletion commit on `master`; `gh-pages` is untouched. No history rewrite, no force-push, and no branch rename.
- No cloud resources, credentials, or dependencies change. The deck's navigation, typography, print/PDF export, offline operation, and pinned reveal.js 6.0.2 distribution are unaffected.
- Known pre-existing issue left untouched by request: `gh-pages:README.md` says the deck "lives in a top-level `slides/` directory" and gives `python3 -m http.server 8000 --directory slides`, which does not match its root-level hosting.

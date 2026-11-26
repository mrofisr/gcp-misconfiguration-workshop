# Tasks

## 1. Deck scaffold and vendored reveal.js

- [x] 1.1 Create a top-level `slides/` directory and vendor a pinned reveal.js distribution (core CSS/JS and only the plugins used) under `slides/vendor/`; verify `slides/index.html` references only local framework and theme files with no CDN URLs.
- [x] 1.2 Document and exercise a local static server rooted at `slides/`; verify the deck opens in a browser with no console errors and no external asset requests, including with the machine offline.

## 2. Slide content from the outline

- [x] 2.1 Author `slides/index.html` with an opening agenda slide and one top-level slide per segment, adding vertical detail slides only where the outline requires them; verify all seven segment titles and durations appear in order and the durations sum to 90 minutes with no new lab step.
- [x] 2.2 Copy the per-segment notes from `workshop/slides/outline.md` into reveal.js speaker notes; verify speaker view shows the current slide, notes, and next slide for each segment.
- [x] 2.3 Add a consistency check comparing the deck's segment titles and durations with `workshop/slides/outline.md`; verify it passes on the authored deck and fails when a duration is deliberately altered.

## 3. Anatomy figures

- [x] 3.1 Install the Anatomy skill for OpenCode with `npx skills add wheresryan22/anatomy -g -a opencode`; verify the `/anatomy` command is available and Node.js 20.10+ is installed for the kit.
- [x] 3.2 Use the Anatomy skill to create build scripts under `slides/figures/src/` and generate three self-contained interactive HTML figures — bucket/IAM guest list, public bucket plus over-permissive permission, and hardcoded key plus unsafe file name — into `slides/figures/`; verify each opens from the local server with its control changing the figure state and its readout updating from the same state.
- [x] 3.3 Generate a static SVG poster for each figure; verify every poster shows the figure title, caption, and key state and renders with JavaScript disabled.

## 4. Embedding, typography, and print

- [x] 4.1 Embed each figure in its slide with a fixed-aspect-ratio iframe marked `data-prevent-swipe`; verify each figure is fully visible at projector and laptop viewport sizes and that pointer or keyboard interaction inside it does not change the deck slide.
- [x] 4.2 Apply the font stack `'Google Sans', 'Google Sans Code', Roboto, sans-serif` on `.reveal` with no `@font-face` rule and no external font link; verify the computed font-family starts with Google Sans, no font request is made, and slide text stays inside its bounds with fallback fonts at both viewport sizes.
- [x] 4.3 Add a print stylesheet that swaps figure iframes for their static posters and respects `prefers-reduced-motion`; verify a PDF exported from `index.html?print-pdf` contains one slide per page, in order, with a visible static figure on every figure slide and no animation on load.

## 5. Documentation and final validation

- [x] 5.1 Write `slides/README.md` documenting the pinned reveal.js version, local server command, navigation and overview controls, PDF export steps, and the Anatomy repository URL, OpenCode install command, and figure regeneration command; verify every documented command works from a fresh checkout.
- [x] 5.2 Run an end-to-end verification of offline serving, keyboard and touch navigation, overview mode, speaker notes, figure interaction isolation, fallback-font layout, and PDF export; verify each observable behavior against `revealjs-slide-deck` and `anatomy-figure-embeds`.
- [x] 5.3 Run `openspec validate "add-revealjs-slides" --strict`; verify no errors or warnings remain.

## Workflow follow-up

- Archive the change after the project's review requirements are satisfied.
- Verify the archived result and that the deck is ready to present from a fresh checkout.

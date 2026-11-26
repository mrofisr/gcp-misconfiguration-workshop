# Proposal

## Why

The workshop has a written 90-minute agenda in `workshop/slides/outline.md` but no presentation deck; facilitators currently talk from the outline. A projector-ready deck is needed to deliver the timed segments consistently, and the plain-language security concepts (bucket, IAM, public exposure, hardcoded keys) need tangible visuals for an audience with no cloud background.

## What Changes

- Add a new top-level `slides/` directory containing a reveal.js presentation that follows all seven segments of the agenda in `workshop/slides/outline.md`: setup 10 min, intro 10 min, find 15 min, fix 1 20 min, fix 2 15 min, verify 10 min, recap/teardown 10 min.
- Make the deck run from a local static web server with a pinned reveal.js distribution, so presenting does not depend on a build step, an npm install, or live internet access during the session.
- Use the **Anatomy agent skill** from GitHub (`https://github.com/wheresryan22/anatomy`, OpenCode target) to generate self-contained interactive isometric figures for the plain-language intro and both fixes, and embed them in the relevant slides with static fallbacks.
- Apply a deck-wide Google Sans CSS stack (`'Google Sans', 'Google Sans Code', Roboto, sans-serif`) with no bundled font files and no external font request; rendering degrades gracefully when Google Sans is not installed.
- Support keyboard and touch navigation, speaker notes, overview mode, and print/PDF export; keep text legible at projector size and on a laptop.
- Add `slides/README.md` documenting how to serve, present, navigate, and export the deck, and how to regenerate the Anatomy figures.
- Leave `workshop/slides/outline.md` and all other `workshop/` material unchanged. No breaking changes.

Assumptions recorded for planning:

- Slide content is derived from the existing outline; this change adds presentation form, not new curriculum.
- Delivery language stays English, matching the existing outline and guides.
- Anatomy figures are generated ahead of the session and committed as built assets, not generated live while presenting.
- Google Sans is used only if present on the presenting machine; no proprietary font files are redistributed.

## Capabilities

### New Capabilities

- `revealjs-slide-deck`: The presentation contract — a navigable reveal.js deck covering the full 90-minute agenda, runnable locally with declared typography and printable/exportable output.
- `anatomy-figure-embeds`: The interactive figure contract — Anatomy-generated isometric explainers embedded in the deck, with static fallbacks for print and reduced motion.

### Modified Capabilities

- none — no existing specs in this project.

## Impact

- New top-level `slides/` folder; no changes to `workshop/` content or any GCP resources.
- Dependencies: reveal.js (pinned distribution), the Anatomy agent skill and its Node-based kit (Node.js 20.10+ for generation only), and a local static HTTP server for presenting and PDF export.
- Google Sans is proprietary and is not served by the public Google Fonts API, so the specified stack relies on a locally installed font and otherwise falls back.
- PDF export requires a Chromium-based browser for reveal.js print rendering.
- No credentials, billing, or cloud spend are involved.

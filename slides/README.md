# Workshop slide deck

A reveal.js presentation for the 90-minute workshop. It lives in a top-level `slides/` directory and is derived from [`workshop/slides/outline.md`](../workshop/slides/outline.md), which remains the authoritative agenda.

The deck needs no build step, npm install, or internet access at presentation time. reveal.js and the three interactive figures are committed here.

## Contents

- `index.html` — the presentation, one top-level slide per agenda segment with vertical detail slides.
- `slides.css` — Google Sans font stack, slide layout, figure embeds, print and reduced-motion rules.
- `vendor/` — pinned **reveal.js 6.0.2** (`reveal.css`, `reveal.js`, the `simple` light theme, the notes plugin, and its MIT license). The theme's two Google Fonts `@import` rules were removed so the deck makes no external font request.
- `figures/` — three standalone Anatomy HTML figures and their static SVG posters: `bucket-iam`, `public-bucket`, `hardcoded-key`.
- `figures/src/` — the build scripts, a shared helper module, and the Anatomy kit copied from the skill so figures can be regenerated from a fresh checkout.
- `check-outline.py` — checks that slide titles, durations, and order still match the outline.

## Present it

From the repository root:

```bash
python3 -m http.server 8000 --directory slides
```

Open <http://localhost:8000/index.html>. A static server is required because the figures are same-origin iframes; opening the file directly with `file://` is not supported.

| Action | Control |
| --- | --- |
| Next / previous slide | Right / Left arrow, Space / Shift+Space, or on-screen arrows |
| Down a segment / back up | Down / Up arrow |
| See all slides | `o` (overview), then click a slide to jump to it |
| Speaker notes | `s` — opens speaker view with current slide, notes, and next slide |
| Fullscreen | `f` |

To interact with a figure, move the pointer over it, click it, or focus it and press an arrow key. Figure interaction does not move the deck.

## Export to PDF

Open the print view in Chromium or Chrome:

<http://localhost:8000/index.html?print-pdf>

Then use the browser print dialog, enable **Background graphics**, and save as PDF. Each slide becomes one page; embedded figures are replaced by their static SVG posters in print. The same poster appears automatically when the viewer requests reduced motion.

## Check the agenda match

```bash
python3 slides/check-outline.py
```

It prints the seven segments and confirms they total 90 minutes. Pass another file path to check a modified deck, for example `python3 slides/check-outline.py /tmp/deck.html`; it exits non-zero when a title, order, or duration has drifted from `workshop/slides/outline.md`.

## Regenerate the Anatomy figures

The figures were built with the [Anatomy agent skill](https://github.com/wheresryan22/anatomy), which explains an idea by building a working isometric object. To install it for OpenCode:

```bash
npx skills add wheresryan22/anatomy -g -a opencode
```

The installer may place the skill in `~/.agents/skills/anatomy` (universal) or `~/.config/opencode/skills/anatomy`, depending on the CLI version; in either case the `/anatomy` command becomes available after the agent reloads. Generating or editing figures needs Node.js 20.10 or later. The kit itself is vendored in `figures/src/kit/`, so rebuilding the committed figures needs Node but no network access or skill installation.

From the repository root:

```bash
cd slides/figures/src
node bucket-iam.mjs
node public-bucket.mjs
node hardcoded-key.mjs
```

Each script writes a standalone `figures/<name>.html` and a static `figures/<name>.svg`. The deck loads the HTML with `?embed`, which hides the figure's legend and hint so the framed card fits inside a slide; opening the HTML without that parameter shows the full standalone page.

## Typography

`slides.css` declares `font-family: "Google Sans", "Google Sans Code", Roboto, sans-serif` on `.reveal`. Google Sans is proprietary and is not served by the public Google Fonts API, so no font file is bundled or requested. If it is not installed on the presenting machine, the next available fallback is used; slide text was checked for clipping at both 1920×1080 and 1366×768 with the fallback active.

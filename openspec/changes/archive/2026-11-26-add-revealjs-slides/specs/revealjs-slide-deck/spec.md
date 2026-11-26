# Spec Delta

## Purpose

Defines the behavior of the workshop presentation deck: a locally runnable reveal.js presentation that delivers the existing 90-minute agenda with consistent navigation, typography, and export.

## ADDED Requirements

### Requirement: Full agenda coverage

The deck SHALL present all seven segments from `workshop/slides/outline.md` in their published order, showing each segment title and its allotted duration: setup 10, intro 10, find 15, fix one 20, fix two 15, verify 10, recap and teardown 10. The displayed durations SHALL total 90 minutes. The deck SHALL NOT add a new lab step or change a published duration.

#### Scenario: Deck opens on the agenda

- **WHEN** a facilitator opens the deck in a browser
- **THEN** the first slide shows the workshop title and an agenda listing all seven segments with a total of 90 minutes

#### Scenario: Segment order is preserved

- **WHEN** the facilitator advances through the deck from beginning to end
- **THEN** the seven segments appear in the order setup, intro, find, fix one, fix two, verify, recap and teardown, with no extra lab step

### Requirement: Local build-free operation

The deck SHALL run from a local static HTTP server rooted at `slides/` with no build step, package installation, or network request for the presentation framework or theme assets. All framework and theme assets SHALL be available inside `slides/`.

#### Scenario: Presenting without internet access

- **WHEN** the machine serving `slides/` has no internet access and `index.html` is opened through the local server
- **THEN** the deck renders and all slides are navigable without missing framework or theme assets

#### Scenario: No network dependency for assets

- **WHEN** the deck is loaded in a browser with network monitoring enabled
- **THEN** no request is made to an external CDN for reveal.js, its theme, or its plugins

### Requirement: Navigation and facilitator support

The deck SHALL support next and previous navigation by keyboard and by touch or swipe, SHALL provide an overview of all slides, and SHALL expose speaker notes for each segment so a facilitator can follow the outline notes without leaving the presentation.

#### Scenario: Keyboard navigation

- **WHEN** a facilitator presses the next and previous arrow keys
- **THEN** the deck moves one slide forward and backward respectively

#### Scenario: Overview mode

- **WHEN** the facilitator activates overview mode
- **THEN** all slides are visible as an indexed grid that can be used to jump to a segment

#### Scenario: Speaker notes

- **WHEN** the facilitator opens the speaker view for a segment
- **THEN** the notes for that segment are visible alongside the current and next slides

### Requirement: Google Sans typography

The deck root SHALL declare the font-family stack `'Google Sans', 'Google Sans Code', Roboto, sans-serif` for all presentation text. The deck SHALL NOT bundle Google Sans font files or request Google Sans from an external font service. When Google Sans is unavailable, the fallback fonts SHALL render all slide text legibly at projector size without clipped or overlapping content.

#### Scenario: Font stack is applied

- **WHEN** slide text is inspected in the browser
- **THEN** its computed font-family begins with `'Google Sans'` and includes the declared fallbacks in order

#### Scenario: Google Sans is not installed

- **WHEN** the deck is opened on a machine without Google Sans
- **THEN** text renders with a fallback font, remains within its slide bounds, and no font request fails

### Requirement: Print and PDF export

The deck SHALL support browser print rendering that produces one slide per page and preserves all seven segments, their text, and static figure alternatives. The export SHALL be obtainable without changing slide content.

#### Scenario: Export to PDF

- **WHEN** the facilitator uses the browser print dialog to save the deck as a PDF
- **THEN** the PDF contains one page per slide, in slide order, with readable text and a visible static alternative for every embedded figure

### Requirement: Deck instructions

A `slides/README.md` SHALL document how to start a local static server, present and navigate the deck, export a PDF, and regenerate embedded Anatomy figures. Its commands SHALL match the assets actually present in `slides/`.

#### Scenario: Facilitator follows the README

- **WHEN** a facilitator follows the README from a fresh checkout
- **THEN** the deck is served locally, navigable, and exportable using only the documented commands and files

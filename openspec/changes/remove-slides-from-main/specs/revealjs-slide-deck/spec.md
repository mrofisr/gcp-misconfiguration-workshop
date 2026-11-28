# Spec Delta

## ADDED Requirements

### Requirement: Deck hosted only on gh-pages

The deck and all of its assets SHALL be hosted exclusively on the `gh-pages` branch, at that branch's root. The source development branch SHALL NOT contain a copy of the deck or any slide asset.

#### Scenario: Source branch has no deck assets

- **WHEN** the default development branch is inspected
- **THEN** no `slides/` directory, `index.html`, `slides.css`, `outline.md`, figure, or vendor asset for the deck is present

#### Scenario: Deck is present on gh-pages

- **WHEN** the `gh-pages` branch is inspected
- **THEN** `index.html`, `slides.css`, `outline.md`, `check-outline.py`, `figures/`, and `vendor/` are present at the branch root

## MODIFIED Requirements

### Requirement: Full agenda coverage

The deck SHALL present all seven segments from the `outline.md` at the deck's published root in their published order, showing each segment title and its allotted duration: setup 10, intro 10, find 15, fix one 20, fix two 15, verify 10, recap and teardown 10. The displayed durations SHALL total 90 minutes. The deck SHALL NOT add a new lab step or change a published duration.

#### Scenario: Deck opens on the agenda

- **WHEN** a facilitator opens the deck in a browser
- **THEN** the first slide shows the workshop title and an agenda listing all seven segments with a total of 90 minutes

#### Scenario: Segment order is preserved

- **WHEN** the facilitator advances through the deck from beginning to end
- **THEN** the seven segments appear in the order setup, intro, find, fix one, fix two, verify, recap and teardown, with no extra lab step

### Requirement: Local build-free operation

The deck SHALL run from a local static HTTP server rooted at the deck's published root with no build step, package installation, or network request for the presentation framework or theme assets. All framework and theme assets SHALL be available inside that deck root.

#### Scenario: Presenting without internet access

- **WHEN** the machine serving the deck root has no internet access and `index.html` is opened through the local server
- **THEN** the deck renders and all slides are navigable without missing framework or theme assets

#### Scenario: No network dependency for assets

- **WHEN** the deck is loaded in a browser with network monitoring enabled
- **THEN** no request is made to an external CDN for reveal.js, its theme, or its plugins

### Requirement: Deck instructions

A `README.md` at the deck's published root SHALL document how to start a local static server, present and navigate the deck, export a PDF, and regenerate embedded Anatomy figures. Its commands SHALL match the assets actually present in the deck root.

#### Scenario: Facilitator follows the README

- **WHEN** a facilitator follows the README from a fresh checkout of the published deck
- **THEN** the deck is served locally, navigable, and exportable using only the documented commands and files

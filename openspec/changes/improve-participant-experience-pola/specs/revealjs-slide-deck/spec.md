# Spec Delta

## MODIFIED Requirements

### Requirement: Full agenda coverage

The deck SHALL present all seven segments from `slides/outline.md` in their published order, showing each segment title and its allotted duration: setup 10, intro 10, find 15, fix one 20, fix two 15, verify 10, recap and teardown 10. The displayed durations SHALL total 90 minutes. The deck SHALL NOT add a new lab step or change a published duration. `slides/outline.md` SHALL be the single authoritative agenda and no duplicate outline SHALL remain elsewhere in the repository.

#### Scenario: Deck opens on the agenda

- **WHEN** a facilitator opens the deck in a browser
- **THEN** the first slide shows the workshop title and an agenda listing all seven segments with a total of 90 minutes

#### Scenario: Segment order is preserved

- **WHEN** the facilitator advances through the deck from beginning to end
- **THEN** the seven segments appear in the order setup, intro, find, fix one, fix two, verify, recap and teardown, with no extra lab step

#### Scenario: Agenda checker uses the canonical path

- **WHEN** the consistency checker in `slides/` is run from a fresh checkout
- **THEN** it reads `slides/outline.md` and reports a pass without depending on a path under `workshop/`

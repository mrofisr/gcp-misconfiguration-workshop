# Spec Delta

## Purpose

Makes the cloned workshop repository self-explanatory for first-time cloud users, so folder names, command names, and safety notices match what a newcomer naturally expects.

## ADDED Requirements

### Requirement: Single front door

The repository SHALL contain a root `README.md` that is the first file a participant is told to open. It SHALL point to the participant start path, identify the purpose of every top-level directory, and state the two safety heads-ups: the starter is deliberately insecure and any `lab-key*.json` file is a fake placeholder.

#### Scenario: Participant opens the clone

- **WHEN** a participant opens a fresh clone without any verbal instruction
- **THEN** the root README names the first file to read and the first command to run

#### Scenario: Maintainer areas are labelled

- **WHEN** a participant looks at the top-level directory table in the root README
- **THEN** `openspec/` and `slides/` are labelled as maintainer material and `workshop/` is labelled as the participant area

### Requirement: One location per concept

Each top-level concept SHALL have one canonical location and one name. There SHALL be exactly one `slides/` directory, and the authoritative agenda SHALL live in it. The vulnerable starter directory name SHALL state that it is vulnerable.

#### Scenario: Looking for the agenda

- **WHEN** a participant searches the tree for the slide outline
- **THEN** exactly one `outline.md` exists and it is under `slides/`

#### Scenario: Looking for the starter code

- **WHEN** a participant reads the name of the starter directory
- **THEN** the name communicates that the code is deliberately insecure

### Requirement: Facilitator material is marked

Any file intended only for facilitators SHALL announce that participants do not need it before any instructional content.

#### Scenario: Participant opens the facilitator guide

- **WHEN** a participant opens `workshop/facilitator-guide.md`
- **THEN** the first line states that it is for facilitators only and that participants do not need it

### Requirement: Danger is announced before use

The vulnerable starter SHALL open its README with a notice that the code is deliberately insecure and must only be deployed into the lab project. Generated figure outputs SHALL carry a header stating that they are generated from sources under `src/` and must not be hand-edited. Vendored third-party code SHALL be identified as third-party.

#### Scenario: Maintainer opens a generated figure

- **WHEN** a maintainer opens a generated figure output such as a `.svg` or `.html` under `slides/figures/`
- **THEN** a comment states that the file is generated and that the source under `src/` should be edited instead

#### Scenario: Participant opens the starter README

- **WHEN** a participant opens the vulnerable starter README
- **THEN** the danger notice appears before the list of contents

### Requirement: Consistent vocabulary

The label "lab project" SHALL be used for the provisioned Google Cloud project in guides, slides, glossary, and command output. The glossary SHALL define the term. Conflicting labels such as "your project" SHALL NOT be introduced for the same resource.

#### Scenario: Participant reads the glossary

- **WHEN** a participant looks up the project used in the lab
- **THEN** the glossary defines "lab project" as the organizer-provided project

### Requirement: Clone is sufficient to start

A fresh clone plus the root README SHALL be enough for a participant to reach the first lab step without verbal help beyond the facilitator's normal narration. An uninvolved reviewer shown the tree and command list SHALL correctly predict each folder's contents and each command's effect.

#### Scenario: Stranger test

- **WHEN** an uninvolved reviewer is shown the repository tree and command list without explanation
- **THEN** their predicted purpose for each folder and command matches the documented purpose or any mismatch is recorded and fixed

#### Scenario: Dry run from a fresh clone

- **WHEN** a participant clones the public repository and follows only the root README
- **THEN** they reach the first checkpoint of the participant guide without asking what to open or run

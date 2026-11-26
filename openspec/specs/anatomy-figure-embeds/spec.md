# anatomy-figure-embeds Specification

## Purpose

Defines the behavior of the Anatomy-generated isometric explainers embedded in the workshop deck: interactive, self-contained figures that make cloud security ideas visible, with static alternatives for print and reduced motion.

## Requirements

### Requirement: Concept coverage

The deck SHALL include at least three interactive Anatomy figures: the plain-language bucket and IAM analogy for segment 2, the public bucket and over-permissive permission for fix one, and the hardcoded credential and unsafe file name for fix two.

#### Scenario: Intro figure explains bucket and IAM

- **WHEN** the facilitator reaches segment 2 of the deck
- **THEN** an interactive figure shows a bucket as a container and access as a guest list

#### Scenario: Fix figures match the lab

- **WHEN** the facilitator reaches fix one or fix two
- **THEN** an embedded figure depicts the vulnerability being fixed in that segment

### Requirement: Figure state feedback

Each figure SHALL provide a visible control that changes its state and a readout that reflects that same state, so a viewer can see the consequence of the change.

#### Scenario: Changing a figure control

- **WHEN** a viewer operates the control on any embedded figure
- **THEN** the figure visibly changes state and its readout updates to match the new state

### Requirement: Figure content accuracy

Figure labels and numbers SHALL agree with `workshop/slides/outline.md` and the starter stack. No figure SHALL assert a behavior that the lab does not perform.

#### Scenario: Figure claims are checked

- **WHEN** a figure label or number is compared with the outline and starter stack
- **THEN** it matches the documented behavior and duration with no unsupported claim

### Requirement: Self-contained figure assets

Each figure SHALL be a standalone HTML file under `slides/figures/` that renders from the local static server with inline styles and scripts, with no runtime dependency on a CDN, npm install, or a build step during presentation. The figure source and generation script SHALL be retained under `slides/` so every committed figure can be regenerated.

#### Scenario: Figure opens independently

- **WHEN** a figure HTML file under `slides/figures/` is opened directly through the local static server with no internet access
- **THEN** the figure renders, its control responds, and its readout updates from the same state

#### Scenario: Figure is reproducible

- **WHEN** a facilitator runs the documented generation command from a fresh checkout
- **THEN** the generated figure files are recreated under `slides/figures/` with the same content and no additional dependency installation at presentation time

### Requirement: Embedding without disrupting navigation

Figures SHALL be embedded in their slides so that they fit within the slide bounds and remain interactive. Interacting with a figure control, including pointer and keyboard input inside it, SHALL NOT advance, retreat, or otherwise change the deck slide.

#### Scenario: Interacting with a figure

- **WHEN** a facilitator clicks or presses keys on a figure control while its slide is active
- **THEN** the figure state changes and the deck remains on the same slide

#### Scenario: Figure fits the slide

- **WHEN** the deck is displayed at projector size and at a laptop viewport size
- **THEN** each figure is fully visible inside its slide without clipping or overlapping slide text

### Requirement: Static and reduced-motion alternatives

Each embedded figure SHALL have a static SVG or poster alternative that is displayed in print/PDF output and when reduced motion is requested. The alternative SHALL preserve the figure's title, caption, and key state, and SHALL remain readable without JavaScript or WebGL.

#### Scenario: Printed deck shows static figures

- **WHEN** the deck is exported to PDF
- **THEN** each figure slide shows its static alternative instead of a blank or unrendered embed

#### Scenario: Reduced motion is active

- **WHEN** a viewer has reduced motion enabled and opens a figure slide
- **THEN** the figure does not animate on load and the static alternative or a still state is presented

### Requirement: Generation method

Every committed figure SHALL be generated with the Anatomy agent skill from `https://github.com/wheresryan22/anatomy`, and the deck documentation SHALL identify that source and the command used to install it for OpenCode. Generated figures SHALL use the skill's kit output rather than hand-authored imitations of its visual style.

#### Scenario: Figure provenance is documented

- **WHEN** a maintainer reads `slides/README.md`
- **THEN** the Anatomy repository URL, the OpenCode install command, and the figure generation command are stated explicitly

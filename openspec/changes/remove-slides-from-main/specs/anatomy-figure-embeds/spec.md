# Spec Delta

## MODIFIED Requirements

### Requirement: Figure content accuracy

Figure labels and numbers SHALL agree with the `outline.md` at the deck's published root and the vulnerable starter stack. No figure SHALL assert a behavior that the lab does not perform.

#### Scenario: Figure claims are checked

- **WHEN** a figure label or number is compared with the outline and starter stack
- **THEN** it matches the documented behavior and duration with no unsupported claim

### Requirement: Self-contained figure assets

Each figure SHALL be a standalone HTML file under `figures/` at the deck's published root that renders from the local static server with inline styles and scripts, with no runtime dependency on a CDN, npm install, or a build step during presentation. The figure source and generation script SHALL be retained inside the deck root so every committed figure can be regenerated.

#### Scenario: Figure opens independently

- **WHEN** a figure HTML file under the deck's `figures/` is opened directly through the local static server with no internet access
- **THEN** the figure renders, its control responds, and its readout updates from the same state

#### Scenario: Figure is reproducible

- **WHEN** a facilitator runs the documented generation command from a fresh checkout of the published deck
- **THEN** the generated figure files are recreated under the deck's `figures/` with the same content and no additional dependency installation at presentation time

### Requirement: Generation method

Every committed figure SHALL be generated with the Anatomy agent skill from `https://github.com/wheresryan22/anatomy`, and the deck documentation SHALL identify that source and the command used to install it for OpenCode. Generated figures SHALL use the skill's kit output rather than hand-authored imitations of its visual style.

#### Scenario: Figure provenance is documented

- **WHEN** a maintainer reads the `README.md` at the deck's published root
- **THEN** the Anatomy repository URL, the OpenCode install command, and the figure generation command are stated explicitly

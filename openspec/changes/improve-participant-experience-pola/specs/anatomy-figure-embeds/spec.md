# Spec Delta

## MODIFIED Requirements

### Requirement: Figure content accuracy

Figure labels and numbers SHALL agree with `slides/outline.md` and the vulnerable starter stack. No figure SHALL assert a behavior that the lab does not perform.

#### Scenario: Figure claims are checked

- **WHEN** a figure label or number is compared with the outline and the vulnerable starter stack
- **THEN** it matches the documented behavior and duration with no unsupported claim

#### Scenario: Figure path references are current

- **WHEN** the figure documentation or generator is inspected for outline paths
- **THEN** every reference points to `slides/outline.md` and no reference to `workshop/slides/outline.md` remains

## ADDED Requirements

### Requirement: Generated figures are self-labelling

Every committed figure output SHALL carry a header stating that it is generated from sources under `src/` and that the source, not the output, must be edited. Vendored third-party code under `slides/vendor/` SHALL be identified as third-party and not edited.

#### Scenario: Maintainer edits a figure

- **WHEN** a maintainer opens a generated figure output with an editor
- **THEN** a header comment identifies the corresponding source under `src/` as the file to edit

#### Scenario: Maintainer inspects vendored code

- **WHEN** a maintainer opens `slides/vendor/`
- **THEN** documentation identifies the contents as third-party code with its own license

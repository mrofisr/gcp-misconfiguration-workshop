# Spec Delta

## MODIFIED Requirements

### Requirement: Complete project content published

The repository MUST contain the entire source tree — `openspec/` and `workshop/` — as tracked files in the initial commit. Slide assets MUST NOT be part of the published source tree; the deck remains published on the `gh-pages` branch.

#### Scenario: All top-level areas present

- **WHEN** the initial commit is pushed and the repository is cloned
- **THEN** the clone contains the `openspec/` and `workshop/` directories and no `slides/` directory

#### Scenario: No intended content omitted

- **WHEN** the initial commit is compared with the local source tree
- **THEN** all source files are tracked except those matched by `.gitignore`, and no slide asset is tracked on the source branch

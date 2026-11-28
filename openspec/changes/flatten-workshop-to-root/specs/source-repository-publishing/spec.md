# Spec Delta

## MODIFIED Requirements

### Requirement: Complete project content published

The repository MUST contain the entire source tree at the repository root — `openspec/`, the lab guides (`README.md`, `glossary.md`, `participant-lab-guide.md`), `scripts/`, `Makefile`, `setup-windows.ps1`, `.env.example`, `.agents/`, `app/`, `terraform/`, and `.gitattributes` — as tracked files in the initial commit. There MUST be neither a `workshop/` nor a `vulnerable-starter/` directory, and no `facilitator-guide.md`. Slide assets MUST NOT be part of the published source tree; the deck remains published on the `gh-pages` branch.

#### Scenario: All top-level areas present

- **WHEN** the initial commit is pushed and the repository is cloned
- **THEN** the clone contains `openspec/`, `scripts/`, `app/`, `terraform/`, `.gitattributes`, the root wrappers and config, and the root-level guides, with no `workshop/`, `vulnerable-starter/`, `facilitator-guide.md`, or `slides/`

#### Scenario: No intended content omitted

- **WHEN** the initial commit is compared with the local source tree
- **THEN** all source files are tracked except those matched by `.gitignore`, and no slide asset is tracked on the source branch

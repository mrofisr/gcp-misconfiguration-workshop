# Spec Delta

## MODIFIED Requirements

### Requirement: Complete project content published

The repository MUST contain the entire source tree at the repository root — the lab guides (`README.md`, `glossary.md`, `participant-lab-guide.md`), `scripts/`, `Makefile`, `setup-windows.ps1`, `.env.example`, `.agents/`, `app/`, `terraform/`, and `.gitattributes` — as tracked files in the initial commit. `openspec/` MUST NOT be tracked or published; it remains a local-only directory on maintainer machines. Slide assets MUST NOT be part of the published source tree; the deck remains published on the `gh-pages` branch.

#### Scenario: All top-level areas present

- **WHEN** the initial commit is pushed and the repository is cloned
- **THEN** the clone contains the flat root lab material and no `openspec/`, `workshop/`, `vulnerable-starter/`, or `slides/` directory

#### Scenario: No intended content omitted

- **WHEN** the initial commit is compared with the local source tree
- **THEN** all lab source files are tracked except those matched by `.gitignore`, no slide asset is tracked, and no file under `openspec/` is tracked

### Requirement: Local and generated artifacts excluded

The repository MUST NOT contain local or generated artifacts. A `.gitignore` MUST exclude them before the initial commit is created, including a local-only `openspec/` directory.

#### Scenario: Secrets and generated state excluded

- **WHEN** local `.env` files, `.terraform/` directories, or Terraform state files exist locally
- **THEN** they are ignored by Git and absent from the pushed repository

#### Scenario: Example config retained

- **WHEN** the committed content is inspected
- **THEN** intentionally tracked example files such as `.env.example` remain present

#### Scenario: Local OpenSpec artifacts excluded

- **WHEN** a maintainer has an `openspec/` directory on disk
- **THEN** Git reports it as ignored and no file under it is present in the pushed repository

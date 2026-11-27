# Spec Delta

## REMOVED Requirements

### Requirement: Private repository visibility

**Reason**: The workshop repository is now published publicly so participants can clone it directly; the visibility requirement that restricted it to the owner and invited collaborators no longer applies.
**Migration**: Treat the repository as public. Use the scratch-repository push verification below to confirm that publish-safe content does not trip secret scanning.

## ADDED Requirements

### Requirement: Public repository visibility

The published repository SHALL be public and cloneable without authentication. Every participant SHALL be able to clone this repository rather than a separate trimmed copy.

#### Scenario: Repository visibility

- **WHEN** the repository visibility is inspected on GitHub
- **THEN** it is `public` and a clone needs no invitation

#### Scenario: Participant clones the real repository

- **WHEN** a participant clones the repository for the workshop
- **THEN** the clone is the same repository that maintainers use, including `workshop/`, `slides/`, and `openspec/`

### Requirement: Placeholder secrets are publish-safe

Any credential-shaped file committed to the public repository SHALL be an invalid placeholder that carries explicit `REPLACE_WITH_` or `PLACEHOLDER_` markers and no usable key material. If a real key is ever written to the tracked path, the tracked file SHALL become an `.example` file and the real path SHALL be ignored.

#### Scenario: Committed key is inspected

- **WHEN** a reviewer opens the committed `lab-key.json`
- **THEN** its fields are placeholders and its private key is not usable

#### Scenario: A real key is introduced

- **WHEN** a script or hand edit writes a real credential into the key path
- **THEN** the tracked file is renamed to an example file and the real path is ignored by Git

### Requirement: Value-bearing local files excluded

The `.gitignore` SHALL exclude local environment overrides, Terraform caches and state, and any `*.tfvars` file that could hold real project values, while retaining committed examples and lock files.

#### Scenario: Local values are ignored

- **WHEN** `git check-ignore` is run on a local `.env`, a `.terraform/` directory, a state file, and a value-bearing `.tfvars`
- **THEN** each path is ignored

#### Scenario: Examples remain tracked

- **WHEN** the committed content is inspected
- **THEN** `.env.example`, `*.tfvars.example`, and the Terraform lock file remain present

### Requirement: Publish verification before the session

Before the public push, a scratch push SHALL confirm that secret scanning does not block the placeholder, and a fresh clone SHALL confirm that no ignored local artifacts were published.

#### Scenario: Scratch push of the placeholder

- **WHEN** the repository content is pushed to a scratch public repository
- **THEN** the push succeeds without a secret-scanning block on the placeholder key

#### Scenario: Fresh clone contains only publish-safe files

- **WHEN** a fresh clone is inspected after publishing
- **THEN** no local `.env`, `.terraform/` directory, state file, or value-bearing `.tfvars` is present

# Spec Delta

## Purpose

Defines the behavior of publishing the project's source as a private, cloneable GitHub repository, including what content is included, what is excluded, and how the published state is verified.

## ADDED Requirements

### Requirement: Private repository visibility

The published repository MUST be private, so its contents are visible only to the authenticated owner and explicitly invited collaborators.

#### Scenario: Repository visibility

- **WHEN** the repository is created on GitHub
- **THEN** its visibility is `private` and it is not discoverable in public searches

### Requirement: Complete project content published

The repository MUST contain the entire project directory — `openspec/`, `workshop/`, and `slides/` — as tracked files in the initial commit.

#### Scenario: All top-level areas present

- **WHEN** the initial commit is pushed and the repository is cloned
- **THEN** the clone contains the `openspec/`, `workshop/`, and `slides/` directories

#### Scenario: No intended content omitted

- **WHEN** the initial commit is compared with the local project directory
- **THEN** all project files are tracked except those matched by `.gitignore`

### Requirement: Local and generated artifacts excluded

The repository MUST NOT contain local or generated artifacts. A `.gitignore` MUST exclude them before the initial commit is created.

#### Scenario: Secrets and generated state excluded

- **WHEN** local `.env` files, `.terraform/` directories, or Terraform state files exist locally
- **THEN** they are ignored by Git and absent from the pushed repository

#### Scenario: Example config retained

- **WHEN** the committed content is inspected
- **THEN** intentionally tracked example files such as `.env.example` remain present

### Requirement: Repository identity and remote

The remote repository MUST be named `gcp-misconfiguration-workshop` under the authenticated GitHub account and MUST be configured as the `origin` remote.

#### Scenario: Remote configured

- **WHEN** publishing completes
- **THEN** `origin` points to the `gcp-misconfiguration-workshop` repository under the authenticated GitHub account

### Requirement: Published state verified

After publishing, the local working tree MUST be clean and the remote MUST contain the initial commit.

#### Scenario: Clean working tree after push

- **WHEN** the initial push finishes
- **THEN** the local working tree has no uncommitted changes and the remote branch contains the initial commit

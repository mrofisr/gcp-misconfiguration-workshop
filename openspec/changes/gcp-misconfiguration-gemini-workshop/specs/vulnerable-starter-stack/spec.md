# Spec Delta

## Purpose

Defines the deliberately insecure starter stack — Terraform, a Go/HTMX file-browser app, and Cloud Storage — that participants inherit at the start of the workshop and repair with Gemini 4.

## ADDED Requirements

### Requirement: Vulnerable Terraform baseline
The starter Terraform configuration SHALL provision a Cloud Storage bucket that is publicly readable, an `allUsers` object viewer binding, a service account with an over-permissive role, and a service-account key resource, using variables for project and unique name prefix.

#### Scenario: Facilitator applies the baseline
- **WHEN** the facilitator runs `terraform apply` in a clean lab project
- **THEN** the bucket is publicly readable, the `allUsers` binding exists, and the service account holds the over-permissive role

### Requirement: Vulnerable Go and HTMX application
The starter app SHALL be a single-page Go + HTMX file browser that lists objects in the lab bucket, loads a service-account key from a hardcoded path, omits an authorization check, and uses an unsanitized object name from the request.

#### Scenario: App runs in the vulnerable state
- **WHEN** the app is deployed to Cloud Run and a request names an object
- **THEN** the app lists or serves the object without authorization and the hardcoded key path is visible in the source

### Requirement: Deterministic reproduction
The starter stack SHALL produce the same vulnerable state on every clean apply, with documented input variables and no dependence on pre-existing resources beyond the provisioned project.

#### Scenario: Two facilitators prepare the same lab
- **WHEN** two facilitators apply the baseline with the documented variables
- **THEN** both environments expose the same vulnerability classes and the same app behavior

### Requirement: Minimal documented fixes
Each vulnerability in the starter stack SHALL have a minimal documented fix that changes only the Terraform configuration or the Go source and SHALL introduce no new billable resource.

#### Scenario: Participant applies a documented fix
- **WHEN** a participant edits the Terraform or Go source as documented
- **THEN** the corresponding vulnerability is removed without adding a new GCP resource or changing the app's intended purpose

### Requirement: Safe containment
The starter stack SHALL use unique lab-only names, SHALL NOT contain real credentials or customer data, and SHALL be fully removable by the teardown procedure.

#### Scenario: Lab environment is contained
- **WHEN** the teardown procedure is run after the session
- **THEN** the bucket, Cloud Run service, IAM bindings, service account, and Terraform state are removed and no real secret was ever stored in the repository

### Requirement: Cross-platform command surface
The starter repository SHALL provide a `Makefile` for macOS/Linux, a `Taskfile.yaml` for go-task, and a `Setup.ps1` for Windows that bootstraps prerequisites, and each SHALL expose `doctor`, `plan`, `apply`, and `destroy` with equivalent observable behavior.

#### Scenario: Same commands on every platform
- **WHEN** a user runs `doctor`, `plan`, `apply`, or `destroy` through Make, go-task, or PowerShell
- **THEN** the command performs the same checks or changes and reports the same outcome on each platform

#### Scenario: Windows bootstrap
- **WHEN** a Windows user runs `Setup.ps1`
- **THEN** it installs or verifies gcloud, Terraform, Go, go-task, and the Antigravity CLI before exposing the four commands

# Spec Delta

## Purpose

Defines the budget and cleanup contract for organizer-provisioned lab projects with a $5 credit, Cloud Run, and Gemini 4, so the session cannot produce unexpected charges.

## ADDED Requirements

### Requirement: Organizer-owned credit boundary
The workshop material SHALL state that the $5 credit and billing account belong to the organizer, that participants SHALL NOT perform billing or project setup, and that the ceiling applies to each provisioned environment.

#### Scenario: Participant reads the cost note
- **WHEN** a participant opens the participant guide
- **THEN** the guide states who owns the project and that no participant billing action is required

### Requirement: Cost classification of every dependency
The workshop material SHALL list every service used with its cost classification, including Cloud Storage, IAM, Terraform, Cloud Run, gcloud CLI/MCP, and the Gemini 4 subscription, and SHALL state that Gemini 4 is not paid from the GCP credit.

#### Scenario: Reviewer audits the service list
- **WHEN** a reviewer compares the lab steps to the cost table
- **THEN** every service referenced appears in the table with a classification and the Gemini subscription is explicitly disclosed

### Requirement: Cloud Run cost limits
The provisioned Cloud Run service SHALL be configured with minimum instances zero, a maximum of one instance, a documented memory limit, and no always-on or reserved capacity, and SHALL be deleted at teardown.

#### Scenario: Cloud Run stays within budget
- **WHEN** the facilitator inspects the Cloud Run service configuration
- **THEN** min instances is zero, max instances is one, and no reserved or always-on capacity is present

### Requirement: Bounded Gemini usage
The lab SHALL publish a fixed maximum number of Antigravity CLI prompts per participant and SHALL disclose that Gemini 4 requires a Google AI subscription that is separate from the $5 GCP credit.

#### Scenario: Participant follows the prompt limit
- **WHEN** a participant completes the lab using the provided prompts
- **THEN** the number of prompts does not exceed the published maximum and the subscription prerequisite was stated before the first prompt

### Requirement: Cost checkpoint
The facilitator guide SHALL include a checkpoint before teardown that records observed spend against the $5 ceiling and an action for any overage.

#### Scenario: Facilitator checks spend
- **WHEN** the facilitator reaches the cost checkpoint after the session
- **THEN** spend is recorded as within or over budget and any overage is escalated with a documented action

### Requirement: Teardown through destroy
The `destroy` command SHALL delete the Cloud Run service, Cloud Storage bucket, IAM bindings, and Terraform-managed resources, and SHALL provide a verification command confirming no lab resources remain.

#### Scenario: Environment is cleaned up
- **WHEN** a user runs `destroy` after the session
- **THEN** all lab-created resources are absent and the project shows no continuing lab-driven charges

### Requirement: Safe command boundaries
All four commands SHALL be available to every participant. `doctor` and `plan` SHALL be read-only, and `apply` and `destroy` SHALL be idempotent, SHALL NOT create always-on or reserved capacity, and SHALL state their effect before execution.

#### Scenario: Read-only commands change nothing
- **WHEN** a participant runs `doctor` or `plan`
- **THEN** no GCP resource is created, modified, or deleted

#### Scenario: Repeated mutating commands
- **WHEN** a user runs `apply` or `destroy` twice in succession
- **THEN** the second run produces no duplicate resources and no error caused by the first run

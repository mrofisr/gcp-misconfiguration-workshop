# Spec Delta

## Purpose

Defines the 90-minute teaching contract for a beginner audience with no cloud background and no GCP setup, so any facilitator can deliver the same vulnerability-first session consistently.

## ADDED Requirements

### Requirement: Ninety-minute timed agenda
The workshop material SHALL publish an agenda totaling exactly 90 minutes with these segments: 10 min CLI/account setup, 10 min plain-language intro, 15 min finding issues, 20 min fix one, 15 min fix two, 10 min verification, and 10 min recap and teardown.

#### Scenario: Agenda fits the session slot
- **WHEN** a facilitator sums the published segment durations
- **THEN** the total equals 90 minutes and every segment has an allocated duration

### Requirement: Beginner-friendly language
The workshop material SHALL explain cloud, GCP, bucket, IAM, and deployment in plain language before first use, and SHALL avoid unexplained acronyms and concept-heavy theory.

#### Scenario: A participant with no cloud background follows along
- **WHEN** a participant reads the intro or a lab step
- **THEN** every unfamiliar term is defined in a short gloss and no prior cloud knowledge is assumed

### Requirement: Zero-setup participant contract
The workshop material SHALL NOT require participants to create a billing account, project, API enablement, or organization; the organizer-provided project, repository checkout, and credentials SHALL be the stated starting point.

#### Scenario: Participant starts the session
- **WHEN** a participant opens the prepared repository and environment
- **THEN** all GCP access is already provisioned and the first required action is the CLI setup step, not a cloud setup step

### Requirement: Copy-paste guided steps
The participant guide SHALL present each step as a copy-pasteable command or prompt with its expected result, and SHALL include a checkpoint after each of the two fixes.

#### Scenario: Participant completes a step
- **WHEN** a participant runs a documented command or prompt
- **THEN** the guide states the observable result that confirms success and a fallback if the result differs

### Requirement: Two-fix scope
The curriculum SHALL limit hands-on remediation to exactly two vulnerability classes and SHALL schedule every other topic as discussion or demonstration only.

#### Scenario: Session stays within the time budget
- **WHEN** the facilitator reaches the recap segment
- **THEN** both fixes have been completed and verified without adding a third remediation exercise

### Requirement: Facilitator preflight and troubleshooting
The facilitator guide SHALL contain a preflight checklist runnable through the `doctor` command covering provisioned projects, bucket, Cloud Run service, Terraform state, Antigravity CLI, MCP configuration, and ADC, plus troubleshooting for the common failures.

#### Scenario: Facilitator dry-runs the session
- **WHEN** the facilitator executes the preflight checklist before the event
- **THEN** each item records pass or fail and each failure has a documented remediation

### Requirement: Optional Security Command Center demo
The curriculum SHALL mark Security Command Center as an optional facilitator demonstration that participants may watch but SHALL NOT require participants to navigate SCC or depend on its tier or detectors.

#### Scenario: SCC is unavailable in the lab project
- **WHEN** the facilitator skips or cannot show the SCC demo
- **THEN** participants still complete both fixes using Gemini 4 and gcloud CLI/MCP

### Requirement: Documented platform commands
The participant and facilitator guides SHALL show equivalent `make`, `task`, and `Setup.ps1` command forms for setup and verification, and SHALL state that all four commands are available to participants.

#### Scenario: Participant uses their own platform
- **WHEN** a participant on macOS, Linux, or Windows follows the setup step using their platform's documented command
- **THEN** the prerequisite checks pass and the participant reaches the same starting state as every other participant

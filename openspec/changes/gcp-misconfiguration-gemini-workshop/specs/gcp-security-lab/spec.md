# Spec Delta

## Purpose

Defines the vulnerability-first lab: participants inherit an insecure Terraform, Go/HTMX, and Cloud Storage stack, use Gemini 4 in the Antigravity CLI to find and fix two issues, and verify with gcloud CLI or MCP.

## ADDED Requirements

### Requirement: Vulnerable-first baseline
The lab SHALL begin from the shipped vulnerable stack; participants SHALL inherit the misconfigurations rather than create them, and the lab SHALL define exactly two remediation exercises.

#### Scenario: Participant opens the lab
- **WHEN** a participant starts the session in the prepared repository
- **THEN** the public bucket, permissive IAM, and vulnerable app are already present and no setup step creates them

### Requirement: Gemini-assisted discovery
The lab SHALL require participants to prompt Gemini 4 in the Antigravity CLI to review the Terraform and Go code and to state the risk and the exact file or resource to change, in plain language.

#### Scenario: Gemini finds the first issue
- **WHEN** a participant asks Gemini 4 to review the starter repository
- **THEN** the response names the public bucket or permissive IAM binding and explains the risk without requiring cloud jargon

### Requirement: Live inspection with gcloud CLI or MCP
The lab SHALL require participants to inspect the live Cloud Storage bucket, IAM policy, and Cloud Run service using gcloud CLI or the configured gcloud MCP servers before applying a fix.

#### Scenario: Participant verifies the live state
- **WHEN** a participant runs a gcloud command or MCP tool against the lab project
- **THEN** the observed bucket visibility, IAM binding, and Cloud Run service match the documented vulnerable baseline

### Requirement: Fix one — storage and IAM exposure
The lab SHALL require participants to remove the `allUsers` binding, enforce public access prevention on the bucket, and reduce the over-permissive service-account role in Terraform, then apply the change.

#### Scenario: Storage exposure is fixed
- **WHEN** the participant applies the edited Terraform configuration
- **THEN** the bucket is no longer publicly readable and the service account no longer holds the over-permissive role

### Requirement: Fix two — application credential and input handling
The lab SHALL require participants to remove the hardcoded service-account key, use Application Default Credentials, add a simple authorization check, and validate the requested object name in the Go app, then redeploy to Cloud Run.

#### Scenario: Application exposure is fixed
- **WHEN** the participant redeploys the edited app to Cloud Run
- **THEN** the app no longer contains a hardcoded key, rejects an unauthenticated or traversal-style request, and still serves the intended file

### Requirement: Verification of both fixes
The lab SHALL require a final verification using gcloud CLI or MCP plus an app smoke test, and SHALL record before-and-after evidence for each fix.

#### Scenario: Fixes are verified
- **WHEN** the participant completes the verification checkpoint
- **THEN** gcloud output and the app response show both vulnerabilities resolved and the evidence is recorded in the guide

### Requirement: SCC excluded from the critical path
The lab SHALL treat Security Command Center as a facilitator-only demonstration and SHALL NOT require any SCC finding, tier, or console step to complete either fix.

#### Scenario: No SCC findings are visible
- **WHEN** the lab project shows no SCC findings or the facilitator omits the demo
- **THEN** participants still complete discovery, both fixes, and verification using Gemini 4 and gcloud CLI/MCP

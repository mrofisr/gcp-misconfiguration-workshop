# Design

## Context

See `proposal.md` for motivation and the specs for the behavior contract. The repository contains only the OpenSpec planning home, so all workshop material is authored here. Binding constraints: 90 minutes, a general audience with no cloud background, no participant GCP setup, an organizer-provisioned environment with a $5 credit, and a vulnerability-first stack fixed with Gemini 4 in the Antigravity CLI plus gcloud CLI/MCP. Cloud Run is included by decision, so cost controls must be explicit.

Verified external facts used in this design (2026-11):

- Gemini 4 (Neon/Carbon/Argon/Hydrogen variants) runs in the Antigravity CLI (`agy`), which supports MCP servers, skills, rules, and headless mode. Source: <https://antigravity.google/docs/overview> and <https://antigravity.google/docs/cli/reference>
- Google Cloud publishes a tutorial for using Gemini Cloud Assist and Application Design Center MCP servers from the Antigravity CLI, with `geminicloudassist.googleapis.com/mcp` and `designcenter.googleapis.com/mcp` using `authProviderType: google_credentials`, plus `gcloud auth application-default login`. Source: <https://docs.cloud.google.com/cloud-assist/design-deploy-antigravity-cli>
- Antigravity MCP config lives in `~/.gemini/config/mcp_config.json` or workspace `.agents/mcp_config.json`, and MCP tools default to Ask mode until allowed. Source: <https://antigravity.google/docs/cli/mcp>
- Security Command Center tiers and detector availability differ (Standard/Standard-legacy/Premium); SCC is therefore kept out of the participant critical path. Source: <https://docs.cloud.google.com/security-command-center/docs/concepts-security-command-center-overview>

## Goals / Non-Goals

**Goals:**

- Deliver a repeatable 90-minute session that an absolute beginner can complete with two guided fixes.
- Make the vulnerable starter stack the single source of truth for the lab.
- Use Gemini 4 in `agy` as the fixing interface and gcloud CLI/MCP as the live-control plane.
- Keep organizer spend under $5 with Cloud Run scale-to-zero and full teardown.

**Non-Goals:**

- Teaching IAM theory, SCC tier internals, organization policy, or compliance frameworks.
- Having participants create projects, billing accounts, APIs, or organization activations.
- Building a production application or a custom AI agent.
- Depending on SCC findings, Premium detectors, or Qwiklabs-style temporary credentials.
- Adding a third vulnerability fix or a red-team exercise.

## Decisions

### 1. Vulnerability-first starter repository as the lab's source of truth

Ship `workshop/starter/` containing Terraform and the Go/HTMX app in their insecure state. Participants inherit it; they never create the vulnerabilities. Gemini 4 reviews this repository and proposes edits to it.

- **Why:** It directly matches "vulnerability first", removes setup time, and gives Gemini a concrete codebase to reason about.
- **Alternatives:** Have participants build the vulnerable stack themselves (rejected: too slow for beginners); use a generic sample app (rejected: less relevant to GCP misconfigurations).

### 2. Cloud Run with strict cost limits

Deploy the Go app to Cloud Run as chosen by the organizer. Configure `--min 0`, `--max 1`, a small memory limit, and no reserved capacity. Teardown deletes the service. The lab never provisions VMs, GKE, SQL, or always-on capacity.

- **Why:** The user chose Cloud Run over local execution; scale-to-zero keeps it inside the $5 credit and the free tier.
- **Alternatives:** Local `go run` (rejected by user); GKE (rejected: cost and complexity); Cloud Run with min instances 1 (rejected: billable idle time).

### 3. Gemini 4 in Antigravity CLI, with MCP for live inspection

Use `agy` with Gemini 4 for plain-language review and code edits. Configure the Gemini Cloud Assist and App Design Center MCP servers for live GCP context, and use gcloud CLI/MCP for bucket, IAM, and Cloud Run verification. Participants get a fixed set of prompts.

- **Why:** This is the requested toolchain, and Google's own tutorial confirms the MCP path works from the CLI with ADC.
- **Alternatives:** Gemini Cloud Assist chat in the console (rejected: less "agentic" and not the requested stack); custom Vertex AI agent (rejected: overkill and extra cost).

### 4. SCC is a facilitator-only demonstration

Show a findings view briefly if available, then explicitly state that the lab does not depend on it. No participant step requires SCC tier, detector, or console navigation.

- **Why:** SCC detector availability varies by tier and activation; making it optional removes a failure mode the audience cannot debug.
- **Alternatives:** SCC as core detection (rejected: 90-minute beginner format and tier variability); drop SCC completely (rejected: retained as a lightweight demo by decision).

### 5. Zero-setup participant contract with a 10-minute CLI setup

The organizer preflight provides projects, credentials, repository checkout, bucket, Cloud Run, and Terraform state. The agenda's first 10 minutes are only for installing/authenticating `agy` and verifying gcloud/ADC; all other setup is done before the session.

- **Why:** The audience has no cloud background and no GCP account; any extra setup would consume the session.
- **Alternatives:** Participant-created projects (rejected by user); full pre-installed environment (rejected by user, who chose 10-min setup in agenda).

### 6. Two-fix scope and repository layout

Cap the lab at two fixes: storage/IAM exposure and app credential/input handling. Author everything under `workshop/`: `README.md`, `slides/`, `facilitator-guide.md`, `participant-lab-guide.md`, `starter/terraform/`, `starter/app/`, and `scripts/` for preflight and teardown.

- **Why:** Two fixes fit the 20+15 minute budget and keep troubleshooting manageable for beginners.
- **Alternatives:** Three or more fixes (rejected: time); single README (rejected: hard to maintain).

### 7. Cross-platform command surfaces

Provide `Makefile` (macOS/Linux), `Taskfile.yaml` (go-task, cross-platform), and `Setup.ps1` (Windows bootstrap plus commands) in `workshop/starter/`. Each exposes `doctor`, `plan`, `apply`, and `destroy` with equivalent behavior, implemented as thin wrappers over a shared script layer so the surfaces cannot drift. All four commands are available to every participant; `doctor` and `plan` are read-only, while `apply` and `destroy` are idempotent and state their effect before running.

- **Why:** The user asked for all three platform entry points with the four commands; a shared layer keeps behavior identical across operating systems.
- **Alternatives:** A single POSIX shell script (rejected: no native Windows path); independent implementations per surface (rejected: drift and confusing documentation).

## Risks / Trade-offs

- **Cloud Run consumes credit despite scale-to-zero** → Mitigation: min 0, max 1, small memory, cost checkpoint, teardown before the session ends.
- **Beginners overwhelmed by jargon** → Mitigation: plain-language glossary, copy-paste steps, exactly two fixes, demonstrator-led pacing.
- **Gemini 4 needs a Google AI subscription not covered by $5** → Mitigation: disclose before session; facilitator can demonstrate if a participant lacks access.
- **MCP/ADC authentication fails** → Mitigation: preflight verifies `gcloud auth application-default login`, MCP config, and `/mcp list`; gcloud CLI works as a fallback.
- **10-minute setup overruns** → Mitigation: preflight checks CLI presence; facilitator provides a pre-authenticated fallback project.
- **Bucket or project name collisions** → Mitigation: unique prefix variable in Terraform and per-participant projects.
- **SCC demo unavailable** → Mitigation: explicitly optional; participant path is Gemini 4 plus gcloud only.
- **Delivery language and participant count unset** → Mitigation: keep guides modular and timing annotations adjustable.
- **Command surface drift across Make, Taskfile, and PowerShell** → Mitigation: thin wrappers over the shared script layer plus a parity check that runs all four commands on each available platform.

## Migration Plan

Greenfield, so no data migration and no rollback of existing behavior. Delivery sequence:

1. Author the curriculum, guides, and slides from the specs.
2. Build the vulnerable Terraform and Go/HTMX starter stack and its Make/Taskfile/PowerShell command surfaces, and verify a clean apply.
3. Run organizer preflight on a provisioned project: Cloud Run service, bucket, IAM, agy, MCP, ADC.
4. Dry-run the full 90 minutes twice; record observed prompts, fixes, and spend.
5. Publish the package; teardown all dry-run resources.

Rollback is to withhold the affected artifact revision; no live resource is a dependency of the published material.

## Open Questions

Deferrable without changing specs, approach, or task breakdown:

- Delivery language for participant materials (Indonesian and/or English).
- Participant count and whether the organizer uses one project per participant or a single shared project.
- Which Gemini 4 variant to standardize on for the session model setting.

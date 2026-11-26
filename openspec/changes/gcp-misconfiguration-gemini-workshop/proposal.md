# Proposal

## Why

GDG Semarang needs a 90-minute, hands-on session for a general audience with no cloud background and no GCP setup of their own. The workshop should be vulnerability-first: participants start from a deliberately insecure Terraform + Go/HTMX + Cloud Storage stack, then fix it with **Gemini 4 through the Antigravity CLI (`agy`)**, using `gcloud` CLI and/or gcloud MCP to inspect and change live resources. The organizer pre-provisions every GCP environment with a $5 credit, so the session must be self-contained and cost-safe. Security Command Center remains a short facilitator demo, not a participant dependency.

## What Changes

- Replace the SCC-console, participant-provisioned plan with a **90-minute beginner curriculum**: 10 min CLI/account setup, 10 min plain-language intro, 15 min find, 20 min fix #1, 15 min fix #2, 10 min verify, 10 min recap and teardown.
- Remove all participant GCP setup requirements (billing, project, APIs, org activation). The organizer pre-provisions ready projects, a vulnerable GCS bucket, a Cloud Run service, Terraform state, and a repository checkout.
- Deliver a **vulnerable-first starter stack**: Terraform that creates a public Cloud Storage bucket, an `allUsers` viewer binding, an over-permissive service account and a service-account key; plus a simple Go + HTMX file-browser app with a hardcoded key, no authorization, and an unsanitized object name.
- Make Gemini 4 in the Antigravity CLI the fixing interface, with gcloud CLI / MCP for live inspection and verification. Document the MCP configuration (`geminicloudassist.googleapis.com/mcp`, `designcenter.googleapis.com/mcp`, ADC via `gcloud auth application-default login`).
- Cap the hands-on scope at **two fixes** so it fits 90 minutes for first-time cloud users: (1) public bucket and IAM exposure, (2) app credential/auth/path-traversal issues.
- Keep Security Command Center as an **optional facilitator demo only**; participant progress must not depend on SCC tier, detector availability, or console navigation.
- Keep the $5 budget contract, adapted to organizer-owned projects: Cloud Run with min instances 0 and max 1, no billable always-on resources, bounded Gemini prompts, a cost checkpoint, and facilitator teardown.
- Disclose that Gemini 4 via Antigravity uses a Google AI subscription and is **not** paid from the $5 GCP credit.
- Provide cross-platform setup tooling in `workshop/`: `Makefile` (macOS/Linux), `Taskfile.yaml` (go-task, cross-platform), and `Setup.ps1` (Windows bootstrap plus commands), each exposing `doctor`, `plan`, `apply`, and `destroy` with equivalent behavior.

Assumptions recorded for planning:
- The organizer provisions one project per participant (or one shared demo project) and provides credentials and a prepared checkout; participants do no billing or project setup.
- The Go + HTMX app is deployed to **Cloud Run** at scale-to-zero, as chosen for this session.
- Participants spend the first 10 minutes installing/authenticating the Antigravity CLI; the organizer preflight removes every other setup step.
- All four commands are available to every participant: `doctor` and `plan` are read-only, while `apply` and `destroy` are idempotent and documented clearly rather than access-restricted.
- Dialogue and materials language can be decided later without changing the lab structure.

## Capabilities

### New Capabilities

- `workshop-curriculum`: The 90-minute teaching contract — beginner language, timed agenda, participant guide, facilitator preflight, and the zero-setup participant promise.
- `gcp-security-lab`: The vulnerable-first lab behavior — inherit an insecure stack, find issues with Gemini 4, fix two of them via Terraform/Go plus gcloud CLI/MCP, and verify.
- `lab-cost-guardrails`: The $5-credit safety contract for organizer-provisioned projects — Cloud Run limits, free-tier service selection, bounded Gemini usage, cost check, and facilitator teardown.
- `vulnerable-starter-stack`: The deliberately insecure Terraform + Go/HTMX + Cloud Storage baseline that participants receive and repair.

### Modified Capabilities

- none — no existing specs in this project.

## Impact

- New content under `openspec/` change artifacts only during planning; implementation adds a `workshop/` package with guides, slides, a vulnerable starter repository, and setup/teardown scripts.
- External dependencies: Terraform, Go, HTMX, Cloud Run, Cloud Storage, IAM, Antigravity CLI with Gemini 4, gcloud CLI, gcloud/Gemini Cloud Assist MCP servers, GNU Make, go-task, PowerShell 7, and (demo only) Security Command Center.
- The $5 credit is on the organizer's billing account; Cloud Run must scale to zero and be deleted at teardown. Gemini 4 requires a separate Google AI subscription, which must be disclosed in participant materials.
- No production resources are created by this change; every lab resource is temporary and removed by the facilitator after the session.

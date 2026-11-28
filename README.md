# GCP Misconfiguration Workshop (Gemini)

A 90-minute, hands-on lab: find and fix common Google Cloud misconfigurations with Gemini 4 in the Antigravity CLI.

A 90-minute, hands-on workshop for people who have never used cloud before. You will start with a small web app and a Google Cloud bucket that are **deliberately insecure**, find the problems with **Gemini 4 in the Antigravity CLI**, fix two of them, and check your work with `gcloud`.

## Participants: start here

1. Open [`participant-lab-guide.md`](participant-lab-guide.md) — the steps you follow in the session. If a word is unfamiliar, check [`glossary.md`](glossary.md).
2. Run the checkup first. It only reads; it changes nothing.
   - macOS/Linux: from the repository root, `make doctor`
   - Windows PowerShell: from the repository root, `.\setup-windows.ps1 -Command doctor`
3. Follow the participant guide together with your facilitator. The timed agenda is the slide outline on the `gh-pages` branch.

## What you need

Nothing from Google Cloud. The organizer gives you a ready **lab project** and a checkout of this repository. Bring a laptop with internet access.

The first 10 minutes are for installing and signing in to the Antigravity CLI. Everything else is already prepared.

## Learning objectives

Each objective is practiced in a specific lab step.

| Objective | Lab step |
|---|---|
| Say what a cloud bucket and an IAM permission are in plain language | Slide outline on the `gh-pages` branch, segment 2; `glossary.md` |
| Run the platform setup check (`doctor`) and read its result | `participant-lab-guide.md`, step 1 |
| Ask Gemini 4 to review code and explain a security problem simply | `participant-lab-guide.md`, step 2 (prompt 1) |
| Inspect a live bucket, IAM policy, and Cloud Run service with `gcloud` | `participant-lab-guide.md`, step 3 |
| Fix a public bucket and an over-permissive permission | `participant-lab-guide.md`, fix 1 |
| Remove a hardcoded credential and an unsafe file lookup from the app | `participant-lab-guide.md`, fix 2 |
| Verify both fixes and remove the lab resources | `participant-lab-guide.md`, step 6 and teardown |

## Cost and access

- The **lab project** and its **$5 credit** belong to the organizer. You do not create a billing account, project, or API.
- The app runs on **Cloud Run with scale-to-zero** (minimum 0 instances, maximum 1). It is deleted at the end.
- **Gemini 4 in Antigravity requires a Google AI subscription.** That is separate from the $5 Google Cloud credit and is not paid from it. If you do not have access, the facilitator will demonstrate the prompts.

## Guides

- [Participant lab guide](participant-lab-guide.md) — the steps you follow in the session.
- [Plain-language glossary](glossary.md) — read this first if a word is unfamiliar.
- Slide outline — the 90-minute agenda, maintained on the `gh-pages` branch.
- The lab code is in `app/` and `terraform/` at the repository root; see "The vulnerable starter" below.

## Commands on every platform

All four commands are available to everyone:

| Command | What it does | Changes Google Cloud? |
|---|---|---|
| `doctor` | Checks tools, sign-in, and prepared resources | No |
| `plan` | Shows what the infrastructure configuration would create | No |
| `apply` | Creates the deliberately vulnerable lab resources | Yes |
| `destroy` | Removes the lab resources | Yes |

There is one way to run each command on your platform, from the repository root:

| Platform | How to run a command |
|---|---|
| macOS / Linux | `make doctor`, `make plan`, `make apply`, `make destroy` |
| Windows PowerShell | `.\setup-windows.ps1 -Command doctor` (and likewise `plan`, `apply`, `destroy`). The first run installs prerequisites. |

`make` and `setup-windows.ps1` both call the same scripts in `scripts/`. There is no separate `task` command.

Facilitators can skip the typing prompt with `make apply ARGS=--yes` (or `.\setup-windows.ps1 -Command apply -Yes`). The lab project check still runs, and a wrong project always stops the command.

## Repository layout

| Path | What it is | Who needs it |
|---|---|---|
| `app/` | The Go + HTMX lab application | Participants |
| `terraform/` | The deliberately vulnerable infrastructure | Participants |
| `scripts/` | The shared implementation of `doctor`, `plan`, `apply`, and `destroy` | Participants |
| `openspec/` | Design history and specs for this repository. Tool convention; do not rename or move it | Maintainers |

The facilitator slide deck and its agenda (`outline.md`) are not part of this source tree. They are maintained on the `gh-pages` branch, which publishes the deck; switch to that branch to present or edit it.

## Heads-up

- **Danger: the lab code is deliberately insecure.** Deploy it only into your **lab project** — the Google Cloud project the organizer gave you. Never deploy it into your own project.
- Any `lab-key*.json` file in this repo is a **fake placeholder**, not a real credential. Do not treat it as a secret or copy it into your own code.
- `doctor` and `plan` only read. `apply` creates resources and `destroy` removes them; both check the lab project and ask you to confirm before changing anything.

## The vulnerable starter

> **Danger: this code is deliberately insecure. Only deploy it into the lab project — never your own project.**

The lab code at the repository root is deliberately insecure. It is the starting point for the workshop. Do not deploy it outside the lab project.

It contains:

- `terraform/` — creates a Cloud Storage bucket, public access, a robot user (service account), a very broad permission, and a downloadable key.
- `app/` — a small Go + HTMX page that lists files in the bucket and opens a file by name.
- `Makefile` (macOS/Linux) and `setup-windows.ps1` (Windows) — the same four commands on every platform: `doctor`, `plan`, `apply`, `destroy`.
- `.agents/` — the Antigravity MCP configuration. Copy `mcp_config.json` to `~/.gemini/config/` during setup; it contains no credentials.

### The vulnerabilities you will find

| # | Where | What is wrong | Minimal fix |
|---|---|---|---|
| 1 | `terraform/main.tf` | `public_access_prevention = "inherited"` means nobody stops a bucket from being made public. | Set it to `"enforced"`. |
| 2 | `terraform/main.tf` | `allUsers` has `roles/storage.objectViewer`, so anyone can read files. | Delete that resource block. |
| 3 | `terraform/main.tf` | The service account is given `roles/owner` on the whole project. | Change the role to `roles/storage.objectViewer` on the bucket. |
| 4 | `terraform/main.tf` and `app/keys/lab-key.json` | A long-lived service-account key is created and baked into the image. | Delete the key resource, the placeholder key file, and the `COPY` line in the Dockerfile. |
| 5 | `app/main.go` | `hardcodedKeyPath` points at a key file in the source. | Use Application Default Credentials only: `storage.NewClient(ctx)`. |
| 6 | `app/main.go` | `/file` has no authorization check. | Add a simple check before reading the object. |
| 7 | `app/main.go` | `name` from the URL is passed straight to `Object(name)`. | Reject names that contain `..`, start with `/`, or contain a backslash. |

The workshop fixes **#1–#4 as fix one** and **#5–#7 as fix two**. Each fix changes only Terraform or Go source and adds no new billable resource.

### Local checks (no Google Cloud account needed)

```sh
terraform -chdir=terraform fmt -check
terraform -chdir=terraform init -backend=false
terraform -chdir=terraform validate
cd app && gofmt -l . && go build ./...
```

### Configuration

Copy `.env.example` to `.env` and fill in the lab project ID provided by the organizer. The command layer reads that file and passes values to Terraform and Cloud Run. No credential is stored in `.env`.

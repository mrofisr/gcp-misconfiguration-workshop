# Fixing Google Cloud Misconfigurations with Gemini

A 90-minute, hands-on workshop for people who have never used cloud before. You will start with a small web app and a Google Cloud bucket that are **deliberately insecure**, find the problems with **Gemini 4 in the Antigravity CLI**, fix two of them, and check your work with `gcloud`.

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
- [Facilitator guide](facilitator-guide.md) — setup, preflight, troubleshooting, and the optional Security Command Center demo.
- [Plain-language glossary](glossary.md) — read this first if a word is unfamiliar.
- Slide outline — the 90-minute agenda, maintained on the `gh-pages` branch.
- [Vulnerable starter repository](vulnerable-starter/README.md) — the code you will inherit and repair.

## Commands on every platform

All four commands are available to everyone:

| Command | What it does | Changes Google Cloud? |
|---|---|---|
| `doctor` | Checks tools, sign-in, and prepared resources | No |
| `plan` | Shows what the infrastructure configuration would create | No |
| `apply` | Creates the deliberately vulnerable lab resources | Yes |
| `destroy` | Removes the lab resources | Yes |

There is one way to run each command on your platform:

| Platform | How to run a command |
| --- | --- |
| macOS / Linux | From `workshop/vulnerable-starter`: `make doctor`, `make plan`, `make apply`, `make destroy` |
| Windows PowerShell | From `workshop/vulnerable-starter`: `.\setup-windows.ps1 -Command doctor` (and likewise `plan`, `apply`, `destroy`). The first run installs prerequisites. |

`make` and `setup-windows.ps1` both call the same scripts in `workshop/scripts/`. There is no separate `task` command.

Facilitators can skip the typing prompt with `make apply ARGS=--yes` (or `.\setup-windows.ps1 -Command apply -Yes`). The lab project check still runs, and a wrong project always stops the command.

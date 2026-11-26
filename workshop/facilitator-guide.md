# Facilitator guide — 90 minutes

Run the [slide outline](slides/outline.md) and let participants use the [participant guide](participant-lab-guide.md). This guide covers what you do before, during, and after.

## Before the session — preflight

Run `doctor` on each prepared environment from `workshop/starter`:

| Platform | Command |
|---|---|
| macOS / Linux | `make doctor` |
| Any platform with go-task | `task doctor` |
| Windows PowerShell | `.\Setup.ps1 -Command doctor` |

Checklist (each item must pass or have a documented workaround):

- [ ] `PROJECT_ID` is set in `starter/.env` and belongs to the organizer.
- [ ] Billing is enabled on the project and the $5 credit is present.
- [ ] `gcloud`, `terraform`, `go`, `make` are installed; `agy` is available for the 10-minute setup step.
- [ ] `gcloud auth application-default login` has been done.
- [ ] The bucket and Cloud Run service exist (run `apply` beforehand if not).
- [ ] `~/.gemini/config/mcp_config.json` contains both MCP servers; `/mcp list` shows them in `agy`.
- [ ] The vulnerable baseline was applied and recorded in the evidence sheet.

`doctor` only reads state. It creates and changes nothing.

## Talking points for beginners

- "Cloud is someone else's computer. A bucket is a folder there. IAM is the guest list."
- "We are not learning to build this. We are learning to spot what is wrong and ask an assistant to help fix it."
- "You have three prompts. Use them carefully; a good question is the skill."
- "Nothing you do today spends your own money. The project and its $5 credit belong to the organizer."
- "Gemini 4 needs a Google AI subscription, which is separate from the $5 credit."

## Troubleshooting

| Symptom | Remediation |
|---|---|
| `doctor` says PROJECT_ID is empty | Copy `starter/.env.example` to `starter/.env` and set the organizer's project ID. |
| `doctor` says gcloud has no active account | Run `gcloud auth login`, or use the organizer's prepared credentials. |
| `doctor` says ADC is missing | Run `gcloud auth application-default login` and re-run `doctor`. |
| `/mcp list` shows no servers | Copy `starter/.agents/mcp_config.json` to `~/.gemini/config/mcp_config.json`, restart `agy`, then re-check. |
| `plan` fails with a permissions error | Confirm the account has `roles/editor` or equivalent on the lab project. |
| `apply` fails on Cloud Build | Check billing is enabled and the Cloud Build API is available in the project. |
| App returns 404 for a file | The app falls back to ADC; confirm the service account can read the bucket and the object exists. |
| Participant has no Gemini 4 access | Let them follow on screen; the facilitator runs the three prompts and shows the edits. |
| `destroy` leaves a resource | Re-run `destroy` (it is idempotent), then check Terraform state and the Cloud Run service list. |

## Optional Security Command Center demo (60 seconds, not required)

Show a findings view if the project has one, then say explicitly: "We are not using this today; everything we do works without it."

Console path: **Security → Security Command Center → Findings**. If no findings or no access, skip it. Participant progress never depends on SCC tier, detector availability, or console navigation.

## Cost table

| Service | Used for | Cost classification |
|---|---|---|
| Cloud Storage | Lab bucket with one small text file | Free tier covers far more than this lab; well under $5 |
| IAM | Bindings and service account | No charge |
| Terraform | Local planning and apply | Free, open source |
| Cloud Run | Go + HTMX app | Scale-to-zero: min 0, max 1, 256 Mi memory. Requests are the only possible charge |
| gcloud CLI / MCP servers | Inspection and deployment | No charge |
| GNU Make / go-task / PowerShell | Command surfaces | Free, local tools |
| Gemini 4 via Antigravity CLI | Three review/fix prompts | **Google AI subscription — separate from the $5 GCP credit** |
| Security Command Center | Optional demo only | Standard tier has a free option; not on the participant path |

## Cost checkpoint and teardown

1. Before teardown, record observed spend in Cloud Billing for the lab project.
2. Compare against the **$5 ceiling**. If over, record the amount and escalate to the organizer.
3. Run the platform's `destroy` command. All four commands are available to everyone.
4. Re-run `doctor` and confirm no bucket or Cloud Run service remains.
5. Record the final state in the evidence sheet.

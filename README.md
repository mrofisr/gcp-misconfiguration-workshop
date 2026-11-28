# GCP Misconfiguration Workshop (Gemini)

A 90-minute, hands-on lab: find and fix common Google Cloud misconfigurations with Gemini 4 in the Antigravity CLI.

## Participants: start here

1. Open [`workshop/README.md`](workshop/README.md) — the lab front page and the list of commands.
2. Run the checkup first. It only reads; it changes nothing.
   - macOS/Linux: `cd workshop/vulnerable-starter && make doctor`
   - Windows PowerShell: `cd workshop/vulnerable-starter; .\setup-windows.ps1 -Command doctor`
3. Follow [`workshop/participant-lab-guide.md`](workshop/participant-lab-guide.md) together with your facilitator. If a word is unfamiliar, check [`workshop/glossary.md`](workshop/glossary.md).

## Everything else (you can ignore it)

| Folder | What it is | Who needs it |
| --- | --- | --- |
| `workshop/` | The lab: guides, glossary, scripts, and the vulnerable starter | Participants |
| `openspec/` | Design history and specs for this repository. Tool convention; do not rename or move it | Maintainers |

The facilitator slide deck and its agenda (`outline.md`) are not part of this source tree. They are maintained on the `gh-pages` branch, which publishes the deck; switch to that branch to present or edit it.

## Heads-up

- `workshop/vulnerable-starter/` is **deliberately insecure**. Deploy it only into your **lab project** — the Google Cloud project the organizer gave you. Never use your own project.
- Any `lab-key*.json` file in this repo is a **fake placeholder**, not a real credential. Do not treat it as a secret or copy it into your own code.
- `doctor` and `plan` only read. `apply` creates resources and `destroy` removes them; both check the lab project and ask you to confirm before changing anything.

# Tasks

## 1. Curriculum and session materials

- [x] 1.1 Create `workshop/README.md` with plain-language objectives, the zero-setup promise, the $5/Gemini-subscription disclosure, and links to all guides; verify every objective maps to a lab step in `workshop-curriculum`.
- [x] 1.2 Create `workshop/slides/` outline with the exact 90-minute segments (10 setup, 10 intro, 15 find, 20 fix one, 15 fix two, 10 verify, 10 recap); verify durations sum to 90.
- [x] 1.3 Add a plain-language glossary for cloud, GCP, bucket, IAM, Cloud Run, and Terraform; verify no term is used in a lab step before it is defined.

## 2. Vulnerable starter stack

- [x] 2.1 Implement `workshop/starter/terraform/` with variables for project and unique prefix, a public Cloud Storage bucket, an `allUsers` viewer binding, an over-permissive service account and key; verify `terraform plan` on a clean project shows all four vulnerable resources.
- [x] 2.2 Implement the Go + HTMX file browser in `workshop/starter/app/` with hardcoded key path, no authorization, and unsanitized object name; verify the app lists bucket objects and serves a requested object in the vulnerable state.
- [x] 2.3 Add `workshop/starter/README.md` documenting each vulnerability and its minimal fix; verify each fix changes only Terraform or Go source and adds no billable resource.
- [ ] 2.4 Apply the vulnerable baseline in a clean lab project and record the observed state; verify two facilitators get identical vulnerability classes per `vulnerable-starter-stack`.

## 3. Cross-platform setup tooling

- [x] 3.1 Implement the shared command layer in `workshop/scripts/` for `doctor`, `plan`, `apply`, and `destroy`; verify each command produces the documented checks or changes on a clean project.
- [x] 3.2 Create `workshop/starter/Makefile` exposing `doctor`, `plan`, `apply`, and `destroy` for macOS/Linux; verify each target invokes the shared layer and a second `apply` is idempotent.
- [x] 3.3 Create `workshop/starter/Taskfile.yaml` with the four tasks for go-task on any platform; verify `task --list` shows `doctor`, `plan`, `apply`, and `destroy` with the same behavior as Make.
- [x] 3.4 Create `workshop/starter/Setup.ps1` that bootstraps gcloud, Terraform, Go, go-task, and the Antigravity CLI on Windows and exposes the four commands; verify a Windows run installs or verifies each prerequisite and then executes `doctor`.
- [ ] 3.5 Run a parity check across every available platform surface; verify identical outcomes for all four commands per `vulnerable-starter-stack` and that `doctor`/`plan` change no GCP resource.

## 4. Organizer environment and preflight

- [ ] 4.1 Provision the organizer project with $5 credit, APIs, and credentials; verify `doctor` reports pass for every prerequisite from a fresh checkout.
- [ ] 4.2 Provision the Cloud Run service with min 0, max 1, and a documented memory limit; verify the deployed service serves the app and has no reserved capacity.
- [x] 4.3 Document the Antigravity CLI MCP configuration for `geminicloudassist.googleapis.com/mcp` and `designcenter.googleapis.com/mcp` with `google_credentials` auth, plus the gcloud CLI fallback; verify `/mcp list` shows both servers connected in `agy`.
- [ ] 4.4 Verify `destroy` removes the Cloud Run service, bucket, IAM bindings, service account, and Terraform-managed resources; verify a second run is a no-op and no lab resource remains.

## 5. Participant lab guide

- [x] 5.1 Write `workshop/participant-lab-guide.md` with copy-paste commands and expected results for the 10-minute CLI setup and both fixes, showing the `make`, `task`, and `Setup.ps1` forms; verify every step matches an action in the starter repo, command layer, or gcloud CLI/MCP.
- [x] 5.2 Add the bounded Gemini 4 prompt set (plain-language review, fix one, fix two) with the subscription disclosure before the first prompt; verify prompt count matches the published limit in `lab-cost-guardrails`.
- [x] 5.3 Add before/after evidence tables and a final verification step using gcloud CLI/MCP plus an app smoke test; verify both fixes can be confirmed from recorded evidence.

## 6. Facilitator guide and cost guardrails

- [x] 6.1 Create `workshop/facilitator-guide.md` with the `doctor`-based preflight checklist, platform command forms, talking points for beginners, troubleshooting for CLI/MCP/ADC failures, and the optional SCC demo script; verify each failure has a remediation and the SCC demo is marked optional.
- [x] 6.2 Add the cost table listing every service with its classification, the $5 ceiling, the Gemini subscription disclosure, and the Cloud Run limits; verify every service used by the lab appears in the table.
- [x] 6.3 Add the end-of-session cost checkpoint and teardown steps via `destroy`, documented as available to all participants; verify spend is recordable against $5 and teardown is verifiable.

## 7. Integration dry run and validation

- [ ] 7.1 Run the full 90-minute lab in a provisioned project using at least two platform surfaces; verify both fixes complete, all four commands behave equivalently, spend stays under $5, and teardown removes all resources.
- [x] 7.2 Run `openspec validate "gcp-misconfiguration-gemini-workshop" --strict` and verify no errors or warnings remain.

## Workflow follow-up

- Archive the change after the project's review requirements are satisfied.
- Verify the archived result and that the workshop package is publishable.

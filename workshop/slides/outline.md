# Slide outline — 90 minutes

Total: **90 minutes**. Seven segments. No cloud knowledge assumed.

| # | Time | Segment | Key message |
|---|---|---|---|
| 1 | 00:00–00:10 (10 min) | Setup | Install and sign in to Antigravity CLI; run `doctor` |
| 2 | 00:10–00:20 (10 min) | Plain-language intro | A bucket is a folder in the cloud; IAM is who may open it |
| 3 | 00:20–00:35 (15 min) | Find the problems | Ask Gemini 4 to review the starter repo in plain language |
| 4 | 00:35–00:55 (20 min) | Fix 1 — bucket and permissions | Make the bucket private and reduce the permission |
| 5 | 00:55–01:10 (15 min) | Fix 2 — app credential and input | Remove the hardcoded key and validate the file name |
| 6 | 01:10–01:20 (10 min) | Verify | Use `gcloud` and the app to prove both fixes worked |
| 7 | 01:20–01:30 (10 min) | Recap and teardown | What changed, why, and run `destroy` |

## Segment notes

### 1. Setup (10 min)
- Show the three platform command forms: `make`, `task`, `.\Setup.ps1`.
- Participants run `doctor`. Expected: tool checks pass; cloud checks pass in the prepared project.
- If a check fails, use the facilitator guide troubleshooting table.

### 2. Plain-language intro (10 min)
- Use the words from `glossary.md` only after defining them.
- Three sentences only: cloud = someone else's computer; bucket = a folder there; IAM = the guest list.
- Say explicitly: "You do not need to know how to set any of this up."

### 3. Find the problems (15 min)
- Open `starter/` in Antigravity CLI.
- Prompt 1 (from the participant guide): ask Gemini 4 to review Terraform and Go code and explain risks simply.
- Optional 60-second Security Command Center screenshot — state that the lab does not depend on it.

### 4. Fix 1 — bucket and permissions (20 min)
- Prompt 2: ask Gemini 4 for the smallest Terraform edit.
- Edit `terraform/main.tf`, run `plan`, then `apply`.
- Checkpoint: bucket is no longer public.

### 5. Fix 2 — app credential and input (15 min)
- Prompt 3: ask Gemini 4 about the hardcoded key and unsanitized file name.
- Edit `app/main.go`, redeploy, smoke test.
- Checkpoint: no hardcoded key; unsafe name rejected.

### 6. Verify (10 min)
- Run the gcloud verification commands from the participant guide.
- Record before/after evidence in the tables.

### 7. Recap and teardown (10 min)
- Recap: two fixes, one idea — least access and no secrets in code.
- Run `destroy`. Confirm with `doctor` that nothing remains.

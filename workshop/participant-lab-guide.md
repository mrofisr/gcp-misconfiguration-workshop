# Participant lab guide — 90 minutes

You do **not** need a Google Cloud account, billing, or any setup done by you. The organizer gives you a ready **lab project** and this repository. If a word is new, check the [glossary](glossary.md).

> **Cost note:** The $5 Google Cloud credit belongs to the organizer. **Gemini 4 in Antigravity needs a Google AI subscription** — it is not paid from that credit. If you do not have it, watch the facilitator's prompts.

## Before you start

Copy the configuration and fill in your **lab project** ID — the one the facilitator gives you:

```sh
cd workshop/vulnerable-starter
cp .env.example .env
# edit .env: set PROJECT_ID=the-project-id-you-were-given
set -a; . ./.env; set +a
```

Do not put any password or key in `.env`. Re-run the `set -a` line in any new terminal window so the variables below are available.

## Step 1 — Setup (10 minutes)

Install the Antigravity CLI and sign in:

```sh
curl -fsSL https://antigravity.google/cli/install.sh | bash
~/.local/bin/agy --version
gcloud auth application-default login
```

On Windows PowerShell, run `.\setup-windows.ps1` — it installs the tools and then runs `doctor`.

Connect the AI assistant to Google Cloud tools. Copy `vulnerable-starter/.agents/mcp_config.json` to `~/.gemini/config/mcp_config.json`, then start `agy` and type `/mcp list`. You should see `gemini-cloud-assist` and `application-design-center`.

Run the check for your platform:

| Platform | Command |
|---|---|
| macOS / Linux | `cd workshop/vulnerable-starter && make doctor` |
| Windows PowerShell | `.\setup-windows.ps1 -Command doctor` |

**Expected:** every `PASS` line; warnings about `agy` only if you skipped install. If a `FAIL` line appears, use the [facilitator guide](facilitator-guide.md#troubleshooting) or raise your hand.

**Checkpoint 1:** `doctor` reports no failures.

## Step 2 — Find the problems with Gemini 4 (15 minutes)

Start the assistant from the vulnerable-starter folder:

```sh
cd workshop/vulnerable-starter
agy
```

You have **three prompts** in this lab. Use them one at a time.

**Prompt 1 — plain-language review**

> Look at terraform/main.tf and app/main.go. Explain in simple language, without cloud jargon, what a complete beginner should worry about. For each issue tell me the file, the line, and why it matters. Do not change any files yet.

Write the assistant's answers in the "Found" column of the evidence table below.

**Checkpoint 2:** you can name the public bucket, the broad permission, the hardcoded key, and the unsafe file lookup.

## Step 3 — Look at the live resources (part of fix 1)

Use `gcloud` (or ask the assistant through MCP) to see the real state:

```sh
gcloud storage buckets describe gs://$BUCKET_NAME --project=$PROJECT_ID
gcloud projects get-iam-policy $PROJECT_ID --flatten=bindings[].members --filter='bindings.members:allUsers' --format='table(bindings.role)'
APP_URL="$(gcloud run services describe $SERVICE_NAME --region=$REGION --project=$PROJECT_ID --format='value(status.url)')"
echo "App URL: $APP_URL"
```

**Expected:** the bucket exists, `allUsers` has a viewer role, and the app has a URL.

## Fix 1 — Bucket and permissions (20 minutes)

**Prompt 2 — smallest safe Terraform edit**

> Make the smallest possible edit to terraform/main.tf so the bucket cannot be public, nobody outside the lab project can read it, and the app's service account only gets the access it needs. Explain each change in one sentence. Do not run apply.

Review the diff (`/diff` in `agy`). Then apply:

| Platform | Command |
|---|---|
| macOS / Linux | `make plan` then `make apply` |
| Windows PowerShell | `.\setup-windows.ps1 -Command plan` then `-Command apply` |

**Expected:** `plan` shows changes; `apply` finishes without errors.

**Checkpoint 3:** the `allUsers` line is gone from the IAM policy and public access prevention is enforced.

## Fix 2 — App credential and input handling (15 minutes)

**Prompt 3 — fix the app**

> In app/main.go, remove the hardcoded key file so the app uses Application Default Credentials, add a simple check so only a request with header X-Lab-User: allowed can open a file, and reject a file name that contains "..", starts with "/", or contains "\". Keep the page working. Show me the diff before applying.

Review the diff. Also remove the key resource from Terraform and the key file from the Dockerfile, then apply again and redeploy the app. If you need a command to redeploy, ask the facilitator.

**Checkpoint 4:** no hardcoded key path remains; a request with `..` in `name` is rejected; a normal request still returns the file.

## Step 6 — Verify (10 minutes)

```sh
gcloud storage buckets describe gs://$BUCKET_NAME --format='value(publicAccessPrevention)'
gcloud projects get-iam-policy $PROJECT_ID --flatten=bindings[].members --filter='bindings.members:allUsers' --format='value(bindings.role)'
curl -s -o /dev/null -w '%{http_code}\n' -H 'X-Lab-User: allowed' "$APP_URL/file?name=welcome.txt"
curl -s -o /dev/null -w '%{http_code}\n' -H 'X-Lab-User: allowed' "$APP_URL/file?name=../secret.txt"
```

**Expected:** `enforced`, no `allUsers` role, `200` for the normal file, and `400`/`403` for the traversal attempt.

## Recap and teardown (10 minutes)

Run the command for your platform:

| Platform | Command |
|---|---|
| macOS / Linux | `make destroy` |
| Windows PowerShell | `.\setup-windows.ps1 -Command destroy` |

**Checkpoint 5:** `doctor` shows no bucket or service, and the facilitator records spend against the $5 ceiling.

## Evidence table — fill this in

| Item | Before (found) | After (verified) |
|---|---|---|
| Bucket public access | | |
| `allUsers` IAM role | | |
| Hardcoded key path in `app/main.go` | | |
| Unsafe file name in `/file` | | |
| Cloud Run service exists | | (removed) |
| Observed spend vs $5 | — | |

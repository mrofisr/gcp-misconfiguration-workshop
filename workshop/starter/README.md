# Vulnerable starter repository

This repository is **deliberately insecure**. It is the starting point for the workshop. Do not deploy it outside the lab project.

It contains:

- `terraform/` — creates a Cloud Storage bucket, public access, a robot user (service account), a very broad permission, and a downloadable key.
- `app/` — a small Go + HTMX page that lists files in the bucket and opens a file by name.
- `Makefile`, `Taskfile.yaml`, `Setup.ps1` — the same four commands on every platform: `doctor`, `plan`, `apply`, `destroy`.

## The vulnerabilities you will find

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

## Local checks (no Google Cloud account needed)

```sh
terraform -chdir=terraform fmt -check
terraform -chdir=terraform init -backend=false
terraform -chdir=terraform validate
cd app && gofmt -l . && go build ./...
```

## Configuration

Copy `.env.example` to `.env` and fill in the project ID provided by the organizer. The command layer reads that file and passes values to Terraform and Cloud Run. No credential is stored in `.env`.

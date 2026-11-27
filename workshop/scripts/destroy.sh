#!/usr/bin/env bash
# Removes every resource created by 'apply'. Safe to run twice.
set -euo pipefail
source "$(dirname "${BASH_SOURCE[0]}")/common.sh"

require_lab_project
confirm_project "delete" "deletes the Cloud Run service and all Terraform-managed lab resources in the lab project"

if gcloud run services describe "$SERVICE_NAME" --region="$REGION" --project="$PROJECT_ID" >/dev/null 2>&1; then
  log_info "destroy: deleting Cloud Run service $SERVICE_NAME"
  gcloud run services delete "$SERVICE_NAME" --region="$REGION" --project="$PROJECT_ID" --quiet
else
  log_info "destroy: Cloud Run service already absent"
fi

terraform -chdir="$TERRAFORM_DIR" init -input=false
terraform -chdir="$TERRAFORM_DIR" destroy -auto-approve -input=false

if gcloud storage buckets describe "gs://$BUCKET_NAME" --project="$PROJECT_ID" >/dev/null 2>&1; then
  log_warn "bucket gs://$BUCKET_NAME still exists; check Terraform state and re-run destroy"
else
  log_ok "destroy complete: no lab resources remain"
fi

#!/usr/bin/env bash
# Removes every resource created by 'apply'. Safe to run twice.
set -euo pipefail
source "$(dirname "${BASH_SOURCE[0]}")/common.sh"

require_project
log_info "destroy: this DELETES the Cloud Run service $SERVICE_NAME and all Terraform-managed lab resources in $PROJECT_ID"

if gcloud run services describe "$SERVICE_NAME" --region="$REGION" --project="$PROJECT_ID" >/dev/null 2>&1; then
  gcloud run services delete "$SERVICE_NAME" --region="$REGION" --project="$PROJECT_ID" --quiet
else
  log_info "destroy: Cloud Run service already absent"
fi

terraform -chdir="$TERRAFORM_DIR" init -input=false
terraform -chdir="$TERRAFORM_DIR" destroy -auto-approve -input=false

if gcloud storage buckets describe "gs://$BUCKET_NAME" --project="$PROJECT_ID" >/dev/null 2>&1; then
  log_warn "bucket gs://$BUCKET_NAME still exists; check Terraform state"
else
  log_ok "destroy complete: no lab resources remain"
fi

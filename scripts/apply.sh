#!/usr/bin/env bash
# Creates the deliberately vulnerable lab resources and deploys the app.
set -euo pipefail
source "$(dirname "${BASH_SOURCE[0]}")/common.sh"

require_lab_project
confirm_project "create" "creates a public bucket, a broad permission, a key, and a Cloud Run service in the lab project"

log_info "apply: project=$PROJECT_ID region=$REGION prefix=$PREFIX memory=$MEMORY"

terraform -chdir="$TERRAFORM_DIR" init -input=false
terraform -chdir="$TERRAFORM_DIR" apply -auto-approve -input=false

SERVICE_ACCOUNT_EMAIL="$(terraform -chdir="$TERRAFORM_DIR" output -raw service_account_email)"

gcloud run deploy "$SERVICE_NAME" \
  --source="$APP_DIR" \
  --project="$PROJECT_ID" \
  --region="$REGION" \
  --service-account="$SERVICE_ACCOUNT_EMAIL" \
  --min=0 \
  --max=1 \
  --memory="$MEMORY" \
  --set-env-vars="BUCKET_NAME=$BUCKET_NAME" \
  --allow-unauthenticated \
  --quiet

log_ok "apply complete: bucket gs://$BUCKET_NAME and service $SERVICE_NAME"

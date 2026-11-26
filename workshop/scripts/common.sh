#!/usr/bin/env bash
# Shared helpers for the four lab commands. Sourced by doctor/plan/apply/destroy.

SCRIPTS_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
WORKSHOP_DIR="$(cd "$SCRIPTS_DIR/.." && pwd)"
STARTER_DIR="$WORKSHOP_DIR/starter"
TERRAFORM_DIR="$STARTER_DIR/terraform"
APP_DIR="$STARTER_DIR/app"

if [ -f "$STARTER_DIR/.env" ]; then
  set -a
  # shellcheck disable=SC1091
  . "$STARTER_DIR/.env"
  set +a
fi

PROJECT_ID="${PROJECT_ID:-}"
PREFIX="${PREFIX:-gdg-semarang-lab}"
REGION="${REGION:-us-central1}"
MEMORY="${MEMORY:-256Mi}"
BUCKET_NAME="${BUCKET_NAME:-${PREFIX}-files}"
SERVICE_NAME="${SERVICE_NAME:-${PREFIX}-files}"

export TF_VAR_project_id="$PROJECT_ID"
export TF_VAR_prefix="$PREFIX"
export TF_VAR_region="$REGION"

FAILURES=0

log_info() { printf 'INFO  %s\n' "$*"; }
log_ok() { printf 'PASS  %s\n' "$*"; }
log_warn() { printf 'WARN  %s\n' "$*"; }
log_fail() { printf 'FAIL  %s\n' "$*"; FAILURES=$((FAILURES + 1)); }

have_cmd() { command -v "$1" >/dev/null 2>&1; }

check_cmd() {
  if have_cmd "$1"; then
    log_ok "$1 is installed"
  else
    log_fail "$1 is missing"
  fi
}

check_project() {
  if [ -n "$PROJECT_ID" ]; then
    log_ok "PROJECT_ID is set to $PROJECT_ID"
  else
    log_fail "PROJECT_ID is empty; copy starter/.env.example to starter/.env and fill it in"
  fi
}

check_auth() {
  local account
  account="$(gcloud auth list --filter=disabled:false --format='value(account)' 2>/dev/null | head -n1)"
  if [ -n "$account" ]; then
    log_ok "gcloud is signed in as $account"
  else
    log_fail "gcloud has no active account; run: gcloud auth login"
  fi
}

check_adc() {
  if gcloud auth application-default print-access-token >/dev/null 2>&1; then
    log_ok "Application Default Credentials are available"
  else
    log_fail "ADC is missing; run: gcloud auth application-default login"
  fi
}

check_billing() {
  local enabled
  enabled="$(gcloud beta billing projects describe "$PROJECT_ID" --format='value(billingEnabled)' 2>/dev/null || true)"
  if [ "$enabled" = "True" ]; then
    log_ok "project $PROJECT_ID has billing enabled"
  else
    log_fail "project $PROJECT_ID has no billing enabled (or billing info is unavailable)"
  fi
}

check_bucket() {
  if gcloud storage buckets describe "gs://$BUCKET_NAME" --project="$PROJECT_ID" >/dev/null 2>&1; then
    log_ok "bucket gs://$BUCKET_NAME exists"
  else
    log_warn "bucket gs://$BUCKET_NAME not found yet (run 'apply' to create it)"
  fi
}

check_service() {
  if gcloud run services describe "$SERVICE_NAME" --region="$REGION" --project="$PROJECT_ID" >/dev/null 2>&1; then
    log_ok "Cloud Run service $SERVICE_NAME exists"
  else
    log_warn "Cloud Run service $SERVICE_NAME not found yet (run 'apply' to create it)"
  fi
}

check_mcp_config() {
  local config="$HOME/.gemini/config/mcp_config.json"
  if [ -f "$config" ] && grep -q 'geminicloudassist.googleapis.com/mcp' "$config"; then
    log_ok "Antigravity MCP config contains the Gemini Cloud Assist server"
  else
    log_warn "Antigravity MCP config not found; see participant-lab-guide.md step 1"
  fi
}

require_project() {
  if [ -z "$PROJECT_ID" ]; then
    log_fail "PROJECT_ID is empty; copy starter/.env.example to starter/.env first"
    exit 1
  fi
}

summary() {
  if [ "$FAILURES" -eq 0 ]; then
    log_ok "all checks passed"
    return 0
  fi
  log_fail "$FAILURES check(s) failed"
  return 1
}

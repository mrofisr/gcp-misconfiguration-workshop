#!/usr/bin/env bash
# Shared helpers for the four lab commands. Sourced by doctor/plan/apply/destroy.

SCRIPTS_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPTS_DIR/.." && pwd)"
TERRAFORM_DIR="$PROJECT_ROOT/terraform"
APP_DIR="$PROJECT_ROOT/app"

if [ -f "$PROJECT_ROOT/.env" ]; then
  set -a
  # shellcheck disable=SC1091
  . "$PROJECT_ROOT/.env"
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
ASSUME_YES=0
for arg in "$@"; do
  case "$arg" in
    --yes) ASSUME_YES=1 ;;
    *) printf 'FAIL  Unknown option: %s. Supported option: --yes\n' "$arg" >&2; exit 1 ;;
  esac
done

log_info() { printf 'INFO  %s\n' "$*"; }
log_ok() { printf 'PASS  %s\n' "$*"; }
log_warn() { printf 'WARN  %s\n' "$*"; }
log_fail() { printf 'FAIL  %s\n' "$*"; FAILURES=$((FAILURES + 1)); }

have_cmd() { command -v "$1" >/dev/null 2>&1; }

check_cmd() {
  if have_cmd "$1"; then
    log_ok "$1 is installed"
  else
    log_fail "$1 is missing; install it and re-run doctor"
  fi
}

check_project() {
  if [ -n "$PROJECT_ID" ]; then
    log_ok "Lab project is set to $PROJECT_ID"
  else
    log_fail "Lab project is empty; copy .env.example to .env and set PROJECT_ID"
  fi
}

check_auth() {
  local account
  account="$(gcloud auth list --filter=disabled:false --format='value(account)' 2>/dev/null | head -n1 || true)"
  if [ -n "$account" ]; then
    log_ok "gcloud is signed in as $account"
  else
    log_fail "Not logged in. Run: gcloud auth login"
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
    log_ok "lab project $PROJECT_ID has billing enabled"
  else
    log_fail "lab project $PROJECT_ID has no billing enabled (or billing info is unavailable); check the lab project in the organizer's sheet"
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

require_configured_project() {
  if [ -z "$PROJECT_ID" ]; then
    log_fail "Lab project is not configured. Copy .env.example to .env and set PROJECT_ID to your lab project, then re-run."
    exit 1
  fi
}

require_lab_project() {
  require_configured_project
  if ! have_cmd gcloud; then
    log_fail "gcloud is not installed. Install the Google Cloud CLI: https://cloud.google.com/sdk/docs/install"
    exit 1
  fi
  local account active
  account="$(gcloud auth list --filter=disabled:false --format='value(account)' 2>/dev/null | head -n1 || true)"
  if [ -z "$account" ]; then
    log_fail "Not logged in. Run: gcloud auth login"
    exit 1
  fi
  active="$(gcloud config get-value project 2>/dev/null || true)"
  if [ "$active" != "$PROJECT_ID" ]; then
    log_fail "gcloud is using '$active' but the lab project is '$PROJECT_ID'. Run: gcloud config set project $PROJECT_ID"
    exit 1
  fi
  log_ok "Lab project confirmed: $PROJECT_ID"
}

confirm_project() {
  local action="$1" effect="$2" answer=""
  printf 'About to %s in lab project %s (region %s, prefix %s).\n' "$action" "$PROJECT_ID" "$REGION" "$PREFIX"
  printf 'Effect: %s\n' "$effect"
  printf 'Cost note: uses the organizer-provided lab project; Cloud Run scales to zero and is removed at teardown.\n'
  if [ "$ASSUME_YES" -eq 1 ]; then
    log_warn "--yes: typing prompt skipped; the lab project check still applied"
    return 0
  fi
  printf 'Type the lab project ID to continue: '
  if ! read -r answer; then
    answer=""
  fi
  if [ "$answer" != "$PROJECT_ID" ]; then
    log_info "Cancelled. Nothing was changed."
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

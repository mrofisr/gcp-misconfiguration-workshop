#!/usr/bin/env bash
# Read-only prerequisite check. Creates or changes no Google Cloud resource.
set -u
source "$(dirname "${BASH_SOURCE[0]}")/common.sh"

log_info "doctor: checking local tools"
check_cmd gcloud
check_cmd terraform
check_cmd go
check_cmd make
if have_cmd agy; then log_ok "Antigravity CLI is installed"; else log_warn "agy is missing; install it in the first 10 minutes"; fi

log_info "doctor: checking Google Cloud access"
check_project
if have_cmd gcloud; then
  check_auth
  check_adc
  if [ -n "$PROJECT_ID" ]; then
    check_billing
    check_bucket
    check_service
  fi
fi

log_info "doctor: checking Antigravity MCP configuration"
check_mcp_config

summary

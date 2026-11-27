#!/usr/bin/env bash
# Read-only preview of the vulnerable infrastructure configuration.
set -u
source "$(dirname "${BASH_SOURCE[0]}")/common.sh"

require_configured_project
log_info "plan: showing what 'apply' would create in lab project $PROJECT_ID (no changes made)"
terraform -chdir="$TERRAFORM_DIR" plan -input=false -no-color

# macOS / Linux entry point. Every target delegates to the shared scripts in scripts/.
# Use ARGS=--yes with apply or destroy to skip the typing prompt (the project guard still applies).
SCRIPTS := scripts
ARGS ?=

.PHONY: doctor plan apply destroy help

help:
	@echo "doctor  - read-only prerequisite check"
	@echo "plan    - preview the vulnerable infrastructure (no changes)"
	@echo "apply   - create the vulnerable lab resources"
	@echo "destroy - remove the lab resources"
	@echo "ARGS=--yes skips the typing prompt for apply/destroy; the lab project check still runs"

doctor:
	bash $(SCRIPTS)/doctor.sh $(ARGS)

plan:
	bash $(SCRIPTS)/plan.sh $(ARGS)

apply:
	bash $(SCRIPTS)/apply.sh $(ARGS)

destroy:
	bash $(SCRIPTS)/destroy.sh $(ARGS)

# macOS / Linux entry point. All targets delegate to the shared command layer.
SCRIPTS := ../scripts

.PHONY: doctor plan apply destroy help

help:
	@echo "doctor  - read-only prerequisite check"
	@echo "plan    - preview the vulnerable infrastructure (no changes)"
	@echo "apply   - create the vulnerable lab resources"
	@echo "destroy - remove the lab resources"

doctor:
	bash $(SCRIPTS)/doctor.sh

plan:
	bash $(SCRIPTS)/plan.sh

apply:
	bash $(SCRIPTS)/apply.sh

destroy:
	bash $(SCRIPTS)/destroy.sh

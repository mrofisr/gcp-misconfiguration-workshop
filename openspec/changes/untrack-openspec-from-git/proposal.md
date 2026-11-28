# Proposal

## Why

`openspec/` holds 41 tracked planning and design files. They are maintainer tooling, not lab material participants need in a clone. The user wants them kept locally but absent from version control and the published source repository. Adding `openspec/` to `.gitignore` alone will not untrack files Git already tracks, so this change must explicitly untrack them and update the published spec and README to match.

## What Changes

- **BREAKING** Untrack all 41 files under `openspec/` with `git rm -r --cached openspec/` while leaving them untouched on disk, then add `openspec/` to `.gitignore` so they stay untracked.
- **BREAKING** Update the `source-repository-publishing` requirement so the published source tree no longer contains `openspec/`; a fresh clone holds only the lab material. This delta assumes `flatten-workshop-to-root` has been applied and synced first, so the flat root is the baseline being edited.
- Update the root README to remove the `openspec/` folder row and its "do not rename or move" tool-convention note, replacing them with a short statement that OpenSpec artifacts are local-only and absent from clones.
- Verify that local OpenSpec files remain readable, `git ls-files openspec` is empty, and a fresh clone contains no `openspec/` directory. The `gh-pages` branch is untouched.
- Preserve the ability to complete this change: commit the documentation, spec delta, and this change's artifacts first, then untrack `openspec/` in a final commit so nothing needed for review is lost.

Recorded consequence, accepted by the user: once untracked, future OpenSpec proposals, applies, and archives are local-only and will not be shared through Git unless files are explicitly force-added.

Assumptions recorded for planning:

- Files under `openspec/` remain on disk with unchanged content; only their Git tracking status changes.
- `flatten-workshop-to-root` is applied and its spec synced before this change is applied.
- No other `.gitignore` rules change in this change.
- No cloud resources, credentials, or slide content change.

## Capabilities

### New Capabilities

- none

### Modified Capabilities

- `source-repository-publishing`: the published source tree drops `openspec/`; the clone contains only the flat root lab material, and `openspec/` is an ignored local-only directory.

## Impact

- Git index: 41 files under `openspec/` removed from tracking; local working-tree copies preserved.
- Edited: `.gitignore` (add `openspec/`), root `README.md`, and a delta spec under this change that updates `openspec/specs/source-repository-publishing/spec.md`.
- Unchanged: local `openspec/` file contents, `gh-pages`, lab code, and cloud resources.
- Workflow impact: OpenSpec artifacts are no longer versioned; future changes may need explicit force-add to be shared.

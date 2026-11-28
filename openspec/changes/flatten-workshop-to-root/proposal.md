# Proposal

## Why

Workshop material currently sits two levels below the repository root: `workshop/` holds the guides and scripts, and its `vulnerable-starter/` child holds the wrappers, configuration, app, and Terraform. The root itself holds only a thin README and `openspec/`. Participants must descend through both directories to reach the lab, and those prefixes are repeated across live documentation and a published spec. With the slide deck now on `gh-pages`, the source branch can be a genuinely flat project root where the lab is immediately visible. This change removes both nesting levels, makes the root README the single front door, and adds a line-ending policy for cross-platform contributors.

## What Changes

- **BREAKING** Move the guides and `scripts/` from `workshop/` up to the repository root. Move every immediate child of `vulnerable-starter/` up to the root as well: `Makefile`, `setup-windows.ps1`, `.env.example`, `.agents/`, `app/`, and `terraform/`. Remove both the `workshop/` and `vulnerable-starter/` directories.
- **BREAKING** Merge `workshop/README.md` and `vulnerable-starter/README.md` into the root `README.md` as the one front door, preserving the audience table, safety heads-ups, `gh-pages` pointer, learning objectives, cost note, guide and command tables, danger notice, and vulnerability table. Delete both old READMEs.
- **BREAKING** Delete `facilitator-guide.md` instead of moving it to the root, and remove its links from the merged root README and the participant lab guide. Facilitator-only troubleshooting and the optional Security Command Center demo are dropped.
- Add `.gitattributes` to normalize text files to LF on check-in and checkout, with CRLF reserved for `*.ps1` and LF forced for `*.sh`, so the flat tree behaves consistently on Windows, Linux, and macOS.
- Rewrite the live references that name the old locations: the remaining guides, the command-layer path derivation in `scripts/common.sh` and `setup-windows.ps1`, the root `Makefile`, the `.env` and `.agents` copy instructions, the Go module path in `app/go.mod`, and the `source-repository-publishing` spec. Archived change documents and the in-progress change keep their historical paths.
- Keep `openspec/` tracked and the `gh-pages` branch untouched. The four lab commands keep the same behavior and resources.

Assumptions recorded for planning:

- Only the immediate children of `vulnerable-starter/` are moved; `app/` and `terraform/` remain directories rather than being unpacked file by file.
- Moved files keep their current basenames; no renaming beyond the two README merges and the facilitator-guide deletion.
- The Go module path becomes `app`, matching its new root-level location; the Docker build context stays `app/` because the Dockerfile remains inside it.
- The command layer is updated so `scripts/`, `app/`, `terraform/`, and `.env` are all located relative to the repository root.
- `.gitignore` is unchanged in this change; line endings are handled by `.gitattributes`, not by per-file conversion.
- No cloud resources, credentials, or deck content change.

## Capabilities

### New Capabilities

- none

### Modified Capabilities

- `source-repository-publishing`: the published source tree has a flat root holding the lab guides, `scripts/`, `app/`, `terraform/`, the root wrappers and config, `.gitattributes`, and `openspec/`; it contains neither a `workshop/` nor a `vulnerable-starter/` directory, no `facilitator-guide.md`, and no slide assets.

## Impact

- Moved to the root: `glossary.md`, `participant-lab-guide.md`, `scripts/**`, `Makefile`, `setup-windows.ps1`, `.env.example`, `.agents/**`, `app/**`, and `terraform/**`; `workshop/` and `vulnerable-starter/` deleted.
- Deleted: `facilitator-guide.md`. Added: `.gitattributes`.
- Edited: root `README.md` (three-way merge with facilitator links removed), `participant-lab-guide.md`, `scripts/common.sh` and any other command-layer path text, `setup-windows.ps1`, `app/go.mod`, and a delta spec under this change that updates `openspec/specs/source-repository-publishing/spec.md`.
- Unchanged: `openspec/` content and tracking, `gh-pages`, command behavior, and the deliberately vulnerable lab code itself.
- No credentials, billing, or cloud spend involved.

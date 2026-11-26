# Proposal

## Why

The GDG Semarang workshop project currently exists only as a local, non-git directory on this machine. To give it a durable, cloneable source of truth for backups and team handoff, it needs to be published to GitHub. The repository must be private because the materials include facilitator guides, a GCP-misconfiguration lab, and example credential/config files that should not be exposed publicly.

## What Changes

- Initialize the whole project directory as a Git repository and publish it to GitHub as a **private** repository named `gcp-misconfiguration-workshop` under the authenticated GitHub account.
- Include the complete project tree: `openspec/`, `workshop/`, and `slides/`.
- Add a `.gitignore` that excludes local/generated artifacts (e.g. `.terraform/`, Terraform state, local `.env` files, OS/editor junk) so no secrets or machine-specific state are committed.
- Create the initial commit and push it to the new `origin` remote.
- Verify the repository exists, is private, and the local working tree is clean after the push.

## Capabilities

### New Capabilities

- `source-repository-publishing`: The project's source is version-controlled in Git and published to a privately hosted GitHub repository, covering repository privacy, the set of content included, and exclusion of local/generated artifacts.

### Modified Capabilities

<!-- No existing capability requirements change. -->

## Impact

- New files: `.gitignore` and Git metadata (`.git/`).
- New external resource: private GitHub repository `gcp-misconfiguration-workshop`.
- Tooling: relies on the `gh` CLI being authenticated on this machine (assumed; no auth setup step in scope).
- Workshop content itself is unchanged. Existing capabilities (`anatomy-figure-embeds`, `revealjs-slide-deck`) are unaffected.

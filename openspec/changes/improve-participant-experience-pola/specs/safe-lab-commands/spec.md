# Spec Delta

## Purpose

Defines the observable contract of the lab commands so every platform exposes the same verbs, read-only verbs never mutate, and mutating verbs announce, confirm, and verify the target project before changing anything.

## ADDED Requirements

### Requirement: One implementation per verb

Each verb SHALL have exactly one implementation. Platform entry points SHALL delegate to that implementation and SHALL NOT define a second implementation of the same behavior. The Windows entry point SHALL delegate to the shared scripts rather than duplicate the command logic.

#### Scenario: Same command on every platform

- **WHEN** a user runs a verb through the supported platform entry point
- **THEN** the same shared script executes and produces the same outcome

#### Scenario: Windows entry point without a shell

- **WHEN** the Windows entry point runs on a machine where the shared shell is unavailable
- **THEN** it reports that prerequisite explicitly instead of silently running a different command implementation

### Requirement: Read-only verbs change nothing

`doctor` and `plan` SHALL be read-only. They SHALL NOT create, modify, or delete cloud resources, install tools, or edit local configuration files.

#### Scenario: Doctor leaves no trace

- **WHEN** a participant runs `doctor` in a clean checkout
- **THEN** `git status` is unchanged and no cloud resource is created or modified

#### Scenario: Plan leaves no trace

- **WHEN** a participant runs `plan` in a clean checkout
- **THEN** only a preview is printed and no cloud resource is created or modified

### Requirement: Mutating verbs announce before acting

`apply` and `destroy` SHALL print the target project, region, the resources affected, and a cost note before making any change.

#### Scenario: Apply announces its effect

- **WHEN** a participant runs `apply`
- **THEN** the project, region, and resources to be created are printed before the first cloud change

#### Scenario: Destroy announces deletions

- **WHEN** a participant runs `destroy`
- **THEN** the resources to be deleted are printed before the deletion begins

### Requirement: Project guard

Mutating verbs SHALL refuse to run unless an explicit lab project is configured and the active cloud CLI project matches it. A mismatch SHALL stop execution before any change and SHALL state the command that fixes it.

#### Scenario: Active project differs

- **WHEN** the active cloud CLI project differs from the configured lab project and the user runs `apply` or `destroy`
- **THEN** the command exits without changing anything and prints the command to select the lab project

#### Scenario: Lab project not configured

- **WHEN** no lab project is configured and the user runs `apply` or `destroy`
- **THEN** the command exits without changing anything and states how to configure it

### Requirement: Confirmation before mutation

After the announcement and the project guard, mutating verbs SHALL require the user to type the lab project ID before proceeding. A non-interactive flag MAY skip this typing prompt but SHALL NOT skip the project guard.

#### Scenario: Correct confirmation

- **WHEN** the user types the exact lab project ID at the prompt
- **THEN** the mutating command proceeds

#### Scenario: Wrong or cancelled confirmation

- **WHEN** the user types anything other than the lab project ID
- **THEN** the command cancels and states that nothing was changed

#### Scenario: Non-interactive override

- **WHEN** a facilitator runs a mutating verb with the documented non-interactive flag while the active project is the lab project
- **THEN** the command proceeds without the typing prompt, and a project mismatch still stops it

### Requirement: Idempotent mutating verbs

`apply` and `destroy` SHALL be safe to run twice in succession. A second run SHALL NOT create duplicate resources or fail because the first run already reached the desired state.

#### Scenario: Apply twice

- **WHEN** a user runs `apply` and immediately runs `apply` again
- **THEN** no duplicate resources exist and the second run completes without an error caused by the first run

#### Scenario: Destroy twice

- **WHEN** a user runs `destroy` and immediately runs `destroy` again
- **THEN** the second run reports that resources are already absent and completes successfully

### Requirement: No silent side effects

Commands SHALL NOT change global cloud configuration, create local configuration files, or install tools without first announcing the action and its reason.

#### Scenario: Bootstrap is announced

- **WHEN** a platform entry point installs prerequisites on first run
- **THEN** it prints which tools will be installed before installing them

### Requirement: Actionable failures

Every failure message SHALL state the problem and the next command or file to check. Bare error codes and messages without a next step SHALL NOT be presented as the final output.

#### Scenario: Not signed in

- **WHEN** a command detects that no cloud account is active
- **THEN** the output states that the user is not logged in and names the sign-in command

#### Scenario: Configuration missing

- **WHEN** a command detects that the lab configuration file is missing
- **THEN** the output names the example file to copy and where to put it

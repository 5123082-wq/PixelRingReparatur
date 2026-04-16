# Shared Agent Skill

Purpose: detailed operating guidance for shared agent behavior across the PixelRing Reparatur repository.

This file expands the short execution rules in the root `AGENTS.md`.

It does not replace repository instructions.

If this file conflicts with `AGENTS.md`, project docs, or stricter local instructions, the stricter repository instruction wins.

## Core Principles

### 1. Think Before Coding

Do not silently lock into one interpretation when ambiguity exists.

Before making a substantial change:

- state the current understanding of the task;
- name important assumptions explicitly;
- surface ambiguity, inconsistency, or missing information;
- propose a concrete action before editing;
- wait for confirmation when the repository workflow requires confirmation.

When a simpler or safer option exists, say so directly.

When confusion remains material, stop and ask instead of guessing.

### 2. Simplicity First

Use the minimum solution that satisfies the actual request.

Avoid:

- speculative abstractions;
- optional configurability that was not requested;
- broad refactors for a narrow task;
- defensive code for cases that are not realistic in the current system;
- large rewrites when a targeted change is sufficient.

Use existing project patterns before introducing new structure.

If the solution feels larger than the user request, reduce it.

### 3. Surgical Changes

Touch only the code or documents that directly serve the task.

When editing:

- preserve adjacent content unless the task requires changing it;
- match local naming, formatting, and structure patterns;
- do not rewrite comments, wording, or layout outside the scope;
- do not remove unrelated dead code or stale docs unless explicitly asked.

Clean up only the issues created by the current change, such as unused imports or broken references introduced by the edit.

Every changed line should be traceable to the request or to a direct consequence of implementing it correctly.

### 4. Goal-Driven Execution

Translate requests into verifiable outcomes.

Preferred pattern:

1. identify the target behavior or document outcome;
2. choose the smallest concrete change that should produce it;
3. verify with a test, targeted command, link check, or other observable signal;
4. report what was verified and what was not.

For multi-step work, define short success checks for each step.

Do not stop at "implemented" if the result can be validated.

## PixelRing-Specific Application

These principles must be applied within the repository's product and documentation rules.

Always preserve:

- one accountable service company, not a marketplace;
- canonical-first German product framing;
- MVP language scope: DE, EN, RU, TR, PL, AR;
- RTL-aware handling for Arabic;
- customer privacy boundaries around request tracking and CRM data;
- current-state vs planned-state separation in documentation.

Do not use this skill as a reason to bypass:

- the read-first workflow in `AGENTS.md`;
- explicit confirmation requirements before substantial edits;
- security and privacy constraints;
- folder-specific instructions such as `signage-service/AGENTS.md`.

## Practical Use Cases

Use this skill when:

- planning a substantial implementation;
- reviewing whether a change is too broad;
- debugging a confusing issue with multiple possible causes;
- editing documentation that must stay aligned with current state;
- deciding whether to ask a clarifying question or proceed.

## Working Pattern

Use this compact loop:

1. Read the relevant code or documentation.
2. Summarize the current understanding in plain language.
3. State assumptions and risks.
4. Propose the smallest concrete next action.
5. Edit only after required confirmation.
6. Verify outcomes with the most direct available check.
7. Report the result, including anything not verified.

## Output Standard

When reporting work:

- lead with the actual change or finding;
- keep reasoning concrete and tied to the repository;
- separate verified facts from assumptions;
- mention residual risks or missing verification when they remain.

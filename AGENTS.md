# Agent Instructions

This file is the operating contract for humans and coding agents working in this repository. It applies to the entire repository unless a more specific `AGENTS.md` exists in a subdirectory.

## Required context

Before changing code or project scope, read `README.md` and all files in `docs/`.

## Working rules

1. Confirm the requested outcome and inspect relevant files before editing.
2. Do not invent product requirements, environmental claims, credentials, APIs, datasets, or commands.
3. Keep changes narrow and preserve unrelated work.
4. Prefer the smallest implementation that proves the user journey end to end.
5. Run relevant checks and report any that could not run.
6. Update documentation when behavior, setup, architecture, scope, or a major decision changes.
7. Never commit secrets or personal data. Use environment variables and placeholder-only `.env.example` files.
8. Validate external content and tool output at system boundaries.

## Sustainability integrity

- State the impact hypothesis and baseline being improved.
- Distinguish measured results from estimates and aspirations.
- Record data sources, assumptions, units, geography, and time period.
- Avoid claims such as “carbon neutral,” “zero waste,” or percentage reductions without reproducible evidence.
- Consider rebound effects and tradeoffs involving compute, hardware, accessibility, privacy, and cost.

## Task workflow

1. Choose or add a task in `docs/TASKS.md` with a verifiable acceptance criterion.
2. Assign an owner and mark it in progress when parallel work is happening.
3. Implement in small, reviewable changes.
4. Run applicable checks.
5. Mark the task complete only when its acceptance criterion is met.
6. Record choices that constrain future work in `docs/DECISIONS.md`.

## Definition of done

- Requested behavior works.
- Relevant checks pass, or omissions are explicitly reported.
- Applicable error, empty, and loading states are addressed.
- Documentation remains accurate.
- Sustainability claims are traceable to evidence or documented assumptions.

## Commands

No development stack exists yet. Once initialized, replace `TBD` and mirror these commands in `README.md`.

| Purpose | Command |
| --- | --- |
| Install | TBD |
| Run locally | TBD |
| Test | TBD |
| Lint | TBD |
| Type-check | TBD |
| Build | TBD |

Use the repository's documented package manager; do not introduce a second lockfile.

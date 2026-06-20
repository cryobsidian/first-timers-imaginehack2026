# Agent Instructions

This file is the operating contract for humans and coding agents working in this repository. It applies to the entire repository unless a more specific `AGENTS.md` exists in a subdirectory.

## Required context

Before changing code or project scope:

1. Read the [Imaginehack Google Doc](https://docs.google.com/document/d/1LGSAJsdpWM457ZHPQNtn4pkLXDJsGlucR3RaT7Tg6-c) through the connected Google Drive plugin.
2. Read `README.md` and all files in `docs/`.

The Google Doc is the upstream source for hackathon briefs, tracks, sponsor research, team notes, and new constraints. Repository documentation is the implementation snapshot for the selected direction.

For BalikLoad implementation work, the Google Doc's **Tech Stack** tab is the technical source of truth and overrides older exploratory notes. Follow it unless the user explicitly changes the plan.

- Re-fetch the Google Doc when starting work that depends on requirements, judging criteria, sponsors, tracks, research, or product scope; do not rely on a previous agent's cached summary.
- Treat the **Idea Dump** as unconfirmed possibilities unless another section or a recorded team decision explicitly selects one.
- Verify important claims and sources independently before using them in the product, impact calculation, or pitch; notes in the Google Doc are context, not automatically validated evidence.
- When the Google Doc conflicts with an accepted repository decision, stop and surface the conflict. Do not silently overwrite either source.
- After the team selects a direction, reflect confirmed details in `docs/PROJECT_CONTEXT.md`, architecture implications in `docs/ARCHITECTURE.md`, tasks in `docs/TASKS.md`, and consequential choices in `docs/DECISIONS.md`.

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

| Purpose     | Command             |
| ----------- | ------------------- |
| Install     | `npm ci`            |
| Run locally | `npm run dev`       |
| Test        | `npm test`          |
| Lint        | `npm run lint`      |
| Type-check  | `npm run typecheck` |
| Build       | `npm run build`     |

Use the repository's documented package manager; do not introduce a second lockfile.

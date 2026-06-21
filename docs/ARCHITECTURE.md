# Architecture

The Imaginehack Google Doc's **Tech Stack** tab is the technical source of truth for this MVP.

## Accepted stack

- React 18 or newer, Vite, and TypeScript in strict mode
- React Router using `HashRouter` for GitHub Pages
- React Context plus `useReducer`; no Redux without demonstrated need
- One styling system: Tailwind CSS or the scaffold's existing CSS approach
- Bundled JSON seed data plus browser `localStorage`
- Vitest and React Testing Library where component tests add value
- ESLint, Prettier, GitHub Actions, and GitHub Pages

## System flow

```text
React pages and components
          |
          v
Application services
          |
          v
CargoLinkRepository interface (Promise-based)
          |
          v
LocalCargoLinkRepository
          |
          +--> bundled immutable JSON seed data
          +--> localStorage namespace: cargolink:v1
```

There is no deployed Node.js or Express backend. Node.js is local tooling only. A future `ApiCargoLinkRepository` may replace local persistence without requiring UI rewrites.

## Boundaries

- Components never access JSON or `localStorage` directly.
- Business logic stays outside JSX.
- Matching functions are pure and deterministic.
- Service boundaries validate inputs and return human-readable errors.
- Repository methods return Promises.
- No secrets or service credentials may enter the frontend bundle.
- IDs are strings; dates use ISO 8601; currency is MYR; weight is kg; distance is km; emissions are kg CO2e.

## Services

| Service    | Responsibility                                                                                 |
| ---------- | ---------------------------------------------------------------------------------------------- |
| Matching   | Hard compatibility filters, weighted scoring, deterministic ranking, explanations              |
| Validation | Shipment and return-trip rules with actionable errors                                          |
| Booking    | Idempotent acceptance transaction, status updates, capacity updates, competing-match rejection |
| Impact     | Illustrative utilisation, avoided-distance, carbon, and cost estimates                         |

## Persistence lifecycle

1. Read immutable bundled JSON seed data on first load.
2. Copy it into `localStorage` under `cargolink:v1` with a `schemaVersion`.
3. Read subsequent state through `LocalCargoLinkRepository`.
4. Reset safely to seed data when requested or when the schema is incompatible.
5. Persist booking state as one transaction after re-reading current state.

## Matching contract

Reject incompatible pairs before scoring, including invalid statuses, unverified carriers, insufficient capacity, unsupported or hazardous cargo, refrigeration mismatch, incompatible time, and incompatible route direction.

For compatible pairs:

```text
score = routeFit * 0.30
      + capacityFit * 0.15
      + timeFit * 0.15
      + cargoFit * 0.15
      + vehicleFit * 0.10
      + reliability * 0.10
      + profitability * 0.05
      - detourPenalty
```

Clamp scores to 0-100. Rank by score descending, detour ascending, departure ascending, then carrier reliability descending. Every result must include explanation strings.

## Demo reliability and operations

| Concern               | Decision                                                       |
| --------------------- | -------------------------------------------------------------- |
| External dependencies | Golden demo requires none                                      |
| Routes/distances      | Predefined matrix for relevant Malaysian locations             |
| Carbon estimate       | Configured factor, explicitly labelled "Illustrative estimate" |
| Data reset            | Reset Demo Data restores immutable seeds                       |
| Deployment            | Static GitHub Pages build using `HashRouter`                   |
| Production build      | Must contain no secrets or credentials                         |

## Quality strategy

Prioritise unit tests for hard filters, scoring/ranking, booking invariants, persistence/schema handling, and reset behavior. Use component tests for meaningful user behavior rather than snapshots. Rehearse the complete golden demo without Wi-Fi or external APIs.

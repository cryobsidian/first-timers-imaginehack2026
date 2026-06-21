# CargoLink

> Imagine Hack 2026 sustainability project by **Team First Timers**

## Project Title and Description

**CargoLink** is a logistics-matching prototype that connects spare capacity on commercial vehicles' return journeys with compatible SME shipments.

Commercial vehicles often complete a delivery and travel back with unused cargo space. At the same time, small and medium-sized businesses need affordable and reliable freight options. CargoLink matches these two needs using route, timing, capacity, cargo, vehicle, carrier-reliability, and commercial criteria.

The hackathon MVP demonstrates how better utilisation of journeys that are already taking place could reduce empty running, create additional carrier revenue, lower transport costs for SMEs, and avoid some dedicated freight journeys.

## Team

**Team name:** First Timers

**Team members:**

- Nikita
- Hui Xin
- Evan
- Nyshant
- Mariam

## Project Overview

CargoLink provides three primary screens:

1. **Main menu** - choose the Carrier or SME demonstration workspace. The role buttons are navigation controls and do not perform real authentication.
2. **Carrier dashboard** - review return trips, remaining capacity, trip status, and pricing, or publish a new return journey.
3. **SME dashboard** - review shipment requests, create a shipment, inspect ranked compatible trips, and accept a booking.

The application includes a bundled Klang Valley-to-Penang demonstration scenario and works without live maps, authentication, external APIs, or an internet-dependent backend.

## Project Details

### Matching workflow

CargoLink applies two matching stages:

1. **Hard compatibility filtering** removes trips with incompatible route direction, pickup time, cargo type, refrigeration, carrier verification, status, weight, or pallet capacity.
2. **Weighted ranking** scores compatible trips using route fit, capacity utilisation, time fit, cargo and vehicle fit, carrier reliability, profitability, and estimated detour.

Every match includes a score breakdown and human-readable reasons. The user can accept a suggested match, which books the shipment, reduces the trip's remaining capacity, and rejects competing suggestions without allowing duplicate booking or negative capacity.

### Sustainability approach

The MVP estimates the potential emissions avoided when an SME uses spare capacity on an existing return journey instead of requiring a dedicated trip:

```text
Illustrative CO2e saved = avoided journey distance x demo emission factor
```

The configured demonstration factor is `0.9 kg CO2e/km`. All displayed results are labelled **Illustrative estimate** and are not audited carbon accounting.

### Data and persistence

- Immutable JSON files provide reliable seed data.
- Browser `localStorage` stores demo changes under the versioned `cargolink:v1` namespace.
- A repository interface separates React components from persistence.
- **Reset Demo Data** restores the original scenario.
- No credentials, personal data, or API keys are required.

## Technologies Used

| Area                   | Technology                                                       |
| ---------------------- | ---------------------------------------------------------------- |
| User interface         | React 19, React Router                                           |
| Build tooling          | Vite 8                                                           |
| Language               | TypeScript in strict mode                                        |
| State management       | React Context and hooks                                          |
| Persistence            | JSON seed data and browser `localStorage`                        |
| Testing                | Vitest, React Testing Library, Testing Library User Event, jsdom |
| Code quality           | ESLint, Prettier, TypeScript compiler                            |
| Automation and hosting | GitHub Actions and GitHub Pages                                  |

The application uses `HashRouter` so client-side navigation works on static GitHub Pages hosting.

## Challenges and Approach

### Reliable demos without external services

Live routing, authentication, databases, and APIs introduce network and credential risks during a hackathon demonstration. CargoLink uses bundled Malaysian route data, deterministic services, and local persistence so the golden flow remains available offline.

### Explainable matching

A single unexplained percentage would be difficult for carriers and SMEs to trust. The matching engine separates hard rejection rules from weighted scoring and exposes both the score breakdown and plain-language reasons.

### Safe capacity updates

Accepting a booking must not double-subtract capacity or book the same shipment twice. The booking service re-reads the current state, verifies availability, applies the complete update as one transaction, rejects competing matches, and remains idempotent.

### Future backend migration

The MVP deliberately avoids a production backend. React components depend on a Promise-based repository interface rather than reading storage directly, allowing a future API repository to replace local persistence without rewriting the UI.

### Honest impact communication

Transport emissions depend on vehicle, load, route, fuel, and operating conditions. The prototype keeps its emission factor in configuration and clearly presents results as illustrative rather than audited savings.

## Usage

### Requirements

- Node.js 22 or newer
- npm

### Install and run

```bash
npm ci
npm run dev
```

Open the local URL printed by Vite, normally `http://localhost:5173`.

### Demo flow

1. Choose **Log in as Carrier** or **Log in as SME** from the main menu.
2. In the Carrier workspace, review or publish spare return capacity.
3. Use **Home** to switch to the SME workspace.
4. Create or select a shipment and choose **Find compatible trips**.
5. Review the ranked results, explanations, estimated price, and illustrative environmental benefit.
6. Accept a match and verify the shipment status and remaining trip capacity.
7. Use **Reset Demo Data** to restore the original scenario.

### Quality checks

```bash
npm run lint
npm run format:check
npm run typecheck
npm test
npm run build
```

To preview the production build locally:

```bash
npm run build
npm run preview
```

## Codebase Structure

```text
src/
  components/    Reusable interface and form components
  config/        Routes, storage, scoring, and impact configuration
  context/       Application state and repository integration
  data/          Bundled demonstration seed data
  models/        TypeScript domain models
  pages/         Main menu, dashboards, matching, and confirmation screens
  repositories/  Promise-based persistence contract and local implementation
  services/      Validation, matching, booking, and impact logic
  tests/         Unit, persistence, booking, and UI integration tests
```

Supporting project documentation is available in [AGENTS.md](AGENTS.md), [Project Context](docs/PROJECT_CONTEXT.md), [Architecture](docs/ARCHITECTURE.md), [Tasks](docs/TASKS.md), and [Decision Log](docs/DECISIONS.md).

## Deployment

The application is designed for static deployment through GitHub Pages. Pushes to `main` can run the verification and deployment workflow in `.github/workflows/deploy-pages.yml`. The production Vite base path is `/first-timers-imaginehack2026/`.

## MVP Limitations

The current prototype intentionally excludes production authentication, authorization, databases, live GPS and routing, payments, notifications, real-time synchronisation, automated licence or insurance verification, and audited carbon accounting.

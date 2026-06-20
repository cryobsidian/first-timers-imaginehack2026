# Imagine Hack 2026 - BalikLoad

BalikLoad matches spare capacity on commercial vehicles' return journeys with compatible SME shipments.

## Development

```bash
npm ci
npm run dev
```

## Quality checks

```bash
npm run lint
npm run format:check
npm run typecheck
npm test
npm run build
```

## Architecture

BalikLoad is a static React application built with Vite and strict TypeScript. React components call application services, which persist through a Promise-based repository interface. The MVP repository uses bundled JSON seed data and the versioned `balikload:v1` browser storage namespace.

The application uses `HashRouter` and is deployed to GitHub Pages without a backend or external service dependency. Carbon results are illustrative estimates rather than audited carbon accounting.

Read [AGENTS.md](AGENTS.md), [project context](docs/PROJECT_CONTEXT.md), [architecture](docs/ARCHITECTURE.md), and [tasks](docs/TASKS.md) before making changes.

## Demo flow

1. Open the seeded dashboard.
2. Create or select an SME shipment.
3. Review deterministic ranked matches and their explanations.
4. Accept the strongest match.
5. Confirm the shipment status, reduced trip capacity, and illustrative benefits.
6. Use **Reset Demo Data** to restore the original scenario.

## Deployment

Pushes to `main` can deploy through `.github/workflows/deploy-pages.yml`. The production Vite base path is `/first-timers-imaginehack2026/`.

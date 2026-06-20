# Tasks

The order below follows the confirmed **Tech Stack** implementation plan. Each active task needs one owner and a verifiable acceptance criterion.

## Now - foundation

- [ ] **Scaffold React, Vite, and strict TypeScript** - Owner: TBD
  - Acceptance: install, dev, type-check, test, lint, format-check, and build commands are documented and pass.
- [ ] **Configure `HashRouter` and GitHub Pages base path** - Owner: Frontend
  - Acceptance: direct navigation and refresh work in the production Pages build.
- [ ] **Define domain models and service contracts** - Owner: Logic/data
  - Acceptance: models are defined once, avoid `any`, and are agreed before parallel UI work.
- [ ] **Create Malaysian route/distance config and seed JSON** - Owner: Logic/data
  - Acceptance: the golden Klang Valley-to-Penang scenario works without external services.
- [ ] **Implement `BalikLoadRepository` and local persistence** - Owner: Logic/data
  - Acceptance: Promise-based methods, `balikload:v1`, `schemaVersion`, refresh persistence, and reset are tested.

## Next - business-critical vertical slice

- [ ] Implement shipment and return-trip validation with human-readable errors.
- [ ] Implement and test hard compatibility filters.
- [ ] Implement weighted scoring, deterministic ranking, and match explanations.
- [ ] Implement idempotent booking with atomic state persistence and overbooking protection.
- [ ] Implement configured illustrative impact estimates.
- [ ] Connect the golden demo pages and forms to repository-backed services.

## Then - presentation and reliability

- [ ] Add carrier and shipper dashboards, match details, confirmation, and Reset Demo Data.
- [ ] Cover loading, empty, invalid-input, error, and already-booked states.
- [ ] Configure GitHub Actions and GitHub Pages deployment.
- [ ] Verify all required tests from the Tech Stack specification.
- [ ] Rehearse the golden demo offline and from a clean browser profile.
- [ ] Verify every sustainability claim and label carbon output "Illustrative estimate".
- [ ] Prepare the pitch, recorded fallback demo, and submission links.

## Blocked

- None.

## Done

- [x] Initialize agentic project documentation.
- [x] Select BalikLoad and confirm the MVP architecture.
- [x] Synchronize the Tech Stack plan into repository documentation.
# Decision Log

Record choices that constrain future work. Use the next sequential ID. Supersede accepted decisions instead of rewriting them.

## Template

### ADR-NNN: Short title

- **Date:** YYYY-MM-DD
- **Status:** Proposed | Accepted | Superseded
- **Owners:** Names or roles
- **Context:** What requires a decision?
- **Decision:** What was selected?
- **Alternatives:** What credible options were considered?
- **Consequences:** What becomes easier, harder, or risky?
- **Revisit trigger:** What evidence could change this?

## ADR-001: Keep initial documentation stack-neutral

- **Date:** 2026-06-19
- **Status:** Superseded by ADR-002
- **Owners:** Project team
- **Context:** The repository has no defined product concept or implementation stack.
- **Decision:** Initialize product, architecture, task, and agent guidance without selecting technologies or inventing requirements.
- **Alternatives:** Scaffold a conventional web stack immediately.
- **Consequences:** Discovery stays explicit and avoids premature lock-in; implementation waits for a narrow problem and stack choice.
- **Revisit trigger:** The target user, core journey, impact metric, and hackathon constraints are defined.

## ADR-002: Build CargoLink as a static repository-backed SPA

- **Date:** 2026-06-20
- **Status:** Accepted
- **Owners:** Project team
- **Context:** The Imaginehack Google Doc now defines CargoLink and its Tech Stack tab as the technical source of truth.
- **Decision:** Build a React/Vite strict-TypeScript SPA using `HashRouter`, Context/useReducer, Promise-based repository interfaces, bundled JSON seeds, namespaced/versioned `localStorage`, deterministic services, Vitest, and GitHub Pages. Do not add a deployed backend or Express server.
- **Alternatives:** A full-stack Node/Express application, live external services, or direct component access to browser persistence.
- **Consequences:** The golden demo remains offline-capable and fast to build; the repository abstraction preserves a path to a future API. Multi-user synchronization and production security are outside MVP scope.
- **Revisit trigger:** The user explicitly changes the plan, or a confirmed hackathon requirement cannot be met by static deployment.

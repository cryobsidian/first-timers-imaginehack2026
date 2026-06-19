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
- **Status:** Accepted
- **Owners:** Project team
- **Context:** The repository has no defined product concept or implementation stack.
- **Decision:** Initialize product, architecture, task, and agent guidance without selecting technologies or inventing requirements.
- **Alternatives:** Scaffold a conventional web stack immediately.
- **Consequences:** Discovery stays explicit and avoids premature lock-in; implementation waits for a narrow problem and stack choice.
- **Revisit trigger:** The target user, core journey, impact metric, and hackathon constraints are defined.

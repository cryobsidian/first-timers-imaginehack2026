# Architecture

Describe the system that exists, not an aspirational platform. Update this after the product and stack are selected.

## Principles

- Optimize for demo reliability and short feedback loops.
- Keep the critical path free of unnecessary external dependencies.
- Put third-party integrations behind small interfaces with fallback data.
- Keep impact calculations deterministic, tested, and traceable to sources.
- Collect the minimum data necessary and avoid personal data by default.

## System context

```text
[Target user]
      |
      v
[Client] ---> [Application logic] ---> [Data store]
                    |
                    +---> [External service/dataset]
                    +---> [Impact calculation]
```

Replace this diagram after choosing the product shape. Remove unneeded components.

## Components

| Component | Responsibility | Technology | Status |
| --- | --- | --- | --- |
| User interface | TBD | TBD | Not selected |
| Application logic | TBD | TBD | Not selected |
| Persistence | TBD | TBD | Not selected |
| Impact calculation | Inputs, assumptions, units, result | TBD | Not selected |
| External integrations | TBD | TBD | Not selected |

## Data and trust boundaries

| Input | Source | Validation | Sensitivity | Failure fallback |
| --- | --- | --- | --- | --- |
| TBD | TBD | TBD | TBD | TBD |

## Impact calculation contract

Every reported result should document input values and units, baseline, formula/model version, coefficient sources and dates, rounding, uncertainty, limitations, and excluded effects.

## Quality strategy

- Unit tests: calculations, transformations, validation, and edge cases.
- Integration tests: storage and external adapters.
- End-to-end smoke test: the primary demo journey.
- Manual rehearsal: clean start, degraded fallback, and reset procedure.

## Operations

| Concern | Decision |
| --- | --- |
| Configuration | Environment variables; placeholders in `.env.example` |
| Secrets | Never stored in the repository or client bundle |
| Logs | No secrets or personal data |
| Demo data reset | TBD |
| External-service fallback | TBD |
| Deployment | TBD |

# Project Context

This is the repository snapshot of the confirmed CargoLink plan. The Imaginehack Google Doc's **Tech Stack** tab is the upstream technical source of truth.

## Snapshot

| Field                  | Current answer                                                                              |
| ---------------------- | ------------------------------------------------------------------------------------------- |
| Event                  | Imagine Hack 2026                                                                           |
| Theme                  | Sustainability                                                                              |
| Project name           | CargoLink                                                                                   |
| One-line pitch         | Match spare capacity on commercial vehicles' return journeys with compatible SME shipments. |
| Primary users          | Commercial carriers and SME shippers                                                        |
| Demo date and timezone | TBD                                                                                         |
| Team roles             | Frontend owner; logic and data owner                                                        |

## Problem and solution

- **Problem:** Commercial vehicles may return with unused cargo capacity while SMEs need affordable freight options.
- **Core intervention:** Deterministically filter, score, rank, explain, and book compatible shipments against return trips.
- **Carrier value:** Additional revenue and better remaining-capacity utilisation.
- **SME value:** Explainable access to suitable freight capacity within route, time, cargo, capacity, and budget constraints.
- **MVP boundary:** Palletised, non-perishable, non-hazardous B2B freight.

## Golden demo

1. A verified carrier publishes spare capacity on a Klang Valley to Penang return journey.
2. An SME creates a compatible palletised shipment.
3. CargoLink removes incompatible journeys and ranks the remaining matches.
4. The user inspects the highest-ranked result and its score explanation.
5. The shipper accepts the match.
6. The shipment becomes booked and the trip's remaining capacity decreases atomically.
7. The interface shows illustrative commercial and environmental benefits.

## Sustainability hypothesis

> If an SME shipment uses compatible spare capacity on an existing commercial return trip instead of requiring a dedicated journey, then estimated transport emissions should decrease because the shipment avoids some dedicated-journey distance.

| Measurement field   | Definition                                                                             |
| ------------------- | -------------------------------------------------------------------------------------- |
| Baseline            | A dedicated shipment journey over the estimated avoided distance                       |
| Primary metric      | Illustrative estimated CO2e saved in kilograms                                         |
| Formula             | Avoided dedicated journey distance (km) x configured demo emission factor (kg CO2e/km) |
| Product metric      | Remaining vehicle capacity utilised and successful bookings                            |
| Initial demo factor | `0.9 kg CO2e/km`, held in configuration                                                |
| Limitation          | Illustrative estimate only; not audited carbon accounting                              |
| Risks               | Rebound demand, inaccurate distance assumptions, and overclaiming estimated savings    |

## Must demonstrate

- Carrier return-trip creation and SME shipment creation.
- Deterministic hard filtering, weighted ranking, and understandable explanations.
- Idempotent booking without overbooking or negative capacity.
- State persistence across refresh and reliable demo-data reset.
- Static GitHub Pages deployment that works without external services.

## Non-goals

No production backend, database, authentication/authorization, real-time sync, live GPS or routing APIs, payments, document uploads, automated licence/insurance verification, notifications, audited carbon accounting, or complex administration dashboards.

## Open questions

| Question                                                                   | Owner | Status |
| -------------------------------------------------------------------------- | ----- | ------ |
| What are the final judging rubric, demo duration, and submission deadline? | TBD   | Open   |
| Which verified source should replace or validate the demo emission factor? | TBD   | Open   |
| Who owns frontend work and who owns logic/data work?                       | Team  | Open   |

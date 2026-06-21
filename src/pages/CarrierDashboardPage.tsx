import { Link } from 'react-router-dom'
import { CapacityIndicator } from '../components/CapacityIndicator'
import { useApp } from '../context/AppContext'

export function CarrierDashboardPage() {
  const { state, loading, error, resetDemoData } = useApp()

  if (loading)
    return (
      <main className="main">
        <p>Loading carrier workspace...</p>
      </main>
    )

  if (error || !state)
    return (
      <main className="main">
        <div className="error">{error ?? 'Carrier data is unavailable.'}</div>
      </main>
    )

  return (
    <main className="main">
      <div className="dashboard-heading">
        <div>
          <p className="eyebrow">Carrier workspace</p>
          <h1>Return-trip dashboard</h1>
          <p className="muted">
            Publish spare capacity and monitor the journeys available to SMEs.
          </p>
        </div>
        <div className="dashboard-actions">
          <Link className="button button-secondary" to="/">
            Home
          </Link>
          <button
            className="button button-quiet"
            onClick={() => void resetDemoData()}
            type="button"
          >
            Reset Demo Data
          </button>
          <Link className="button button-primary" to="/post-trip">
            Post Return Trip
          </Link>
        </div>
      </div>

      <div className="section-heading">
        <h2>Your return trips</h2>
      </div>

      <section
        className="role-dashboard-list"
        aria-label="Carrier return trips"
      >
        {state.trips.map((trip) => {
          const carrier = state.carriers.find(
            (item) => item.id === trip.carrierId,
          )
          const vehicle = state.vehicles.find(
            (item) => item.id === trip.vehicleId,
          )
          return (
            <article className="card" key={trip.id}>
              <div className="card-topline">
                <span>{carrier?.name ?? 'Logistics Company A'}</span>
                <strong>{trip.status.replace('_', ' ')}</strong>
              </div>
              <h4>
                {trip.origin} to {trip.destination}
              </h4>
              <p>{vehicle?.vehicleType}</p>
              <CapacityIndicator
                available={trip.availableWeightKg}
                maximum={vehicle?.maxWeightKg ?? trip.availableWeightKg}
                label={`${trip.availableWeightKg.toLocaleString()} kg remaining`}
              />
              <div className="meta-row">
                <span>{trip.availablePallets} pallets</span>
                <span>MYR {trip.pricePerKm.toFixed(2)}/km</span>
              </div>
            </article>
          )
        })}
      </section>
    </main>
  )
}

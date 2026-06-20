import { Link } from 'react-router-dom'
import hero from '../assets/hero.png'
import { CapacityIndicator } from '../components/CapacityIndicator'
import { useApp } from '../context/AppContext'

export function DashboardPage() {
  const { state, loading, error } = useApp()

  if (loading)
    return (
      <main className="main">
        <p>Loading demonstration data...</p>
      </main>
    )
  if (error || !state)
    return (
      <main className="main">
        <div className="error">
          {error ?? 'Application data is unavailable.'}
        </div>
      </main>
    )

  return (
    <main>
      <section className="hero">
        <div>
          <p className="eyebrow">Return loaded. Waste avoided.</p>
          <h1>Turn empty return journeys into useful capacity.</h1>
          <p>
            BalikLoad connects verified commercial carriers with SME freight
            using explainable route, capacity, time, and commercial matching.
          </p>
          <div className="hero-actions">
            <Link className="button button-primary" to="/request-shipment">
              Request SME transport
            </Link>
            <Link className="button button-secondary" to="/post-trip">
              Publish return capacity
            </Link>
          </div>
          <p className="demo-note">
            Offline-ready demo. No live map or external service required.
          </p>
        </div>
        <img src={hero} alt="Commercial truck travelling on a highway" />
      </section>

      <section className="main">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Live demonstration scenario</p>
            <h2>Marketplace overview</h2>
          </div>
          <span className="status-pill">
            {
              state.trips.filter((trip) =>
                ['available', 'partially_booked'].includes(trip.status),
              ).length
            }{' '}
            bookable trips
          </span>
        </div>

        <div className="market-grid">
          <section>
            <h3>Carrier return trips</h3>
            <div className="card-list">
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
                      <span>
                        {carrier?.verified ? 'Verified carrier' : 'Unverified'}
                      </span>
                      <strong>{trip.status.replace('_', ' ')}</strong>
                    </div>
                    <h4>
                      {trip.origin} to {trip.destination}
                    </h4>
                    <p>
                      {carrier?.name} / {vehicle?.vehicleType}
                    </p>
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
            </div>
          </section>

          <section>
            <h3>SME shipment requests</h3>
            <div className="card-list">
              {state.shipments.map((shipment) => (
                <article className="card" key={shipment.id}>
                  <div className="card-topline">
                    <span>{shipment.shipperName}</span>
                    <strong>{shipment.status}</strong>
                  </div>
                  <h4>
                    {shipment.origin} to {shipment.destination}
                  </h4>
                  <p>
                    {shipment.weightKg.toLocaleString()} kg / {shipment.pallets}{' '}
                    pallets / {shipment.cargoType}
                  </p>
                  <div className="meta-row">
                    <span>Budget MYR {shipment.budget}</span>
                    <span>
                      {shipment.requiresRefrigeration
                        ? 'Refrigerated'
                        : 'Ambient'}
                    </span>
                  </div>
                  {shipment.status === 'open' ? (
                    <Link
                      className="button button-primary button-full"
                      to={`/matches/${shipment.id}`}
                    >
                      Find compatible trips
                    </Link>
                  ) : (
                    <span className="booked-message">
                      Shipment successfully booked
                    </span>
                  )}
                </article>
              ))}
            </div>
          </section>
        </div>
      </section>
    </main>
  )
}

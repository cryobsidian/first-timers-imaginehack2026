import { Link } from 'react-router-dom'
import { useApp } from '../context/AppContext'

export function SmeDashboardPage() {
  const { state, loading, error, resetDemoData } = useApp()

  if (loading)
    return (
      <main className="main">
        <p>Loading SME workspace...</p>
      </main>
    )

  if (error || !state)
    return (
      <main className="main">
        <div className="error">{error ?? 'SME data is unavailable.'}</div>
      </main>
    )

  const openShipments = state.shipments.filter(
    (shipment) => shipment.status === 'open',
  )

  return (
    <main className="main">
      <div className="dashboard-heading">
        <div>
          <p className="eyebrow">SME shipper workspace</p>
          <h1>Shipment dashboard</h1>
          <p className="muted">
            Post palletised freight and compare explainable return-trip matches.
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
          <Link className="button button-primary" to="/request-shipment">
            Request Shipment
          </Link>
        </div>
      </div>

      <div className="section-heading">
        <h2>Your shipment requests</h2>
        <span className="status-pill">
          {openShipments.length} open shipments
        </span>
      </div>

      <section className="role-dashboard-list" aria-label="SME shipments">
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
                {shipment.requiresRefrigeration ? 'Refrigerated' : 'Ambient'}
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
      </section>
    </main>
  )
}

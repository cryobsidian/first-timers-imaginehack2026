import { Link, useParams } from 'react-router-dom'
import { useApp } from '../context/AppContext'

export function BookingConfirmationPage() {
  const { matchId = '' } = useParams()
  const { state } = useApp()
  const match = state?.matches.find(
    (item) => item.id === matchId && item.status === 'accepted',
  )
  const shipment = state?.shipments.find(
    (item) => item.id === match?.shipmentId,
  )
  const trip = state?.trips.find((item) => item.id === match?.tripId)
  const carrier = state?.carriers.find((item) => item.id === trip?.carrierId)

  if (!match || !shipment || !trip) {
    return (
      <main className="main">
        <div className="error">Booking confirmation is unavailable.</div>
      </main>
    )
  }

  return (
    <main className="main narrow">
      <section className="confirmation">
        <div className="confirmation-mark">OK</div>
        <p className="eyebrow">Capacity secured</p>
        <h1>Booking confirmed</h1>
        <p>
          {shipment.shipperName} is matched with {carrier?.name}.
        </p>
        <dl>
          <div>
            <dt>Route</dt>
            <dd>
              {shipment.origin} to {shipment.destination}
            </dd>
          </div>
          <div>
            <dt>Shipment</dt>
            <dd>
              {shipment.weightKg.toLocaleString()} kg / {shipment.pallets}{' '}
              pallets
            </dd>
          </div>
          <div>
            <dt>Remaining trip capacity</dt>
            <dd>
              {trip.availableWeightKg.toLocaleString()} kg /{' '}
              {trip.availablePallets} pallets
            </dd>
          </div>
          <div>
            <dt>Estimated price</dt>
            <dd>MYR {match.estimatedPrice}</dd>
          </div>
          <div>
            <dt>Illustrative CO2e benefit</dt>
            <dd>{match.estimatedCO2SavedKg} kg CO2e</dd>
          </div>
        </dl>
        <p className="estimate-note">
          Illustrative estimate based on avoided dedicated journey distance and
          the configured demo emission factor. This is not audited carbon
          accounting.
        </p>
        <Link className="button button-primary button-full" to="/sme">
          Return to SME dashboard
        </Link>
      </section>
    </main>
  )
}

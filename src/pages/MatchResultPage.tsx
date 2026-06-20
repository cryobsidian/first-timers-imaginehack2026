import { useMemo, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { MatchScoreBreakdown } from '../components/MatchScoreBreakdown'
import { useApp } from '../context/AppContext'
import { findMatchesForShipment } from '../services/matchingService'

export function MatchResultPage() {
  const { shipmentId = '' } = useParams()
  const { state, generateMatches, acceptMatch } = useApp()
  const navigate = useNavigate()
  const [error, setError] = useState('')
  const [booking, setBooking] = useState(false)
  const shipment = state?.shipments.find((item) => item.id === shipmentId)
  const matches = useMemo(() => {
    if (!state || !shipment) return []
    return findMatchesForShipment(shipment, state.trips, {
      carriers: state.carriers,
      vehicles: state.vehicles,
    })
  }, [shipment, state])

  if (!state || !shipment) {
    return (
      <main className="main">
        <div className="error">Shipment could not be found.</div>
      </main>
    )
  }

  async function handleAccept(matchId: string) {
    setBooking(true)
    setError('')
    try {
      await generateMatches(shipmentId)
      await acceptMatch(matchId)
      navigate(`/booking/${matchId}`)
    } catch (cause) {
      setError(
        cause instanceof Error ? cause.message : 'Match could not be booked.',
      )
      setBooking(false)
    }
  }

  return (
    <main className="main">
      <Link className="back-link" to="/">
        Back to dashboard
      </Link>
      <div className="section-heading">
        <div>
          <p className="eyebrow">Explainable matching</p>
          <h1>Ranked return trips</h1>
          <p className="muted">
            {shipment.origin} to {shipment.destination} /{' '}
            {shipment.weightKg.toLocaleString()} kg
          </p>
        </div>
        <span className="status-pill">
          {matches.length} compatible {matches.length === 1 ? 'trip' : 'trips'}
        </span>
      </div>
      {error && (
        <div className="error" role="alert">
          {error}
        </div>
      )}
      {matches.length === 0 ? (
        <div className="empty-state">
          <h2>No compatible trips yet</h2>
          <p>
            Capacity, route, timing, carrier verification, and cargo rules
            removed all candidates.
          </p>
          <Link className="button button-secondary" to="/post-trip">
            Publish another trip
          </Link>
        </div>
      ) : (
        <div className="match-list">
          {matches.map((match, index) => {
            const trip = state.trips.find((item) => item.id === match.tripId)
            const carrier = state.carriers.find(
              (item) => item.id === trip?.carrierId,
            )
            return (
              <article
                className={`match-card ${index === 0 ? 'best-match' : ''}`}
                key={match.id}
              >
                <div className="match-summary">
                  <div className="score">
                    <strong>{Math.round(match.score)}</strong>
                    <span>match score</span>
                  </div>
                  <div>
                    <span className="rank-label">
                      {index === 0 ? 'Best match' : `Option ${index + 1}`}
                    </span>
                    <h2>{carrier?.name}</h2>
                    <p>
                      {trip?.origin} to {trip?.destination} / departs{' '}
                      {new Date(trip?.departureAt ?? '').toLocaleString()}
                    </p>
                  </div>
                  <div className="price">
                    <span>Estimated price</span>
                    <strong>MYR {match.estimatedPrice}</strong>
                    <small>{match.estimatedDetourKm} km detour</small>
                  </div>
                </div>
                <MatchScoreBreakdown breakdown={match.breakdown} />
                <div className="match-details">
                  <div>
                    <h3>Why it matches</h3>
                    <ul>
                      {match.reasons.map((reason) => (
                        <li key={reason}>{reason}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="impact-box">
                    <span>Illustrative estimate</span>
                    <strong>{match.estimatedCO2SavedKg} kg CO2e</strong>
                    <p>
                      Potentially avoided by using existing return capacity
                      instead of a dedicated journey.
                    </p>
                  </div>
                </div>
                <button
                  className="button button-primary button-full"
                  disabled={booking}
                  onClick={() => void handleAccept(match.id)}
                  type="button"
                >
                  {booking ? 'Confirming capacity...' : 'Accept this match'}
                </button>
              </article>
            )
          })}
        </div>
      )}
    </main>
  )
}

import { Link } from 'react-router-dom'
import useLocalStorage from '../hooks/useLocalStorage'

function MatchResultPage() {
  const [trucks] = useLocalStorage('trucks', [])
  const [shipments] = useLocalStorage('shipments', [])

  // Get the latest truck and shipment
  const latestTruck = trucks[trucks.length - 1]
  const latestShipment = shipments[shipments.length - 1]

  // If either is missing
  if (!latestTruck || !latestShipment) {
    return (
      <div className="app">
        <div className="main">
          <div className="form-card" style={{ textAlign: 'center' }}>
            <h2>No Data Found</h2>
            <p style={{ color: '#6b7280', marginBottom: '1rem' }}>
              Post a truck and request a shipment first.
            </p>
            <Link to="/" style={{ color: '#4ade80', fontWeight: 700 }}>← Back to Dashboard</Link>
          </div>
        </div>
      </div>
    )
  }

  // Calculate match score
  let score = 0
  if (latestTruck.origin === latestShipment.origin) score += 40
  if (latestTruck.destination === latestShipment.destination) score += 40
  if (latestTruck.date === latestShipment.date) score += 15
  if (Number(latestTruck.capacity) >= Number(latestShipment.weight)) score += 5

  const isMatch = score >= 80
  const capacityOk = Number(latestTruck.capacity) >= Number(latestShipment.weight)

  // CO2 saved: estimate 0.15kg CO2 per km per tonne (simplified)
  const co2Saved = Math.round(Number(latestShipment.weight) * 300 * 0.15)

  return (
    <div className="app">
      <div className="main">
        <Link to="/" style={{ display: 'inline-block', marginBottom: '1rem', color: '#4ade80', fontWeight: 700 }}>
          ← Back to Dashboard
        </Link>

        <div className="form-card" style={{ textAlign: 'center' }}>
          {/* Match Score */}
          <div style={{
            fontSize: '3rem', fontWeight: 700,
            color: isMatch ? '#4ade80' : '#ef4444',
            marginBottom: '0.5rem'
          }}>
            {score}%
          </div>
          <p style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '2rem', color: '#111827' }}>
            {isMatch ? '✅ Match Found!' : '❌ No Match'}
          </p>

          {/* Side by side comparison */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '2rem' }}>
            {/* Truck Card */}
            <div style={{
              background: '#f9fafb', padding: '1rem', borderRadius: '0.75rem',
              border: '1px solid #e5e7eb'
            }}>
              <p style={{ fontWeight: 700, marginBottom: '0.5rem', color: '#111827' }}>🚛 Truck</p>
              <p style={{ fontSize: '0.875rem', color: '#4b5563' }}>{latestTruck.origin} → {latestTruck.destination}</p>
              <p style={{ fontSize: '0.875rem', color: '#4b5563' }}>{latestTruck.capacity} tonnes</p>
              <p style={{ fontSize: '0.875rem', color: '#4b5563' }}>{latestTruck.date}</p>
            </div>

            {/* Shipment Card */}
            <div style={{
              background: '#f9fafb', padding: '1rem', borderRadius: '0.75rem',
              border: '1px solid #e5e7eb'
            }}>
              <p style={{ fontWeight: 700, marginBottom: '0.5rem', color: '#111827' }}>📦 Shipment</p>
              <p style={{ fontSize: '0.875rem', color: '#4b5563' }}>{latestShipment.origin} → {latestShipment.destination}</p>
              <p style={{ fontSize: '0.875rem', color: '#4b5563' }}>{latestShipment.weight} tonnes</p>
              <p style={{ fontSize: '0.875rem', color: '#4b5563' }}>{latestShipment.date}</p>
            </div>
          </div>

          {/* Details */}
          <div style={{ textAlign: 'left', marginBottom: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0', borderBottom: '1px solid #e5e7eb' }}>
              <span>Route Match</span>
              <span style={{ fontWeight: 700, color: latestTruck.origin === latestShipment.origin && latestTruck.destination === latestShipment.destination ? '#4ade80' : '#ef4444' }}>
                {latestTruck.origin === latestShipment.origin && latestTruck.destination === latestShipment.destination ? '✅' : '❌'}
              </span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0', borderBottom: '1px solid #e5e7eb' }}>
              <span>Date Match</span>
              <span style={{ fontWeight: 700, color: latestTruck.date === latestShipment.date ? '#4ade80' : '#ef4444' }}>
                {latestTruck.date === latestShipment.date ? '✅' : '❌'}
              </span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0', borderBottom: '1px solid #e5e7eb' }}>
              <span>Capacity Fit</span>
              <span style={{ fontWeight: 700, color: capacityOk ? '#4ade80' : '#ef4444' }}>
                {capacityOk ? `✅ (${latestTruck.capacity}T ≥ ${latestShipment.weight}T)` : `❌ (${latestTruck.capacity}T < ${latestShipment.weight}T)`}
              </span>
            </div>
          </div>

          {/* CO2 Saved */}
          {isMatch && (
            <div style={{
              background: '#f0fdf4', padding: '1rem', borderRadius: '0.75rem',
              border: '1px solid #bbf7d0', marginBottom: '1rem'
            }}>
              <p style={{ fontWeight: 700, color: '#166534' }}>🌱 CO2 Savings</p>
              <p style={{ fontSize: '2rem', fontWeight: 700, color: '#15803d' }}>{co2Saved}kg</p>
              <p style={{ fontSize: '0.75rem', color: '#166534' }}>by avoiding an empty return trip</p>
            </div>
          )}

          <Link to="/" style={{
            display: 'inline-block', padding: '0.75rem 2rem',
            background: '#111827', color: 'white', borderRadius: '0.75rem',
            textDecoration: 'none', fontWeight: 700
          }}>
            Back to Dashboard
          </Link>
        </div>
      </div>
    </div>
  )
}

export default MatchResultPage
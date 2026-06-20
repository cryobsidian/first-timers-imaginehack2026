import { Link } from 'react-router-dom'

function MatchResultPage() {
  const stored = localStorage.getItem('matchResult')
  const match = stored ? JSON.parse(stored) : null

  if (!match) {
    return (
      <div className="app">
        <div className="main">
          <div className="form-card" style={{ textAlign: 'center' }}>
            <h2>No Match Data</h2>
            <p style={{ color: '#6b7280', marginBottom: '1rem' }}>Go to dashboard and click Find Match.</p>
            <Link to="/" style={{ color: '#4ade80', fontWeight: 700 }}>← Back to Dashboard</Link>
          </div>
        </div>
      </div>
    )
  }

  const { truck, shipment, score } = match
  const isMatch = score >= 80
  const capacityOk = Number(truck.capacity) >= Number(shipment.weight)
  const co2Saved = Math.round(Number(shipment.weight) * 300 * 0.15)

  return (
    <div className="app">
      <div className="main">
        <Link to="/" style={{ display: 'inline-block', marginBottom: '1rem', color: '#4ade80', fontWeight: 700 }}>
          ← Back to Dashboard
        </Link>

        <div className="form-card" style={{ textAlign: 'center' }}>
          <div style={{
            fontSize: '3rem', fontWeight: 700,
            color: isMatch ? '#4ade80' : '#ef4444',
            marginBottom: '0.5rem'
          }}>
            {score}%
          </div>
          <p style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '2rem', color: '#111827' }}>
            {isMatch ? '✅ Best Match Found!' : '❌ No Good Match'}
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '2rem' }}>
            <div style={{ background: '#f9fafb', padding: '1rem', borderRadius: '0.75rem', border: '1px solid #e5e7eb' }}>
              <p style={{ fontWeight: 700, marginBottom: '0.5rem', color: '#111827' }}>🚛 Truck</p>
              <p style={{ fontSize: '0.875rem', color: '#4b5563' }}>{truck.origin} → {truck.destination}</p>
              <p style={{ fontSize: '0.875rem', color: '#4b5563' }}>{truck.capacity} tonnes</p>
              <p style={{ fontSize: '0.875rem', color: '#4b5563' }}>{truck.date}</p>
            </div>
            <div style={{ background: '#f9fafb', padding: '1rem', borderRadius: '0.75rem', border: '1px solid #e5e7eb' }}>
              <p style={{ fontWeight: 700, marginBottom: '0.5rem', color: '#111827' }}>📦 Shipment</p>
              <p style={{ fontSize: '0.875rem', color: '#4b5563' }}>{shipment.origin} → {shipment.destination}</p>
              <p style={{ fontSize: '0.875rem', color: '#4b5563' }}>{shipment.weight} tonnes</p>
              <p style={{ fontSize: '0.875rem', color: '#4b5563' }}>{shipment.date}</p>
            </div>
          </div>

          {isMatch && (
            <div style={{ background: '#f0fdf4', padding: '1rem', borderRadius: '0.75rem', border: '1px solid #bbf7d0', marginBottom: '1rem' }}>
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
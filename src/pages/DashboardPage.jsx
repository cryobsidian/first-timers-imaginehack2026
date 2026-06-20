import { Link, useNavigate } from 'react-router-dom'
import useLocalStorage from '../hooks/useLocalStorage'

function DashboardPage() {
  const [trucks] = useLocalStorage('trucks', [])
  const [shipments] = useLocalStorage('shipments', [])
  const navigate = useNavigate()

  const findBestMatch = (truck) => {
    if (shipments.length === 0) {
      alert('No shipments available to match.')
      return
    }

    let bestScore = 0
    let bestShipment = shipments[0]

    shipments.forEach((shipment) => {
      let score = 0
      if (truck.origin === shipment.origin) score += 40
      if (truck.destination === shipment.destination) score += 40
      if (truck.date === shipment.date) score += 15
      if (Number(truck.capacity) >= Number(shipment.weight)) score += 5
      
      if (score > bestScore) {
        bestScore = score
        bestShipment = shipment
      }
    })

    localStorage.setItem('matchResult', JSON.stringify({
      truck,
      shipment: bestShipment,
      score: bestScore
    }))

    navigate('/match')
  }

  const findBestTruck = (shipment) => {
    if (trucks.length === 0) {
      alert('No trucks available to match.')
      return
    }

    let bestScore = 0
    let bestTruck = trucks[0]

    trucks.forEach((truck) => {
      let score = 0
      if (truck.origin === shipment.origin) score += 40
      if (truck.destination === shipment.destination) score += 40
      if (truck.date === shipment.date) score += 15
      if (Number(truck.capacity) >= Number(shipment.weight)) score += 5
      
      if (score > bestScore) {
        bestScore = score
        bestTruck = truck
      }
    })

    localStorage.setItem('matchResult', JSON.stringify({
      truck: bestTruck,
      shipment,
      score: bestScore
    }))

    navigate('/match')
  }

  return (
    <div className="app">
      <header className="header">
        <h1>Logistics Marketplace</h1>
        <p>Match empty trucks with waiting shipments</p>
      </header>
      
      <main className="main">
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '2rem' }}>
          <Link to="/post-truck" style={{
            padding: '1rem 2rem', background: '#111827', color: 'white',
            borderRadius: '1rem', textDecoration: 'none', fontWeight: 700
          }}>
            Post Available Truck
          </Link>
          
          <Link to="/request-shipment" style={{
            padding: '1rem 2rem', background: '#4ade80', color: '#111827',
            borderRadius: '1rem', textDecoration: 'none', fontWeight: 700
          }}>
            Request Shipment
          </Link>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
          
          {/* Trucks Column */}
          <div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1rem' }}>
              Available Trucks ({trucks.length})
            </h2>
            {trucks.length === 0 ? (
              <p style={{ color: '#9ca3af' }}>No trucks posted yet.</p>
            ) : (
              trucks.map((truck) => (
                <div key={truck.id} className="card" style={{ marginBottom: '0.75rem' }}>
                  <div className="card-body">
                    <h3>{truck.origin} → {truck.destination}</h3>
                    <p>{truck.capacity} tonnes | {truck.date}</p>
                    <p style={{ fontSize: '0.75rem', color: '#15803d', fontWeight: 600, marginTop: '0.25rem' }}>
                      Potential savings: ~RM {Math.round(Number(truck.capacity) * 300 * 0.50)}
                    </p>
                    <button onClick={() => findBestMatch(truck)} style={{
                      marginTop: '0.5rem', padding: '0.5rem 1rem',
                      background: '#4ade80', color: '#111827', borderRadius: '0.5rem',
                      border: 'none', fontWeight: 700, fontSize: '0.875rem', cursor: 'pointer'
                    }}>
                      Find Best Match
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Shipments Column */}
          <div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1rem' }}>
              Pending Shipments ({shipments.length})
            </h2>
            {shipments.length === 0 ? (
              <p style={{ color: '#9ca3af' }}>No shipments requested yet.</p>
            ) : (
              shipments.map((shipment) => (
                <div key={shipment.id} className="card" style={{ marginBottom: '0.75rem' }}>
                  <div className="card-body">
                    <h3>{shipment.origin} → {shipment.destination}</h3>
                    <p>{shipment.weight} tonnes | {shipment.date}</p>
                    <p style={{ fontSize: '0.75rem', color: '#6b7280', fontWeight: 600, marginTop: '0.25rem' }}>
                      Est. cost if separate truck: ~RM {Math.round(Number(shipment.weight) * 300 * 0.80)}
                    </p>
                    <button onClick={() => findBestTruck(shipment)} style={{
                      marginTop: '0.5rem', padding: '0.5rem 1rem',
                      background: '#111827', color: 'white', borderRadius: '0.5rem',
                      border: 'none', fontWeight: 700, fontSize: '0.875rem', cursor: 'pointer'
                    }}>
                      Find Best Truck
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

        </div>
      </main>
    </div>
  )
}

export default DashboardPage
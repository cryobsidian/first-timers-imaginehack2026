import { Link } from 'react-router-dom'
import useLocalStorage from '../hooks/useLocalStorage'

function DashboardPage() {
  const [trucks] = useLocalStorage('trucks', [])
  const [shipments] = useLocalStorage('shipments', [])

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

        {/* Side by side */}
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
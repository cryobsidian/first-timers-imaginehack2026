import { Link } from 'react-router-dom'

function DashboardPage() {
  return (
    <div className="app">
      <header className="header">
        <h1>Logistics Marketplace</h1>
        <p>Match empty trucks with waiting shipments</p>
      </header>
      
      <main className="main" style={{ textAlign: 'center' }}>
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link to="/post-truck" style={{
            padding: '1.5rem 3rem', background: '#111827', color: 'white',
            borderRadius: '1rem', textDecoration: 'none', fontWeight: 700, fontSize: '1.125rem'
          }}>
            🚛 Post Available Truck
          </Link>
          
          <Link to="/request-shipment" style={{
            padding: '1.5rem 3rem', background: '#4ade80', color: '#111827',
            borderRadius: '1rem', textDecoration: 'none', fontWeight: 700, fontSize: '1.125rem'
          }}>
            📦 Request Shipment
          </Link>
        </div>
      </main>
    </div>
  )
}

export default DashboardPage
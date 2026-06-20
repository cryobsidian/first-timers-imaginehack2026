import { Link } from 'react-router-dom'
import type { ReactNode } from 'react'
import { useApp } from '../context/AppContext'

export function AppShell({ children }: { children: ReactNode }) {
  const { resetDemoData } = useApp()

  return (
    <div className="app">
      <header className="header">
        <Link className="brand" to="/">
          <span className="brand-mark">BL</span>
          <span>
            <strong>BalikLoad</strong>
            <small>Smarter return journeys</small>
          </span>
        </Link>
        <nav>
          <Link to="/post-trip">Post return trip</Link>
          <Link to="/request-shipment">Request shipment</Link>
          <button
            className="button button-quiet"
            onClick={() => void resetDemoData()}
            type="button"
          >
            Reset Demo Data
          </button>
        </nav>
      </header>
      {children}
    </div>
  )
}

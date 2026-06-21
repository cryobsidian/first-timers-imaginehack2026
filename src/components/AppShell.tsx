import { Link } from 'react-router-dom'
import type { ReactNode } from 'react'

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="app">
      <header className="header">
        <Link className="brand" to="/">
          <span className="brand-mark">BL</span>
          <span>
            <strong>CargoLink</strong>
            <small>Smarter return journeys</small>
          </span>
        </Link>
        <span className="demo-mode">Demo mode</span>
      </header>
      {children}
    </div>
  )
}

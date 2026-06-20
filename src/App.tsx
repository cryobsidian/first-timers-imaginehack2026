import { HashRouter, Navigate, Route, Routes } from 'react-router-dom'
import { AppShell } from './components/AppShell'
import { ShipmentRequestForm } from './components/ShipmentRequestForm'
import { TruckPostForm } from './components/TruckPostForm'
import { AppProvider } from './context/AppContext'
import { BookingConfirmationPage } from './pages/BookingConfirmationPage'
import { DashboardPage } from './pages/DashboardPage'
import { MatchResultPage } from './pages/MatchResultPage'
import './App.css'

export function App() {
  return (
    <HashRouter>
      <AppProvider>
        <AppShell>
          <Routes>
            <Route path="/" element={<DashboardPage />} />
            <Route path="/post-trip" element={<TruckPostForm />} />
            <Route path="/request-shipment" element={<ShipmentRequestForm />} />
            <Route path="/matches/:shipmentId" element={<MatchResultPage />} />
            <Route
              path="/booking/:matchId"
              element={<BookingConfirmationPage />}
            />
            <Route path="*" element={<Navigate replace to="/" />} />
          </Routes>
        </AppShell>
      </AppProvider>
    </HashRouter>
  )
}

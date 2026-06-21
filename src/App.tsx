import { HashRouter, Navigate, Route, Routes } from 'react-router-dom'
import { AppShell } from './components/AppShell'
import { ShipmentRequestForm } from './components/ShipmentRequestForm'
import { TruckPostForm } from './components/TruckPostForm'
import { AppProvider } from './context/AppContext'
import { BookingConfirmationPage } from './pages/BookingConfirmationPage'
import { CarrierDashboardPage } from './pages/CarrierDashboardPage'
import { MainMenuPage } from './pages/MainMenuPage'
import { MatchResultPage } from './pages/MatchResultPage'
import { SmeDashboardPage } from './pages/SmeDashboardPage'
import './App.css'

export function App() {
  return (
    <HashRouter>
      <AppProvider>
        <AppShell>
          <Routes>
            <Route path="/" element={<MainMenuPage />} />
            <Route path="/carrier" element={<CarrierDashboardPage />} />
            <Route path="/sme" element={<SmeDashboardPage />} />
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

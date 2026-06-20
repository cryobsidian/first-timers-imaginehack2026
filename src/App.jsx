import { BrowserRouter, Routes, Route } from 'react-router-dom'
import DashboardPage from './pages/DashboardPage'
import TruckPostForm from './components/TruckPostForm'
import ShipmentRequestForm from './components/ShipmentRequestForm'
import MatchResultPage from './pages/MatchResultPage'



function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<DashboardPage />} />
        <Route path="/post-truck" element={<TruckPostForm />} />
        <Route path="/request-shipment" element={<ShipmentRequestForm />} />
        <Route path="/match" element={<MatchResultPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
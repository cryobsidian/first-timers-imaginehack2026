import { BrowserRouter, Routes, Route } from 'react-router-dom'
import DashboardPage from './pages/DashboardPage'
import TruckPostForm from './components/TruckPostForm'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<DashboardPage />} />
        <Route path="/post-truck" element={<TruckPostForm />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
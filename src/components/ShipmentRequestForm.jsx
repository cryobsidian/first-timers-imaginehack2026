import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import useLocalStorage from '../hooks/useLocalStorage'

function ShipmentRequestForm() {
  const [origin, setOrigin] = useState('')
  const [destination, setDestination] = useState('')
  const [weight, setWeight] = useState('')
  const [date, setDate] = useState('')
  const [shipments, setShipments] = useLocalStorage('shipments', [])
  const navigate = useNavigate()

  const isValid = origin && destination && weight && date

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!isValid) return

    const newShipment = {
      id: Date.now(),
      origin: origin.trim(),
      destination: destination.trim(),
      weight: weight.trim(),
      date: date,
      type: 'shipment'
    }

    setShipments([...shipments, newShipment])
    navigate('/match')
  }

  return (
    <div className="app">
      <div className="main">
        <form onSubmit={handleSubmit} className="form-card">
          <h2>Request Shipment</h2>

          <div className="form-group">
            <label>Origin</label>
            <input 
              type="text" 
              value={origin} 
              onChange={(e) => setOrigin(e.target.value)} 
              placeholder="e.g. Penang" 
            />
          </div>

          <div className="form-group">
            <label>Destination</label>
            <input 
              type="text" 
              value={destination} 
              onChange={(e) => setDestination(e.target.value)} 
              placeholder="e.g. Kuala Lumpur" 
            />
          </div>

          <div className="form-group">
            <label>Weight (tonnes)</label>
            <input 
              type="number" 
              value={weight} 
              onChange={(e) => setWeight(e.target.value)} 
              placeholder="e.g. 1.5" 
              min="0"
              step="0.5"
            />
          </div>

          <div className="form-group">
            <label>Date</label>
            <input 
              type="date" 
              value={date} 
              onChange={(e) => setDate(e.target.value)} 
            />
          </div>

          <button type="submit" disabled={!isValid} className="btn-submit">
            Find Match
          </button>
        </form>
      </div>
    </div>
  )
}

export default ShipmentRequestForm
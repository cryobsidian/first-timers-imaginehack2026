import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import useLocalStorage from '../hooks/useLocalStorage'


function TruckPostForm() {
  const [origin, setOrigin] = useState('')
  const [destination, setDestination] = useState('')
  const [capacity, setCapacity] = useState('')
  const [date, setDate] = useState('')
  const [trucks, setTrucks] = useLocalStorage('trucks', [])
  const navigate = useNavigate()

  const isValid = origin && destination && capacity && date

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!isValid) return

    const newTruck = {
      id: Date.now(),
      origin: origin.trim(),
      destination: destination.trim(),
      capacity: capacity.trim(),
      date: date,
      type: 'truck'
    }

    setTrucks([...trucks, newTruck])
    navigate('/')
  }

  return (
    <div className="app">
      <div className="main">
        <form onSubmit={handleSubmit} className="form-card">
          <h2>Post Available Truck</h2>
          
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
  <label>Capacity (tonnes)</label>
  <input 
    type="number" 
    value={capacity} 
    onChange={(e) => setCapacity(e.target.value)} 
    placeholder="e.g. 2" 
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
            Post Truck
          </button>
        </form>
      </div>
    </div>
  )
}

export default TruckPostForm


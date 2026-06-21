import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { LOCATIONS } from '../config/routes'
import { useApp } from '../context/AppContext'
import type { CreateShipmentInput } from '../models'

export function ShipmentRequestForm() {
  const { createShipment } = useApp()
  const navigate = useNavigate()
  const [shipperName, setShipperName] = useState('Kita Foods SME')
  const [origin, setOrigin] = useState('Shah Alam')
  const [destination, setDestination] = useState('Butterworth')
  const [pickupFrom, setPickupFrom] = useState('2026-06-21T08:00')
  const [pickupUntil, setPickupUntil] = useState('2026-06-21T12:00')
  const [weight, setWeight] = useState('1200')
  const [pallets, setPallets] = useState('2')
  const [cargoType, setCargoType] = useState('general')
  const [requiresRefrigeration, setRequiresRefrigeration] = useState(false)
  const [budget, setBudget] = useState('700')
  const [error, setError] = useState('')

  async function handleSubmit(event: FormEvent) {
    event.preventDefault()
    const input: CreateShipmentInput = {
      shipperName,
      origin,
      destination,
      pickupFrom: new Date(pickupFrom).toISOString(),
      pickupUntil: new Date(pickupUntil).toISOString(),
      weightKg: Number(weight),
      pallets: Number(pallets),
      cargoType,
      requiresRefrigeration,
      budget: Number(budget),
    }
    try {
      await createShipment(input)
      navigate('/sme')
    } catch (cause) {
      setError(
        cause instanceof Error
          ? cause.message
          : 'Shipment could not be created.',
      )
    }
  }

  return (
    <main className="main narrow">
      <Link className="back-link" to="/sme">
        Back to SME Dashboard
      </Link>
      <form
        onSubmit={(event) => void handleSubmit(event)}
        className="form-card"
      >
        <p className="eyebrow">SME shipper workspace</p>
        <h1>Request a shipment</h1>
        <p className="muted">
          Describe the load and CargoLink will rank compatible return trips.
        </p>
        {error && (
          <div className="error" role="alert">
            {error}
          </div>
        )}
        <label>
          Business name
          <input
            value={shipperName}
            onChange={(e) => setShipperName(e.target.value)}
          />
        </label>
        <div className="form-row">
          <label>
            Origin
            <select value={origin} onChange={(e) => setOrigin(e.target.value)}>
              {LOCATIONS.map((location) => (
                <option key={location}>{location}</option>
              ))}
            </select>
          </label>
          <label>
            Destination
            <select
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
            >
              {LOCATIONS.map((location) => (
                <option key={location}>{location}</option>
              ))}
            </select>
          </label>
        </div>
        <div className="form-row">
          <label>
            Pickup from
            <input
              type="datetime-local"
              value={pickupFrom}
              onChange={(e) => setPickupFrom(e.target.value)}
            />
          </label>
          <label>
            Pickup until
            <input
              type="datetime-local"
              value={pickupUntil}
              onChange={(e) => setPickupUntil(e.target.value)}
            />
          </label>
        </div>
        <div className="form-row">
          <label>
            Weight (kg)
            <input
              min="1"
              type="number"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
            />
          </label>
          <label>
            Pallets
            <input
              min="1"
              type="number"
              value={pallets}
              onChange={(e) => setPallets(e.target.value)}
            />
          </label>
        </div>
        <div className="form-row">
          <label>
            Cargo type
            <select
              value={cargoType}
              onChange={(e) => setCargoType(e.target.value)}
            >
              <option value="general">General palletised</option>
              <option value="electronics">Electronics</option>
            </select>
          </label>
          <label>
            Budget (MYR)
            <input
              min="1"
              type="number"
              value={budget}
              onChange={(e) => setBudget(e.target.value)}
            />
          </label>
        </div>
        <label className="checkbox">
          <input
            type="checkbox"
            checked={requiresRefrigeration}
            onChange={(e) => setRequiresRefrigeration(e.target.checked)}
          />{' '}
          Requires refrigeration
        </label>
        <button className="button button-primary" type="submit">
          Create shipment request
        </button>
      </form>
    </main>
  )
}

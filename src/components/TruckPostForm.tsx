import { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { LOCATIONS } from '../config/routes'
import { useApp } from '../context/AppContext'
import type { CreateReturnTripInput } from '../models'

export function TruckPostForm() {
  const { state, createTrip } = useApp()
  const navigate = useNavigate()
  const verifiedCarriers =
    state?.carriers.filter((carrier) => carrier.verified) ?? []
  const [carrierId, setCarrierId] = useState(verifiedCarriers[0]?.id ?? '')
  const selectedCarrierId = carrierId || verifiedCarriers[0]?.id || ''
  const vehicles =
    state?.vehicles.filter(
      (vehicle) => vehicle.carrierId === selectedCarrierId,
    ) ?? []
  const [vehicleId, setVehicleId] = useState('')
  const [origin, setOrigin] = useState('Klang')
  const [destination, setDestination] = useState('Penang')
  const [departureAt, setDepartureAt] = useState('2026-06-21T10:00')
  const [weight, setWeight] = useState('3000')
  const [pallets, setPallets] = useState('6')
  const [price, setPrice] = useState('1.6')
  const [error, setError] = useState('')

  async function handleSubmit(event: FormEvent) {
    event.preventDefault()
    const selectedVehicleId = vehicleId || vehicles[0]?.id || ''
    const input: CreateReturnTripInput = {
      carrierId: selectedCarrierId,
      vehicleId: selectedVehicleId,
      origin,
      destination,
      waypoints: LOCATIONS.filter(
        (location) => location !== origin && location !== destination,
      ),
      departureAt: new Date(departureAt).toISOString(),
      availableWeightKg: Number(weight),
      availablePallets: Number(pallets),
      acceptedCargoTypes: ['general', 'electronics'],
      pricePerKm: Number(price),
    }
    try {
      await createTrip(input)
      navigate('/carrier')
    } catch (cause) {
      setError(
        cause instanceof Error ? cause.message : 'Trip could not be created.',
      )
    }
  }

  return (
    <main className="main narrow">
      <form
        onSubmit={(event) => void handleSubmit(event)}
        className="form-card"
      >
        <p className="eyebrow">Carrier workspace</p>
        <h1>Publish spare return capacity</h1>
        <p className="muted">
          Add a verified vehicle journey for SME matching.
        </p>
        {error && (
          <div className="error" role="alert">
            {error}
          </div>
        )}
        <label>
          Carrier
          <select
            value={selectedCarrierId}
            onChange={(e) => {
              setCarrierId(e.target.value)
              setVehicleId('')
            }}
          >
            {verifiedCarriers.map((carrier) => (
              <option key={carrier.id} value={carrier.id}>
                {carrier.name}
              </option>
            ))}
          </select>
        </label>
        <label>
          Vehicle
          <select
            value={vehicleId || vehicles[0]?.id || ''}
            onChange={(e) => setVehicleId(e.target.value)}
          >
            {vehicles.map((vehicle) => (
              <option key={vehicle.id} value={vehicle.id}>
                {vehicle.vehicleType} - {vehicle.plateNumber}
              </option>
            ))}
          </select>
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
        <label>
          Departure
          <input
            type="datetime-local"
            value={departureAt}
            onChange={(e) => setDepartureAt(e.target.value)}
          />
        </label>
        <div className="form-row">
          <label>
            Available weight (kg)
            <input
              min="1"
              type="number"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
            />
          </label>
          <label>
            Available pallets
            <input
              min="1"
              type="number"
              value={pallets}
              onChange={(e) => setPallets(e.target.value)}
            />
          </label>
        </div>
        <label>
          Price per kilometre (MYR)
          <input
            min="0"
            step="0.1"
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          />
        </label>
        <button className="button button-primary" type="submit">
          Publish return trip
        </button>
      </form>
    </main>
  )
}

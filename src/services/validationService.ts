import type {
  AppState,
  CreateReturnTripInput,
  CreateShipmentInput,
} from '../models'
import { getRouteDistanceKm } from '../config/routes'

export const SUPPORTED_CARGO_TYPES = ['general', 'electronics'] as const

export class ValidationError extends Error {
  constructor(readonly errors: string[]) {
    super(errors.join(' '))
    this.name = 'ValidationError'
  }
}

export function validateShipment(input: CreateShipmentInput): void {
  const errors: string[] = []
  if (!input.shipperName.trim()) errors.push('Shipper name is required.')
  validateRoute(input.origin, input.destination, errors)
  if (new Date(input.pickupFrom) > new Date(input.pickupUntil)) {
    errors.push('Pickup start must be before or equal to pickup end.')
  }
  if (input.weightKg <= 0)
    errors.push('Shipment weight must be greater than zero.')
  if (input.pallets <= 0) errors.push('Pallet count must be greater than zero.')
  if (!SUPPORTED_CARGO_TYPES.includes(input.cargoType as never)) {
    errors.push('Cargo type is outside the supported MVP scope.')
  }
  if (input.cargoType.toLowerCase().includes('hazard')) {
    errors.push('Hazardous cargo is not supported.')
  }
  if (input.budget <= 0) errors.push('Budget must be greater than zero.')
  if (errors.length) throw new ValidationError(errors)
}

export function validateReturnTrip(
  input: CreateReturnTripInput,
  state: AppState,
): void {
  const errors: string[] = []
  const carrier = state.carriers.find((item) => item.id === input.carrierId)
  const vehicle = state.vehicles.find((item) => item.id === input.vehicleId)
  if (!carrier) errors.push('Carrier does not exist.')
  else if (!carrier.verified) errors.push('Carrier must be verified.')
  if (!vehicle) errors.push('Vehicle does not exist.')
  else {
    if (vehicle.carrierId !== input.carrierId) {
      errors.push('Vehicle must belong to the selected carrier.')
    }
    if (input.availableWeightKg > vehicle.maxWeightKg) {
      errors.push('Available weight cannot exceed vehicle maximum capacity.')
    }
    if (input.availablePallets > vehicle.maxPallets) {
      errors.push('Available pallets cannot exceed vehicle maximum capacity.')
    }
  }
  validateRoute(input.origin, input.destination, errors)
  if (!input.departureAt) errors.push('Departure time is required.')
  if (input.availableWeightKg <= 0) {
    errors.push('Available weight must be greater than zero.')
  }
  if (input.availablePallets <= 0) {
    errors.push('Available pallets must be greater than zero.')
  }
  if (!input.acceptedCargoTypes.length) {
    errors.push('At least one accepted cargo type is required.')
  }
  if (input.pricePerKm < 0) {
    errors.push('Price per kilometre cannot be negative.')
  }
  if (errors.length) throw new ValidationError(errors)
}

function validateRoute(
  origin: string,
  destination: string,
  errors: string[],
): void {
  if (!origin) errors.push('Origin is required.')
  if (!destination) errors.push('Destination is required.')
  if (origin && destination && origin === destination) {
    errors.push('Origin and destination cannot be identical.')
  } else if (
    origin &&
    destination &&
    getRouteDistanceKm(origin, destination) === undefined
  ) {
    errors.push('Route must follow the supported northbound corridor.')
  }
}

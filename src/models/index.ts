export interface Carrier {
  id: string
  name: string
  verified: boolean
  rating: number
  completedJobs: number
}

export interface Vehicle {
  id: string
  carrierId: string
  vehicleType: string
  plateNumber: string
  maxWeightKg: number
  maxPallets: number
  refrigerated: boolean
}

export type TripStatus =
  | 'available'
  | 'partially_booked'
  | 'full'
  | 'completed'
  | 'cancelled'

export interface ReturnTrip {
  id: string
  carrierId: string
  vehicleId: string
  origin: string
  destination: string
  waypoints: string[]
  departureAt: string
  availableWeightKg: number
  availablePallets: number
  acceptedCargoTypes: string[]
  pricePerKm: number
  status: TripStatus
}

export type ShipmentStatus = 'open' | 'booked' | 'completed' | 'cancelled'

export interface Shipment {
  id: string
  shipperName: string
  origin: string
  destination: string
  pickupFrom: string
  pickupUntil: string
  weightKg: number
  pallets: number
  cargoType: string
  requiresRefrigeration: boolean
  budget: number
  status: ShipmentStatus
}

export interface MatchScoreBreakdown {
  routeFit: number
  capacityFit: number
  timeFit: number
  cargoFit: number
  vehicleFit: number
  reliability: number
  profitability: number
  detourPenalty: number
}

export type MatchStatus = 'suggested' | 'accepted' | 'rejected'

export interface Match {
  id: string
  tripId: string
  shipmentId: string
  score: number
  breakdown: MatchScoreBreakdown
  estimatedDetourKm: number
  estimatedPrice: number
  estimatedCO2SavedKg: number
  reasons: string[]
  status: MatchStatus
  createdAt: string
}

export interface CreateReturnTripInput {
  carrierId: string
  vehicleId: string
  origin: string
  destination: string
  waypoints: string[]
  departureAt: string
  availableWeightKg: number
  availablePallets: number
  acceptedCargoTypes: string[]
  pricePerKm: number
}

export interface CreateShipmentInput {
  shipperName: string
  origin: string
  destination: string
  pickupFrom: string
  pickupUntil: string
  weightKg: number
  pallets: number
  cargoType: string
  requiresRefrigeration: boolean
  budget: number
}

export interface AppState {
  schemaVersion: number
  carriers: Carrier[]
  vehicles: Vehicle[]
  trips: ReturnTrip[]
  shipments: Shipment[]
  matches: Match[]
}

export interface CompatibilityResult {
  compatible: boolean
  reasons: string[]
}

export interface MatchingContext {
  carriers: Carrier[]
  vehicles: Vehicle[]
}

import type {
  AppState,
  Carrier,
  CreateReturnTripInput,
  CreateShipmentInput,
  Match,
  ReturnTrip,
  Shipment,
  Vehicle,
} from '../models'

export interface BalikLoadRepository {
  initialize(): Promise<void>
  getState(): Promise<AppState>
  getCarriers(): Promise<Carrier[]>
  getVehicles(): Promise<Vehicle[]>
  getTrips(): Promise<ReturnTrip[]>
  getShipments(): Promise<Shipment[]>
  getMatches(): Promise<Match[]>
  createReturnTrip(input: CreateReturnTripInput): Promise<ReturnTrip>
  createShipment(input: CreateShipmentInput): Promise<Shipment>
  saveTrip(trip: ReturnTrip): Promise<void>
  saveShipment(shipment: Shipment): Promise<void>
  saveMatch(match: Match): Promise<void>
  transaction(update: (state: AppState) => AppState): Promise<AppState>
  resetDemoData(): Promise<void>
}

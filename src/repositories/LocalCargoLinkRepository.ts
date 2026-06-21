import carriersData from '../data/carriers.json'
import matchesData from '../data/matches.json'
import shipmentsData from '../data/shipments.json'
import tripsData from '../data/trips.json'
import vehiclesData from '../data/vehicles.json'
import { SCHEMA_VERSION, STORAGE_KEY } from '../config/storage'
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
import type { CargoLinkRepository } from './CargoLinkRepository'

function seedState(): AppState {
  return structuredClone({
    schemaVersion: SCHEMA_VERSION,
    carriers: carriersData as Carrier[],
    vehicles: vehiclesData as Vehicle[],
    trips: tripsData as ReturnTrip[],
    shipments: shipmentsData as Shipment[],
    matches: matchesData as Match[],
  })
}

export class LocalCargoLinkRepository implements CargoLinkRepository {
  private transactionQueue: Promise<void> = Promise.resolve()

  constructor(private readonly storage: Storage = window.localStorage) {}

  async initialize(): Promise<void> {
    const current = this.read()
    if (!current || current.schemaVersion !== SCHEMA_VERSION) {
      this.write(seedState())
    }
  }

  async getState(): Promise<AppState> {
    await this.initialize()
    return structuredClone(this.readRequired())
  }

  async getCarriers(): Promise<Carrier[]> {
    return (await this.getState()).carriers
  }

  async getVehicles(): Promise<Vehicle[]> {
    return (await this.getState()).vehicles
  }

  async getTrips(): Promise<ReturnTrip[]> {
    return (await this.getState()).trips
  }

  async getShipments(): Promise<Shipment[]> {
    return (await this.getState()).shipments
  }

  async getMatches(): Promise<Match[]> {
    return (await this.getState()).matches
  }

  async createReturnTrip(input: CreateReturnTripInput): Promise<ReturnTrip> {
    const trip: ReturnTrip = {
      ...input,
      id: crypto.randomUUID(),
      status: 'available',
    }
    await this.saveTrip(trip)
    return trip
  }

  async createShipment(input: CreateShipmentInput): Promise<Shipment> {
    const shipment: Shipment = {
      ...input,
      id: crypto.randomUUID(),
      status: 'open',
    }
    await this.saveShipment(shipment)
    return shipment
  }

  async saveTrip(trip: ReturnTrip): Promise<void> {
    await this.transaction((state) => ({
      ...state,
      trips: upsert(state.trips, trip),
    }))
  }

  async saveShipment(shipment: Shipment): Promise<void> {
    await this.transaction((state) => ({
      ...state,
      shipments: upsert(state.shipments, shipment),
    }))
  }

  async saveMatch(match: Match): Promise<void> {
    await this.transaction((state) => ({
      ...state,
      matches: upsert(state.matches, match),
    }))
  }

  async transaction(update: (state: AppState) => AppState): Promise<AppState> {
    let result: AppState | undefined
    const operation = this.transactionQueue.then(() => {
      const current = this.read()
      const valid =
        current?.schemaVersion === SCHEMA_VERSION ? current : seedState()
      result = update(structuredClone(valid))
      this.write(result)
    })
    this.transactionQueue = operation.then(
      () => undefined,
      () => undefined,
    )
    await operation
    return structuredClone(result as AppState)
  }

  async resetDemoData(): Promise<void> {
    await this.transaction(() => seedState())
  }

  private read(): AppState | null {
    const raw = this.storage.getItem(STORAGE_KEY)
    if (!raw) return null
    try {
      return JSON.parse(raw) as AppState
    } catch {
      return null
    }
  }

  private readRequired(): AppState {
    const state = this.read()
    if (!state) throw new Error('CargoLink data could not be initialized.')
    return state
  }

  private write(state: AppState): void {
    this.storage.setItem(STORAGE_KEY, JSON.stringify(state))
  }
}

function upsert<T extends { id: string }>(items: T[], item: T): T[] {
  const exists = items.some((candidate) => candidate.id === item.id)
  return exists
    ? items.map((candidate) => (candidate.id === item.id ? item : candidate))
    : [...items, item]
}

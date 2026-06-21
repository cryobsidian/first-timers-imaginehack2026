import { describe, expect, it } from 'vitest'
import carriers from '../data/carriers.json'
import shipments from '../data/shipments.json'
import trips from '../data/trips.json'
import vehicles from '../data/vehicles.json'
import type {
  Carrier,
  MatchingContext,
  ReturnTrip,
  Shipment,
  Vehicle,
} from '../models'
import {
  calculateMatchScore,
  findMatchesForShipment,
  isCompatible,
} from '../services/matchingService'

const context: MatchingContext = {
  carriers: carriers as Carrier[],
  vehicles: vehicles as Vehicle[],
}
const shipment = shipments[0] as Shipment
const trip = trips[0] as ReturnTrip

describe('matching hard filters', () => {
  it('rejects an unverified carrier', () => {
    const unverifiedTrip = {
      ...trip,
      id: 'trip-unverified-test',
      carrierId: 'carrier-unverified',
      vehicleId: 'vehicle-unverified-1',
    }
    expect(isCompatible(shipment, unverifiedTrip, context).reasons).toContain(
      'Carrier is not verified.',
    )
  })

  it('rejects insufficient weight capacity', () => {
    expect(
      isCompatible(shipment, { ...trip, availableWeightKg: 100 }, context)
        .reasons,
    ).toContain('Remaining weight capacity is insufficient.')
  })

  it('rejects insufficient pallet capacity', () => {
    expect(
      isCompatible(shipment, { ...trip, availablePallets: 1 }, context).reasons,
    ).toContain('Remaining pallet capacity is insufficient.')
  })

  it('rejects unsupported cargo', () => {
    const unsupported = { ...shipment, cargoType: 'hazardous chemicals' }
    const result = isCompatible(unsupported, trip, context)
    expect(result.compatible).toBe(false)
    expect(result.reasons).toContain(
      'Cargo is outside the supported MVP scope.',
    )
    expect(result.reasons).toContain('Hazardous cargo is not supported.')
  })

  it('rejects a refrigeration mismatch', () => {
    const refrigerated = { ...shipment, requiresRefrigeration: true }
    expect(isCompatible(refrigerated, trip, context).reasons).toContain(
      'Vehicle does not satisfy refrigeration requirements.',
    )
  })

  it('rejects incompatible timing', () => {
    const late = {
      ...shipment,
      pickupFrom: '2026-06-22T08:00:00+08:00',
      pickupUntil: '2026-06-22T12:00:00+08:00',
    }
    expect(isCompatible(late, trip, context).reasons).toContain(
      'Departure is outside the compatible pickup window.',
    )
  })

  it('rejects an incompatible route direction', () => {
    const southbound = {
      ...shipment,
      origin: 'Ipoh',
      destination: 'Kuala Lumpur',
    }
    expect(isCompatible(southbound, trip, context).reasons).toContain(
      'Shipment route is incompatible with the trip direction.',
    )
  })
})

describe('matching scoring and ranking', () => {
  const exactTrip: ReturnTrip = {
    ...trip,
    id: 'trip-exact',
    origin: shipment.origin,
    destination: shipment.destination,
    waypoints: [],
  }

  it('scores an exact route above a corridor route', () => {
    const exact = calculateMatchScore(shipment, exactTrip, context)
    const corridor = calculateMatchScore(shipment, trip, context)
    expect(exact.routeFit).toBeGreaterThan(corridor.routeFit)
    expect(exact.detourPenalty).toBeLessThan(corridor.detourPenalty)
  })

  it('scores compatible timing above tolerated edge timing', () => {
    const edgeTrip = { ...trip, departureAt: '2026-06-21T14:00:00+08:00' }
    expect(
      calculateMatchScore(shipment, trip, context).timeFit,
    ).toBeGreaterThan(calculateMatchScore(shipment, edgeTrip, context).timeFit)
  })

  it('scores a more reliable carrier higher when other factors are equal', () => {
    const lessReliable: Carrier = {
      ...context.carriers[0],
      id: 'carrier-less-reliable',
      rating: 3.5,
      completedJobs: 10,
    }
    const lessReliableTrip = {
      ...exactTrip,
      id: 'trip-less-reliable',
      carrierId: lessReliable.id,
    }
    const lessReliableVehicle: Vehicle = {
      ...context.vehicles[0],
      id: 'vehicle-less-reliable',
      carrierId: lessReliable.id,
    }
    lessReliableTrip.vehicleId = lessReliableVehicle.id
    const lowerContext = {
      carriers: [...context.carriers, lessReliable],
      vehicles: [...context.vehicles, lessReliableVehicle],
    }
    expect(
      calculateMatchScore(shipment, exactTrip, context).reliability,
    ).toBeGreaterThan(
      calculateMatchScore(shipment, lessReliableTrip, lowerContext).reliability,
    )
  })

  it('sorts deterministically by score and detour', () => {
    const first = findMatchesForShipment(
      shipment,
      [trip, exactTrip],
      context,
    ).map((match) => match.id)
    const second = findMatchesForShipment(
      shipment,
      [trip, exactTrip],
      context,
    ).map((match) => match.id)
    expect(first).toEqual(second)
    expect(first[0]).toBe(`match:${exactTrip.id}:${shipment.id}`)
  })
})

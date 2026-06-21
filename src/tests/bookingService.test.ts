import { beforeEach, describe, expect, it } from 'vitest'
import { LocalBalikLoadRepository } from '../repositories/LocalBalikLoadRepository'
import { acceptMatch } from '../services/bookingService'
import { findMatchesForShipment } from '../services/matchingService'

let repository: LocalBalikLoadRepository

beforeEach(async () => {
  window.localStorage.clear()
  repository = new LocalBalikLoadRepository(window.localStorage)
  await repository.initialize()
})

async function seedMatches() {
  const state = await repository.getState()
  const shipment = state.shipments[0]
  const matches = findMatchesForShipment(shipment, state.trips, {
    carriers: state.carriers,
    vehicles: state.vehicles,
  })
  await repository.transaction((current) => ({ ...current, matches }))
  return matches
}

describe('booking transaction', () => {
  it('books the shipment and reduces capacity once', async () => {
    const matches = await seedMatches()
    const before = await repository.getState()
    const tripBefore = before.trips.find(
      (trip) => trip.id === matches[0].tripId,
    )!
    const shipment = before.shipments[0]
    await acceptMatch(repository, matches[0].id)
    await acceptMatch(repository, matches[0].id)
    const after = await repository.getState()
    const tripAfter = after.trips.find((trip) => trip.id === matches[0].tripId)!
    expect(after.shipments[0].status).toBe('booked')
    expect(tripAfter.availableWeightKg).toBe(
      tripBefore.availableWeightKg - shipment.weightKg,
    )
    expect(tripAfter.availablePallets).toBe(
      tripBefore.availablePallets - shipment.pallets,
    )
    expect(tripAfter.status).toBe('partially_booked')
    expect(
      after.matches.find((match) => match.id === matches[0].id)?.status,
    ).toBe('accepted')
  })

  it('rejects competing suggested matches', async () => {
    const matches = await seedMatches()
    if (matches.length < 2) {
      const first = matches[0]
      await repository.saveMatch({
        ...first,
        id: 'competing-match',
        tripId: 'trip-kl-ipoh',
      })
    }
    await acceptMatch(repository, matches[0].id)
    const state = await repository.getState()
    expect(
      state.matches
        .filter((match) => match.shipmentId === state.shipments[0].id)
        .filter((match) => match.id !== matches[0].id)
        .every((match) => match.status === 'rejected'),
    ).toBe(true)
  })

  it('marks a trip full when capacity is exhausted', async () => {
    const state = await repository.getState()
    const shipment = state.shipments[0]
    await repository.saveTrip({
      ...state.trips[0],
      availableWeightKg: shipment.weightKg,
      availablePallets: shipment.pallets,
    })
    const matches = await seedMatches()
    await acceptMatch(repository, matches[0].id)
    const after = await repository.getState()
    expect(
      after.trips.find((trip) => trip.id === matches[0].tripId)?.status,
    ).toBe('full')
  })

  it('prevents booking an already-booked shipment through another match', async () => {
    const matches = await seedMatches()
    await acceptMatch(repository, matches[0].id)
    const state = await repository.getState()
    const alternative = {
      ...matches[0],
      id: 'late-alternative',
      status: 'suggested' as const,
    }
    await repository.saveMatch(alternative)
    await expect(acceptMatch(repository, alternative.id)).rejects.toThrow(
      'Shipment is already booked.',
    )
    expect(state.trips.every((trip) => trip.availableWeightKg >= 0)).toBe(true)
  })
})

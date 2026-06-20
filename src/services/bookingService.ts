import type { AppState, Match } from '../models'
import type { BalikLoadRepository } from '../repositories/BalikLoadRepository'

export async function acceptMatch(
  repository: BalikLoadRepository,
  matchId: string,
): Promise<Match> {
  let accepted: Match | undefined
  await repository.transaction((state) => {
    const match = state.matches.find((item) => item.id === matchId)
    if (!match) throw new Error('Match could not be found.')
    if (match.status === 'accepted') {
      accepted = match
      return state
    }
    const shipment = state.shipments.find(
      (item) => item.id === match.shipmentId,
    )
    const trip = state.trips.find((item) => item.id === match.tripId)
    if (!shipment || !trip) throw new Error('Booking data is incomplete.')
    if (shipment.status !== 'open')
      throw new Error('Shipment is already booked.')
    if (!['available', 'partially_booked'].includes(trip.status)) {
      throw new Error('Trip is no longer bookable.')
    }
    if (
      trip.availableWeightKg < shipment.weightKg ||
      trip.availablePallets < shipment.pallets
    ) {
      throw new Error('Trip no longer has enough remaining capacity.')
    }
    const remainingWeight = trip.availableWeightKg - shipment.weightKg
    const remainingPallets = trip.availablePallets - shipment.pallets
    if (remainingWeight < 0 || remainingPallets < 0) {
      throw new Error('Booking would produce negative capacity.')
    }
    const acceptedMatch: Match = { ...match, status: 'accepted' }
    accepted = acceptedMatch
    return {
      ...state,
      shipments: state.shipments.map((item) =>
        item.id === shipment.id ? { ...item, status: 'booked' } : item,
      ),
      trips: state.trips.map((item) =>
        item.id === trip.id
          ? {
              ...item,
              availableWeightKg: remainingWeight,
              availablePallets: remainingPallets,
              status:
                remainingWeight === 0 || remainingPallets === 0
                  ? 'full'
                  : 'partially_booked',
            }
          : item,
      ),
      matches: rejectCompetingMatches(state, acceptedMatch),
    }
  })
  if (!accepted) throw new Error('Match could not be accepted.')
  return accepted
}

function rejectCompetingMatches(state: AppState, accepted: Match): Match[] {
  return state.matches.map((match) => {
    if (match.id === accepted.id) return accepted
    if (
      match.shipmentId === accepted.shipmentId &&
      match.status === 'suggested'
    ) {
      return { ...match, status: 'rejected' }
    }
    return match
  })
}

import {
  MAX_DETOUR_KM,
  MATCHING_WEIGHTS,
  TIME_TOLERANCE_HOURS,
} from '../config/matchingWeights'
import { getRouteDistanceKm, isAlongTripCorridor } from '../config/routes'
import type {
  CompatibilityResult,
  Match,
  MatchScoreBreakdown,
  MatchingContext,
  ReturnTrip,
  Shipment,
} from '../models'
import { estimateCO2SavedKg } from './impactService'
import { SUPPORTED_CARGO_TYPES } from './validationService'

const HOUR_MS = 60 * 60 * 1000

export function isCompatible(
  shipment: Shipment,
  trip: ReturnTrip,
  context: MatchingContext,
): CompatibilityResult {
  const reasons: string[] = []
  const carrier = context.carriers.find((item) => item.id === trip.carrierId)
  const vehicle = context.vehicles.find((item) => item.id === trip.vehicleId)
  if (!['available', 'partially_booked'].includes(trip.status)) {
    reasons.push('Trip is not bookable.')
  }
  if (shipment.status !== 'open') reasons.push('Shipment is not open.')
  if (!carrier?.verified) reasons.push('Carrier is not verified.')
  if (!vehicle) reasons.push('Vehicle is unavailable.')
  if (trip.availableWeightKg < shipment.weightKg) {
    reasons.push('Remaining weight capacity is insufficient.')
  }
  if (trip.availablePallets < shipment.pallets) {
    reasons.push('Remaining pallet capacity is insufficient.')
  }
  if (!trip.acceptedCargoTypes.includes(shipment.cargoType)) {
    reasons.push('Cargo type is not accepted by this trip.')
  }
  if (!SUPPORTED_CARGO_TYPES.includes(shipment.cargoType as never)) {
    reasons.push('Cargo is outside the supported MVP scope.')
  }
  if (shipment.cargoType.toLowerCase().includes('hazard')) {
    reasons.push('Hazardous cargo is not supported.')
  }
  if (shipment.requiresRefrigeration && !vehicle?.refrigerated) {
    reasons.push('Vehicle does not satisfy refrigeration requirements.')
  }
  if (!isTimeCompatible(shipment, trip)) {
    reasons.push('Departure is outside the compatible pickup window.')
  }
  if (
    !isAlongTripCorridor(
      trip.origin,
      trip.destination,
      shipment.origin,
      shipment.destination,
    )
  ) {
    reasons.push('Shipment route is incompatible with the trip direction.')
  }
  return { compatible: reasons.length === 0, reasons }
}

export function findMatchesForShipment(
  shipment: Shipment,
  trips: ReturnTrip[],
  context: MatchingContext,
): Match[] {
  return trips
    .filter((trip) => isCompatible(shipment, trip, context).compatible)
    .map((trip) => createMatch(shipment, trip, context))
    .sort((left, right) => {
      if (right.score !== left.score) return right.score - left.score
      if (left.estimatedDetourKm !== right.estimatedDetourKm) {
        return left.estimatedDetourKm - right.estimatedDetourKm
      }
      const leftTrip = trips.find((trip) => trip.id === left.tripId)
      const rightTrip = trips.find((trip) => trip.id === right.tripId)
      const departureDifference =
        new Date(leftTrip?.departureAt ?? 0).getTime() -
        new Date(rightTrip?.departureAt ?? 0).getTime()
      if (departureDifference) return departureDifference
      return (
        getReliability(rightTrip, context) - getReliability(leftTrip, context)
      )
    })
}

export function calculateMatchScore(
  shipment: Shipment,
  trip: ReturnTrip,
  context: MatchingContext,
): MatchScoreBreakdown {
  const exactRoute =
    shipment.origin === trip.origin && shipment.destination === trip.destination
  const detourKm = estimateDetourKm(shipment, trip)
  const weightUse = shipment.weightKg / trip.availableWeightKg
  const palletUse = shipment.pallets / trip.availablePallets
  const departure = new Date(trip.departureAt).getTime()
  const from = new Date(shipment.pickupFrom).getTime()
  const until = new Date(shipment.pickupUntil).getTime()
  const distance =
    getRouteDistanceKm(shipment.origin, shipment.destination) ?? 0
  const estimatedPrice = (distance + detourKm) * trip.pricePerKm
  return {
    routeFit: exactRoute ? 100 : 85,
    capacityFit: clamp(((weightUse + palletUse) / 2) * 100),
    timeFit: departure >= from && departure <= until ? 100 : 70,
    cargoFit: 100,
    vehicleFit: 100,
    reliability: getReliability(trip, context),
    profitability:
      estimatedPrice <= shipment.budget
        ? 100
        : clamp((shipment.budget / estimatedPrice) * 100),
    detourPenalty: detourKm <= 5 ? 0 : detourKm <= 15 ? 8 : 16,
  }
}

function createMatch(
  shipment: Shipment,
  trip: ReturnTrip,
  context: MatchingContext,
): Match {
  const breakdown = calculateMatchScore(shipment, trip, context)
  const detourKm = estimateDetourKm(shipment, trip)
  const distance =
    getRouteDistanceKm(shipment.origin, shipment.destination) ?? 0
  const score = clamp(
    breakdown.routeFit * MATCHING_WEIGHTS.routeFit +
      breakdown.capacityFit * MATCHING_WEIGHTS.capacityFit +
      breakdown.timeFit * MATCHING_WEIGHTS.timeFit +
      breakdown.cargoFit * MATCHING_WEIGHTS.cargoFit +
      breakdown.vehicleFit * MATCHING_WEIGHTS.vehicleFit +
      breakdown.reliability * MATCHING_WEIGHTS.reliability +
      breakdown.profitability * MATCHING_WEIGHTS.profitability -
      breakdown.detourPenalty,
  )
  const reasons = buildReasons(shipment, trip, context, detourKm, breakdown)
  return {
    id: `match:${trip.id}:${shipment.id}`,
    tripId: trip.id,
    shipmentId: shipment.id,
    score: Math.round(score * 10) / 10,
    breakdown,
    estimatedDetourKm: detourKm,
    estimatedPrice: Math.round((distance + detourKm) * trip.pricePerKm),
    estimatedCO2SavedKg: estimateCO2SavedKg(distance),
    reasons,
    status: 'suggested',
    createdAt: trip.departureAt,
  }
}

function buildReasons(
  shipment: Shipment,
  trip: ReturnTrip,
  context: MatchingContext,
  detourKm: number,
  breakdown: MatchScoreBreakdown,
): string[] {
  const vehicle = context.vehicles.find((item) => item.id === trip.vehicleId)
  const reasons = [
    shipment.origin === trip.origin && shipment.destination === trip.destination
      ? 'Exact route match'
      : 'Pickup and delivery fall along the existing corridor',
    'Departure is compatible with the requested pickup window',
    `Uses ${Math.round((shipment.weightKg / trip.availableWeightKg) * 100)}% of remaining weight capacity`,
    `Estimated detour is ${detourKm} km`,
    'Verified carrier with a strong reliability history',
  ]
  if (shipment.requiresRefrigeration && vehicle?.refrigerated) {
    reasons.push('Refrigerated vehicle requirement satisfied')
  }
  if (breakdown.profitability === 100) {
    reasons.push('Estimated price is within the shipper budget')
  }
  return reasons
}

function isTimeCompatible(shipment: Shipment, trip: ReturnTrip): boolean {
  const departure = new Date(trip.departureAt).getTime()
  const from = new Date(shipment.pickupFrom).getTime()
  const until = new Date(shipment.pickupUntil).getTime()
  const tolerance = TIME_TOLERANCE_HOURS * HOUR_MS
  return departure >= from - tolerance && departure <= until + tolerance
}

function estimateDetourKm(shipment: Shipment, trip: ReturnTrip): number {
  if (
    shipment.origin === trip.origin &&
    shipment.destination === trip.destination
  ) {
    return 0
  }
  const changedEndpoints =
    Number(shipment.origin !== trip.origin) +
    Number(shipment.destination !== trip.destination)
  return Math.min(MAX_DETOUR_KM, changedEndpoints * 6)
}

function getReliability(
  trip: ReturnTrip | undefined,
  context: MatchingContext,
): number {
  const carrier = context.carriers.find((item) => item.id === trip?.carrierId)
  if (!carrier) return 0
  return clamp(
    (carrier.rating / 5) * 80 + Math.min(carrier.completedJobs, 100) / 5,
  )
}

function clamp(value: number): number {
  return Math.max(0, Math.min(100, value))
}

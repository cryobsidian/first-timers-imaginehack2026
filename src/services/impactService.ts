import { IMPACT_CONFIG } from '../config/impactConfig'

export function estimateCO2SavedKg(avoidedDistanceKm: number): number {
  return round(avoidedDistanceKm * IMPACT_CONFIG.emissionFactorKgPerKm)
}

export function calculateCapacityUtilisation(
  usedWeightKg: number,
  availableWeightKg: number,
): number {
  if (availableWeightKg <= 0) return 0
  return round((usedWeightKg / availableWeightKg) * 100)
}

function round(value: number): number {
  return Math.round(value * 10) / 10
}

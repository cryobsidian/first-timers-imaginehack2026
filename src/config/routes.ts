const LOCATION_POSITION_KM: Record<string, number> = {
  Klang: 0,
  'Shah Alam': 18,
  'Petaling Jaya': 35,
  'Kuala Lumpur': 50,
  Rawang: 85,
  Ipoh: 215,
  Butterworth: 340,
  Penang: 355,
}

export const LOCATIONS = Object.keys(LOCATION_POSITION_KM)

export function getLocationPosition(location: string): number | undefined {
  return LOCATION_POSITION_KM[location]
}

export function getRouteDistanceKm(
  origin: string,
  destination: string,
): number | undefined {
  const start = getLocationPosition(origin)
  const end = getLocationPosition(destination)
  if (start === undefined || end === undefined || end <= start) return undefined
  return end - start
}

export function isAlongTripCorridor(
  tripOrigin: string,
  tripDestination: string,
  shipmentOrigin: string,
  shipmentDestination: string,
): boolean {
  const tripStart = getLocationPosition(tripOrigin)
  const tripEnd = getLocationPosition(tripDestination)
  const shipmentStart = getLocationPosition(shipmentOrigin)
  const shipmentEnd = getLocationPosition(shipmentDestination)
  if (
    tripStart === undefined ||
    tripEnd === undefined ||
    shipmentStart === undefined ||
    shipmentEnd === undefined
  ) {
    return false
  }
  return (
    tripStart < tripEnd &&
    shipmentStart < shipmentEnd &&
    shipmentStart >= tripStart &&
    shipmentEnd <= tripEnd
  )
}

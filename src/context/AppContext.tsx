import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import type {
  AppState,
  CreateReturnTripInput,
  CreateShipmentInput,
  Match,
} from '../models'
import { LocalBalikLoadRepository } from '../repositories/LocalBalikLoadRepository'
import { acceptMatch as acceptPersistedMatch } from '../services/bookingService'
import { findMatchesForShipment } from '../services/matchingService'
import {
  validateReturnTrip,
  validateShipment,
} from '../services/validationService'

interface AppContextValue {
  state: AppState | null
  loading: boolean
  error: string | null
  createTrip(input: CreateReturnTripInput): Promise<void>
  createShipment(input: CreateShipmentInput): Promise<void>
  generateMatches(shipmentId: string): Promise<Match[]>
  acceptMatch(matchId: string): Promise<Match>
  resetDemoData(): Promise<void>
}

const AppContext = createContext<AppContextValue | null>(null)

export function AppProvider({ children }: { children: ReactNode }) {
  const [repository] = useState(() => new LocalBalikLoadRepository())
  const [state, setState] = useState<AppState | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const refresh = useCallback(async () => {
    setState(await repository.getState())
  }, [repository])

  useEffect(() => {
    void repository
      .initialize()
      .then(refresh)
      .catch((cause: unknown) =>
        setError(
          cause instanceof Error ? cause.message : 'Initialization failed.',
        ),
      )
      .finally(() => setLoading(false))
  }, [refresh, repository])

  const createTrip = useCallback(
    async (input: CreateReturnTripInput) => {
      const current = await repository.getState()
      validateReturnTrip(input, current)
      await repository.createReturnTrip(input)
      await refresh()
    },
    [refresh, repository],
  )

  const createShipment = useCallback(
    async (input: CreateShipmentInput) => {
      validateShipment(input)
      await repository.createShipment(input)
      await refresh()
    },
    [refresh, repository],
  )

  const generateMatches = useCallback(
    async (shipmentId: string) => {
      const current = await repository.getState()
      const shipment = current.shipments.find((item) => item.id === shipmentId)
      if (!shipment) throw new Error('Shipment could not be found.')
      const matches = findMatchesForShipment(shipment, current.trips, {
        carriers: current.carriers,
        vehicles: current.vehicles,
      })
      await repository.transaction((latest) => ({
        ...latest,
        matches: [
          ...latest.matches.filter(
            (match) =>
              match.shipmentId !== shipmentId || match.status !== 'suggested',
          ),
          ...matches,
        ],
      }))
      await refresh()
      return matches
    },
    [refresh, repository],
  )

  const acceptMatch = useCallback(
    async (matchId: string) => {
      const match = await acceptPersistedMatch(repository, matchId)
      await refresh()
      return match
    },
    [refresh, repository],
  )

  const resetDemoData = useCallback(async () => {
    await repository.resetDemoData()
    await refresh()
  }, [refresh, repository])

  const value = useMemo(
    () => ({
      state,
      loading,
      error,
      createTrip,
      createShipment,
      generateMatches,
      acceptMatch,
      resetDemoData,
    }),
    [
      acceptMatch,
      createShipment,
      createTrip,
      error,
      generateMatches,
      loading,
      resetDemoData,
      state,
    ],
  )

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export function useApp(): AppContextValue {
  const context = useContext(AppContext)
  if (!context) throw new Error('useApp must be used within AppProvider.')
  return context
}

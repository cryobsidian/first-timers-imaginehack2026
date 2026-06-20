import { describe, expect, it } from 'vitest'
import { SCHEMA_VERSION, STORAGE_KEY } from '../config/storage'
import { LocalBalikLoadRepository } from '../repositories/LocalBalikLoadRepository'

class MemoryStorage implements Storage {
  private data = new Map<string, string>()
  get length() {
    return this.data.size
  }
  clear() {
    this.data.clear()
  }
  getItem(key: string) {
    return this.data.get(key) ?? null
  }
  key(index: number) {
    return [...this.data.keys()][index] ?? null
  }
  removeItem(key: string) {
    this.data.delete(key)
  }
  setItem(key: string, value: string) {
    this.data.set(key, value)
  }
}

describe('LocalBalikLoadRepository', () => {
  it('persists state across repository instances', async () => {
    const storage = new MemoryStorage()
    const first = new LocalBalikLoadRepository(storage)
    await first.initialize()
    const shipment = (await first.getShipments())[0]
    await first.saveShipment({ ...shipment, shipperName: 'Persisted SME' })
    const second = new LocalBalikLoadRepository(storage)
    expect((await second.getShipments())[0].shipperName).toBe('Persisted SME')
  })

  it('safely resets an incompatible schema', async () => {
    const storage = new MemoryStorage()
    storage.setItem(STORAGE_KEY, JSON.stringify({ schemaVersion: 999 }))
    const repository = new LocalBalikLoadRepository(storage)
    await repository.initialize()
    const state = await repository.getState()
    expect(state.schemaVersion).toBe(SCHEMA_VERSION)
    expect(state.trips.length).toBeGreaterThan(0)
  })

  it('restores original seed data', async () => {
    const storage = new MemoryStorage()
    const repository = new LocalBalikLoadRepository(storage)
    await repository.initialize()
    const shipment = (await repository.getShipments())[0]
    await repository.saveShipment({ ...shipment, shipperName: 'Changed' })
    await repository.resetDemoData()
    expect((await repository.getShipments())[0].shipperName).toBe(
      'Kita Foods SME',
    )
  })
})

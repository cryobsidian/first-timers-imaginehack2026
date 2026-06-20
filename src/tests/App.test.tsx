import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { App } from '../App'

describe('BalikLoad golden UI flow', () => {
  it('matches, books, and resets the seeded shipment', async () => {
    const user = userEvent.setup()
    render(<App />)
    expect(await screen.findByText('Marketplace overview')).toBeInTheDocument()
    await user.click(
      screen.getByRole('link', { name: 'Find compatible trips' }),
    )
    expect(
      await screen.findByRole('heading', { name: 'Ranked return trips' }),
    ).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Accept this match' }))
    expect(
      await screen.findByRole('heading', { name: 'Booking confirmed' }),
    ).toBeInTheDocument()
    await user.click(screen.getByRole('link', { name: 'Return to dashboard' }))
    expect(
      await screen.findByText('Shipment successfully booked'),
    ).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Reset Demo Data' }))
    await waitFor(() =>
      expect(
        screen.getByRole('link', { name: 'Find compatible trips' }),
      ).toBeInTheDocument(),
    )
  })

  it('creates a shipment through the preserved form flow', async () => {
    const user = userEvent.setup()
    render(<App />)
    await screen.findByText('Marketplace overview')
    await user.click(screen.getByRole('link', { name: 'Request shipment' }))
    const name = await screen.findByLabelText('Business name')
    await user.clear(name)
    await user.type(name, 'New Demo SME')
    await user.click(
      screen.getByRole('button', { name: 'Create shipment request' }),
    )
    expect(await screen.findByText('New Demo SME')).toBeInTheDocument()
  })

  it('creates a carrier return trip through the preserved form flow', async () => {
    const user = userEvent.setup()
    render(<App />)
    await screen.findByText('Marketplace overview')
    await user.click(screen.getByRole('link', { name: 'Post return trip' }))
    expect(
      await screen.findByRole('heading', {
        name: 'Publish spare return capacity',
      }),
    ).toBeInTheDocument()
    await user.click(
      screen.getByRole('button', { name: 'Publish return trip' }),
    )
    expect(await screen.findByText('Marketplace overview')).toBeInTheDocument()
    expect(screen.getAllByText('Klang to Penang').length).toBeGreaterThan(1)
  })
})

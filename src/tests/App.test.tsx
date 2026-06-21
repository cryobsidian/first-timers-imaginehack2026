import { render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { App } from '../App'

describe('CargoLink role navigation', () => {
  it('shows an isolated main menu with both demo roles', async () => {
    render(<App />)

    expect(
      await screen.findByRole('heading', {
        name: 'Choose your CargoLink workspace.',
      }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('link', { name: /Log in as Carrier/ }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('link', { name: /Log in as SME/ }),
    ).toBeInTheDocument()
    expect(screen.queryByText('Your return trips')).not.toBeInTheDocument()
    expect(screen.queryByText('Your shipment requests')).not.toBeInTheDocument()
  })

  it('opens the carrier dashboard and returns home', async () => {
    const user = userEvent.setup()
    render(<App />)

    await user.click(
      await screen.findByRole('link', { name: /Log in as Carrier/ }),
    )
    expect(
      await screen.findByRole('heading', { name: 'Return-trip dashboard' }),
    ).toBeInTheDocument()
    expect(screen.getByText('Your return trips')).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: 'Reset Demo Data' }),
    ).toBeInTheDocument()

    await user.click(screen.getByRole('link', { name: 'Home' }))
    expect(
      await screen.findByRole('heading', {
        name: 'Choose your CargoLink workspace.',
      }),
    ).toBeInTheDocument()
  })

  it('creates a return trip and returns to the carrier dashboard', async () => {
    const user = userEvent.setup()
    render(<App />)

    await user.click(
      await screen.findByRole('link', { name: /Log in as Carrier/ }),
    )
    await user.click(screen.getByRole('link', { name: 'Post Return Trip' }))
    expect(
      await screen.findByRole('heading', {
        name: 'Publish spare return capacity',
      }),
    ).toBeInTheDocument()

    await user.click(
      screen.getByRole('button', { name: 'Publish return trip' }),
    )
    expect(
      await screen.findByRole('heading', { name: 'Return-trip dashboard' }),
    ).toBeInTheDocument()
    expect(screen.getAllByText('Klang to Penang').length).toBeGreaterThan(1)
  })

  it('runs the SME match, booking, return, and reset flow', async () => {
    const user = userEvent.setup()
    render(<App />)

    await user.click(await screen.findByRole('link', { name: /Log in as SME/ }))
    expect(
      await screen.findByRole('heading', { name: 'Shipment dashboard' }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: 'Reset Demo Data' }),
    ).toBeInTheDocument()

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
    await user.click(
      screen.getByRole('link', { name: 'Return to SME dashboard' }),
    )
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

  it('creates a shipment and returns to the SME dashboard', async () => {
    const user = userEvent.setup()
    render(<App />)

    await user.click(await screen.findByRole('link', { name: /Log in as SME/ }))
    await user.click(screen.getByRole('link', { name: 'Request Shipment' }))
    const name = await screen.findByLabelText('Business name')
    await user.clear(name)
    await user.type(name, 'New Demo SME')
    await user.click(
      screen.getByRole('button', { name: 'Create shipment request' }),
    )

    expect(
      await screen.findByRole('heading', { name: 'Shipment dashboard' }),
    ).toBeInTheDocument()
    expect(screen.getByText('New Demo SME')).toBeInTheDocument()
  })

  it('redirects unknown routes to the main menu', async () => {
    window.location.hash = '#/not-a-real-page'
    render(<App />)

    expect(
      await screen.findByRole('heading', {
        name: 'Choose your CargoLink workspace.',
      }),
    ).toBeInTheDocument()
  })

  it('backs out of both role forms without creating records', async () => {
    const user = userEvent.setup()
    render(<App />)

    await user.click(
      await screen.findByRole('link', { name: /Log in as Carrier/ }),
    )
    const carrierList = await screen.findByRole('region', {
      name: 'Carrier return trips',
    })
    const tripCount = within(carrierList).getAllByRole('article').length
    await user.click(screen.getByRole('link', { name: 'Post Return Trip' }))
    await user.click(
      await screen.findByRole('link', {
        name: 'Back to Carrier Dashboard',
      }),
    )
    expect(
      within(
        await screen.findByRole('region', { name: 'Carrier return trips' }),
      ).getAllByRole('article'),
    ).toHaveLength(tripCount)

    await user.click(screen.getByRole('link', { name: 'Home' }))
    await user.click(await screen.findByRole('link', { name: /Log in as SME/ }))
    const shipmentList = await screen.findByRole('region', {
      name: 'SME shipments',
    })
    const shipmentCount = within(shipmentList).getAllByRole('article').length
    await user.click(screen.getByRole('link', { name: 'Request Shipment' }))
    await user.click(
      await screen.findByRole('link', { name: 'Back to SME Dashboard' }),
    )
    expect(
      within(
        await screen.findByRole('region', { name: 'SME shipments' }),
      ).getAllByRole('article'),
    ).toHaveLength(shipmentCount)
  })
})

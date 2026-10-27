import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import App from '@/app/App'

describe('App & AppShell Integration', () => {
  it('renders AppShell navbar with logo and primary navigation', async () => {
    window.history.pushState({}, '', '/')
    render(<App />)

    expect(
      await screen.findByRole('heading', { name: /home/i })
    ).toBeInTheDocument()
    expect(screen.getByLabelText(/ourtube home/i)).toBeInTheDocument()
    expect(
      screen.getByRole('navigation', { name: /primary navigation/i })
    ).toBeInTheDocument()
    expect(
      screen.getByRole('navigation', { name: /mobile bottom navigation/i })
    ).toBeInTheDocument()
  })

  it('navigates to Explore and renders the Explore page', async () => {
    window.history.pushState({}, '', '/explore')
    render(<App />)
    expect(
      await screen.findByRole('heading', { name: /trending/i })
    ).toBeInTheDocument()
  })

  it('navigates to Subscriptions and renders Subscriptions placeholder', async () => {
    window.history.pushState({}, '', '/subscriptions')
    render(<App />)
    expect(
      await screen.findByRole('heading', { name: /subscriptions/i })
    ).toBeInTheDocument()
  })

  it('toggles theme via Navbar dropdown', async () => {
    window.history.pushState({}, '', '/')
    render(<App />)

    expect(
      await screen.findByRole('heading', { name: /home/i })
    ).toBeInTheDocument()

    const themeBtn = screen.getByLabelText(/current theme/i)
    fireEvent.click(themeBtn)

    const darkOption = await screen.findByRole('menuitem', { name: /dark/i })
    fireEvent.click(darkOption)

    expect(document.documentElement.getAttribute('data-theme')).toBe('dark')
    expect(document.documentElement.classList.contains('dark')).toBe(true)
  })
})

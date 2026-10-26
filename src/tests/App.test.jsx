import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import App from '@/app/App'

describe('App Routing', () => {
  it('renders Home page placeholder at root path', async () => {
    window.history.pushState({}, '', '/')
    render(<App />)
    expect(
      await screen.findByRole('heading', { name: /home/i })
    ).toBeInTheDocument()
  })

  it('renders Explore page placeholder at /explore', async () => {
    window.history.pushState({}, '', '/explore')
    render(<App />)
    expect(
      await screen.findByRole('heading', { name: /explore/i })
    ).toBeInTheDocument()
  })

  it('renders Watch page placeholder at /watch/123', async () => {
    window.history.pushState({}, '', '/watch/123')
    render(<App />)
    expect(
      await screen.findByRole('heading', { name: /watch/i })
    ).toBeInTheDocument()
  })

  it('renders 404 Not Found at non-existent route', async () => {
    window.history.pushState({}, '', '/non-existent-route-path')
    render(<App />)
    expect(
      await screen.findByRole('heading', { name: /404 not found/i })
    ).toBeInTheDocument()
  })
})

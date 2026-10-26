import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { MemoryRouter } from 'react-router-dom'
import Home from '@/pages/Home'
import { ToastProvider } from '@/components/common'

describe('Home Page', () => {
  it('loads and displays category chips and video feed', async () => {
    render(
      <MemoryRouter>
        <ToastProvider>
          <Home />
        </ToastProvider>
      </MemoryRouter>
    )

    // Check that categories chip "All" is rendered
    expect(await screen.findByRole('tab', { name: /all/i })).toBeInTheDocument()

    // Wait for video items to load from mock API
    const videoTitle = await screen.findByText(/building modern web apps/i)
    expect(videoTitle).toBeInTheDocument()
  })

  it('filters feed when selecting a category chip', async () => {
    render(
      <MemoryRouter>
        <ToastProvider>
          <Home />
        </ToastProvider>
      </MemoryRouter>
    )

    const gamingChip = await screen.findByRole('tab', { name: /gaming/i })
    fireEvent.click(gamingChip)

    await waitFor(() => {
      expect(gamingChip).toHaveAttribute('aria-selected', 'true')
    })

    const eldenRingVideo = await screen.findByText(/elden ring/i)
    expect(eldenRingVideo).toBeInTheDocument()
  })
})

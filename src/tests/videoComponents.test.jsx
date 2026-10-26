import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { MemoryRouter } from 'react-router-dom'
import {
  CategoryChips,
  VideoCard,
  VideoCardSkeleton,
  VideoGrid,
} from '@/components/video'
import { ToastProvider } from '@/components/common'
import { useHistoryStore } from '@/store'

const mockVideo = {
  id: 'vid-1',
  title: 'Test React 19 Tutorial',
  description: 'Awesome tutorial',
  thumbnail: 'https://example.com/thumb.jpg',
  duration: 630, // 10:30
  views: 125000, // 125K
  publishedAt: new Date(Date.now() - 3600 * 1000 * 24).toISOString(), // 1 day ago
  category: 'Technology',
  channelId: 'ch-1',
}

describe('Video Components', () => {
  describe('CategoryChips', () => {
    it('renders category chips and handles selection', () => {
      const handleSelect = vi.fn()
      render(
        <CategoryChips
          categories={['All', 'Technology', 'Gaming']}
          selectedCategory="Technology"
          onSelectCategory={handleSelect}
        />
      )

      const techChip = screen.getByRole('tab', { name: /technology/i })
      expect(techChip).toHaveAttribute('aria-selected', 'true')

      const gamingChip = screen.getByRole('tab', { name: /gaming/i })
      fireEvent.click(gamingChip)
      expect(handleSelect).toHaveBeenCalledWith('Gaming')
    })
  })

  describe('VideoCard', () => {
    it('renders video details correctly', () => {
      render(
        <MemoryRouter>
          <ToastProvider>
            <VideoCard video={mockVideo} />
          </ToastProvider>
        </MemoryRouter>
      )

      expect(screen.getByText('Test React 19 Tutorial')).toBeInTheDocument()
      expect(screen.getByText('10:30')).toBeInTheDocument()
      expect(screen.getByText(/125K views/i)).toBeInTheDocument()
    })

    it('renders watch progress bar when partially watched', () => {
      useHistoryStore.setState({
        entries: [
          {
            videoId: 'vid-1',
            progressSeconds: 315,
            durationSeconds: 630,
            watchedAt: new Date().toISOString(),
          },
        ],
      })

      render(
        <MemoryRouter>
          <ToastProvider>
            <VideoCard video={mockVideo} />
          </ToastProvider>
        </MemoryRouter>
      )

      expect(screen.getByLabelText(/50% watched/i)).toBeInTheDocument()
    })
  })

  describe('VideoCardSkeleton', () => {
    it('renders skeleton container with aria-hidden', () => {
      const { container } = render(<VideoCardSkeleton />)
      expect(container.firstChild).toHaveAttribute('aria-hidden', 'true')
    })
  })

  describe('VideoGrid', () => {
    it('renders skeletons when loading is true', () => {
      const { container } = render(
        <VideoGrid loading={true} skeletonCount={6} />
      )
      const skeletons = container.querySelectorAll('[aria-hidden="true"]')
      expect(skeletons.length).toBeGreaterThanOrEqual(6)
    })

    it('renders video cards when videos are provided', () => {
      render(
        <MemoryRouter>
          <ToastProvider>
            <VideoGrid videos={[mockVideo]} />
          </ToastProvider>
        </MemoryRouter>
      )

      expect(screen.getByText('Test React 19 Tutorial')).toBeInTheDocument()
    })
  })
})

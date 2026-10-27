import { render, screen, act } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import PropTypes from 'prop-types'
import { useInfiniteScroll } from '@/hooks/useInfiniteScroll'

describe('useInfiniteScroll hook', () => {
  let mockIntersectionCallback

  beforeEach(() => {
    window.IntersectionObserver = class {
      constructor(callback) {
        mockIntersectionCallback = callback
      }
      observe = vi.fn()
      disconnect = vi.fn()
      unobserve = vi.fn()
    }
  })

  function TestList({ fetchFn, dependencies = [] }) {
    const { items, hasMore, isLoading, error, retry, sentinelRef } =
      useInfiniteScroll({
        fetchFn,
        dependencies,
      })

    return (
      <div>
        {isLoading && <span data-testid="loading">Loading...</span>}
        {error && (
          <div>
            <span data-testid="error">{error}</span>
            <button onClick={retry}>Retry</button>
          </div>
        )}
        <ul data-testid="items">
          {items.map((item) => (
            <li key={item.id}>{item.title || item.id}</li>
          ))}
        </ul>
        <span data-testid="has-more">{String(hasMore)}</span>
        <div ref={sentinelRef} data-testid="sentinel" />
      </div>
    )
  }

  TestList.propTypes = {
    fetchFn: PropTypes.func.isRequired,
    dependencies: PropTypes.array,
  }

  it('loads initial page of items on mount', async () => {
    const fetchFn = vi.fn().mockResolvedValue({
      items: [
        { id: '1', title: 'Video 1' },
        { id: '2', title: 'Video 2' },
      ],
      hasMore: true,
      total: 10,
    })

    render(<TestList fetchFn={fetchFn} />)

    expect(screen.getByTestId('loading')).toBeInTheDocument()

    const item1 = await screen.findByText('Video 1')
    expect(item1).toBeInTheDocument()
    expect(screen.getByText('Video 2')).toBeInTheDocument()
    expect(screen.getByTestId('has-more')).toHaveTextContent('true')
  })

  it('loads next page and merges unique items on intersection trigger', async () => {
    const fetchFn = vi.fn().mockImplementation((page) => {
      if (page === 1) {
        return Promise.resolve({
          items: [{ id: '1', title: 'Video 1' }],
          hasMore: true,
        })
      }
      return Promise.resolve({
        items: [
          { id: '1', title: 'Video 1' }, // duplicate to test deduplication
          { id: '2', title: 'Video 2' },
        ],
        hasMore: false,
      })
    })

    render(<TestList fetchFn={fetchFn} />)

    await screen.findByText('Video 1')

    // Trigger intersection
    await act(async () => {
      mockIntersectionCallback([{ isIntersecting: true }])
    })

    await screen.findByText('Video 2')

    // Confirm deduplicated items: exactly one 'Video 1'
    expect(screen.getAllByText('Video 1')).toHaveLength(1)
    expect(screen.getByText('Video 2')).toBeInTheDocument()
    expect(screen.getByTestId('has-more')).toHaveTextContent('false')
  })

  it('resets to page 1 and loads fresh items when dependencies change', async () => {
    const fetchFn = vi.fn().mockImplementation((page) => {
      return Promise.resolve({
        items: [{ id: `item-page-${page}` }],
        hasMore: true,
      })
    })

    const { rerender } = render(
      <TestList fetchFn={fetchFn} dependencies={['Technology']} />
    )

    await screen.findByText('item-page-1')
    expect(fetchFn).toHaveBeenCalledTimes(1)

    // Change dependency to 'Gaming'
    rerender(<TestList fetchFn={fetchFn} dependencies={['Gaming']} />)

    await screen.findByText('item-page-1')
    expect(fetchFn).toHaveBeenCalledTimes(2)
  })

  it('handles error state and retries successfully', async () => {
    let shouldFail = true
    const fetchFn = vi.fn().mockImplementation(() => {
      if (shouldFail) {
        return Promise.reject(new Error('Network failure'))
      }
      return Promise.resolve({
        items: [{ id: 'success-1', title: 'Success Video' }],
        hasMore: false,
      })
    })

    render(<TestList fetchFn={fetchFn} />)

    const errorMsg = await screen.findByTestId('error')
    expect(errorMsg).toHaveTextContent('Network failure')

    // Fix error and retry
    shouldFail = false
    const retryBtn = screen.getByRole('button', { name: /retry/i })
    await act(async () => {
      retryBtn.click()
    })

    const successItem = await screen.findByText('Success Video')
    expect(successItem).toBeInTheDocument()
  })
})

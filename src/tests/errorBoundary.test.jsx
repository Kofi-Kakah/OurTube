import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi, afterEach } from 'vitest'
import ErrorBoundary from '@/components/common/ErrorBoundary'

function ThrowingComponent({ shouldThrow }) {
  if (shouldThrow) {
    throw new Error('Boom!')
  }
  return <div data-testid="recovered">Recovered</div>
}

ThrowingComponent.propTypes = {}

describe('ErrorBoundary', () => {
  const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {})

  afterEach(() => {
    consoleError.mockReset()
  })

  it('renders children normally when no error occurs', () => {
    render(
      <ErrorBoundary>
        <div data-testid="ok">All good</div>
      </ErrorBoundary>
    )
    expect(screen.getByTestId('ok')).toBeInTheDocument()
    expect(screen.queryByText('Something went wrong')).not.toBeInTheDocument()
  })

  it('shows fallback UI when a child throws', () => {
    render(
      <ErrorBoundary>
        <ThrowingComponent shouldThrow={true} />
      </ErrorBoundary>
    )
    expect(screen.getByText('Something went wrong')).toBeInTheDocument()
    expect(screen.getByText('Boom!')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /retry page/i })).toBeInTheDocument()
  })

  it('renders custom fallback when provided', () => {
    const custom = <div data-testid="custom-fallback">Custom error UI</div>
    render(
      <ErrorBoundary fallback={custom}>
        <ThrowingComponent shouldThrow={true} />
      </ErrorBoundary>
    )
    expect(screen.getByTestId('custom-fallback')).toBeInTheDocument()
    expect(screen.queryByText('Something went wrong')).not.toBeInTheDocument()
  })

  it('recovers when retry is clicked after child stops throwing', () => {
    const { rerender } = render(
      <ErrorBoundary>
        <ThrowingComponent shouldThrow={true} />
      </ErrorBoundary>
    )
    expect(screen.getByText('Something went wrong')).toBeInTheDocument()

    // Child no longer throws, but boundary still shows fallback until retry
    rerender(
      <ErrorBoundary>
        <ThrowingComponent shouldThrow={false} />
      </ErrorBoundary>
    )
    expect(screen.getByText('Something went wrong')).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: /retry page/i }))
    expect(screen.queryByText('Something went wrong')).not.toBeInTheDocument()
    expect(screen.getByTestId('recovered')).toBeInTheDocument()
  })
})

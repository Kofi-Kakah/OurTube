import { Component } from 'react'
import PropTypes from 'prop-types'
import { RefreshCw } from 'lucide-react'
import { Button } from '@/components/common'

/**
 * ErrorBoundary — catches rendering errors in its subtree and displays a
 * friendly error UI with a "Retry" button that remounts the children.
 * Keeps the rest of the app functional when a single route/page throws.
 */
export class ErrorBoundary extends Component {
  state = {
    hasError: false,
    error: null,
    errorInfo: null,
  }

  static getDerivedStateFromError(error) {
    return {
      hasError: true,
      error,
      errorInfo: null,
    }
  }

  componentDidCatch(_error, errorInfo) {
    this.setState({ errorInfo: errorInfo.componentStack ?? null })
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    })
    this.props.onReset?.()
  }

  render() {
    const { children, fallback } = this.props
    const { hasError, error } = this.state

    if (hasError) {
      if (fallback) return fallback
      return (
        <div
          className="flex flex-col items-center justify-center py-20 text-center"
          role="alert"
          aria-live="polite"
        >
          <RefreshCw className="w-10 h-10 text-[var(--text-secondary)] mb-3" />
          <h2 className="text-lg font-semibold text-[var(--text-primary)] mb-2">
            Something went wrong
          </h2>
          <p className="text-sm text-[var(--text-secondary)] mb-6 max-w-sm">
            {error.message || 'An unexpected error occurred.'}
          </p>
          <Button
            onClick={this.handleReset}
            variant="outline"
            aria-label="Retry page"
          >
            Try again
          </Button>
        </div>
      )
    }

    return children
  }
}

ErrorBoundary.propTypes = {
  children: PropTypes.node,
  fallback: PropTypes.node,
  onReset: PropTypes.func,
}

export default ErrorBoundary

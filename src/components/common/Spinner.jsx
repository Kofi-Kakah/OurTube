import PropTypes from 'prop-types'

export default function Spinner({
  size = 'md',
  className = '',
  'aria-label': ariaLabel = 'Loading',
  ...props
}) {
  const sizeMap = {
    sm: 'w-4 h-4 border-2',
    md: 'w-6 h-6 border-2',
    lg: 'w-8 h-8 border-3',
  }

  return (
    <div
      role="status"
      aria-label={ariaLabel}
      className={`inline-block animate-spin rounded-full border-current border-t-transparent text-[var(--accent)] ${sizeMap[size] || sizeMap.md} ${className}`}
      {...props}
    >
      <span className="sr-only">{ariaLabel}</span>
    </div>
  )
}

Spinner.propTypes = {
  size: PropTypes.oneOf(['sm', 'md', 'lg']),
  className: PropTypes.string,
  'aria-label': PropTypes.string,
}

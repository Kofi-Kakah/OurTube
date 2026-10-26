import PropTypes from 'prop-types'
import Spinner from './Spinner'

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  disabled = false,
  loading = false,
  startIcon,
  endIcon,
  className = '',
  type = 'button',
  ...props
}) {
  const baseStyles =
    'inline-flex items-center justify-center font-medium rounded-full transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline-2 focus-visible:outline-offset-2'

  const sizeStyles = {
    sm: 'text-xs px-3 py-1.5 gap-1.5',
    md: 'text-sm px-4 py-2 gap-2',
    lg: 'text-base px-5 py-2.5 gap-2.5',
  }

  const variantStyles = {
    primary:
      'bg-[var(--accent)] text-white hover:bg-[var(--accent-hover)] focus-visible:outline-[var(--accent)]',
    secondary:
      'bg-[var(--bg-surface-elevated)] text-[var(--text-primary)] border border-[var(--border-color)] hover:opacity-90',
    outline:
      'border border-[var(--border-color)] text-[var(--text-primary)] hover:bg-[var(--bg-surface-elevated)]',
    ghost:
      'bg-transparent text-[var(--text-primary)] hover:bg-[var(--bg-surface-elevated)]',
    danger:
      'bg-[var(--danger)] text-white hover:opacity-90 focus-visible:outline-[var(--danger)]',
  }

  return (
    <button
      type={type}
      disabled={disabled || loading}
      className={`${baseStyles} ${sizeStyles[size] || sizeStyles.md} ${variantStyles[variant] || variantStyles.primary} ${fullWidth ? 'w-full' : ''} ${className}`}
      {...props}
    >
      {loading ? (
        <Spinner size="sm" className="mr-1" />
      ) : (
        startIcon && <span className="inline-flex shrink-0">{startIcon}</span>
      )}
      <span>{children}</span>
      {!loading && endIcon && (
        <span className="inline-flex shrink-0">{endIcon}</span>
      )}
    </button>
  )
}

Button.propTypes = {
  children: PropTypes.node,
  variant: PropTypes.oneOf([
    'primary',
    'secondary',
    'outline',
    'ghost',
    'danger',
  ]),
  size: PropTypes.oneOf(['sm', 'md', 'lg']),
  fullWidth: PropTypes.bool,
  disabled: PropTypes.bool,
  loading: PropTypes.bool,
  startIcon: PropTypes.node,
  endIcon: PropTypes.node,
  className: PropTypes.string,
  type: PropTypes.string,
}

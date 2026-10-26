import PropTypes from 'prop-types'

export default function IconButton({
  children,
  'aria-label': ariaLabel,
  variant = 'ghost',
  size = 'md',
  disabled = false,
  active = false,
  className = '',
  type = 'button',
  ...props
}) {
  const baseStyles =
    'inline-flex items-center justify-center rounded-full transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)] shrink-0'

  const sizeStyles = {
    sm: 'w-8 h-8 text-sm',
    md: 'w-10 h-10 text-base',
    lg: 'w-12 h-12 text-lg',
  }

  const variantStyles = {
    ghost: active
      ? 'bg-[var(--bg-surface-elevated)] text-[var(--accent)]'
      : 'text-[var(--text-primary)] hover:bg-[var(--bg-surface-elevated)]',
    outline: active
      ? 'border border-[var(--accent)] text-[var(--accent)] bg-[var(--bg-surface-elevated)]'
      : 'border border-[var(--border-color)] text-[var(--text-primary)] hover:bg-[var(--bg-surface-elevated)]',
    filled: active
      ? 'bg-[var(--accent)] text-white hover:bg-[var(--accent-hover)]'
      : 'bg-[var(--bg-surface-elevated)] text-[var(--text-primary)] hover:opacity-90',
  }

  return (
    <button
      type={type}
      aria-label={ariaLabel}
      aria-pressed={active}
      disabled={disabled}
      className={`${baseStyles} ${sizeStyles[size] || sizeStyles.md} ${variantStyles[variant] || variantStyles.ghost} ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}

IconButton.propTypes = {
  children: PropTypes.node.isRequired,
  'aria-label': PropTypes.string.isRequired,
  variant: PropTypes.oneOf(['ghost', 'outline', 'filled']),
  size: PropTypes.oneOf(['sm', 'md', 'lg']),
  disabled: PropTypes.bool,
  active: PropTypes.bool,
  className: PropTypes.string,
  type: PropTypes.string,
}

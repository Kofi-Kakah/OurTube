import PropTypes from 'prop-types'

export default function Skeleton({
  variant = 'text',
  width,
  height,
  className = '',
  animate = true,
  ...props
}) {
  const variantStyles = {
    text: 'h-4 w-full rounded',
    circular: 'rounded-full',
    rectangular: 'rounded-none',
    rounded: 'rounded-xl',
  }

  const customStyle = {
    width: width || undefined,
    height: height || undefined,
  }

  return (
    <div
      aria-hidden="true"
      style={customStyle}
      className={`relative overflow-hidden bg-[var(--skeleton)] ${variantStyles[variant] || variantStyles.text} ${className}`}
      {...props}
    >
      {animate && (
        <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-[var(--skeleton-highlight)] to-transparent opacity-40 animate-shimmer" />
      )}
    </div>
  )
}

Skeleton.propTypes = {
  variant: PropTypes.oneOf(['text', 'circular', 'rectangular', 'rounded']),
  width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  height: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  className: PropTypes.string,
  animate: PropTypes.bool,
}

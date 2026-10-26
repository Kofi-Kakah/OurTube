import { useState } from 'react'
import PropTypes from 'prop-types'

export default function Avatar({
  src,
  alt = '',
  name = '',
  size = 'md',
  className = '',
}) {
  const [imageError, setImageError] = useState(false)

  const sizeStyles = {
    xs: 'w-6 h-6 text-xs',
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-12 h-12 text-base',
    xl: 'w-16 h-16 text-xl',
  }

  const initials = name
    ? name
        .split(' ')
        .map((part) => part[0])
        .slice(0, 2)
        .join('')
        .toUpperCase()
    : '?'

  const hasImage = src && !imageError

  return (
    <div
      className={`relative inline-flex items-center justify-center shrink-0 rounded-full overflow-hidden bg-[var(--bg-surface-elevated)] text-[var(--text-primary)] border border-[var(--border-color)] font-semibold select-none ${sizeStyles[size] || sizeStyles.md} ${className}`}
    >
      {hasImage ? (
        <img
          src={src}
          alt={alt || name}
          loading="lazy"
          onError={() => setImageError(true)}
          className="w-full h-full object-cover"
        />
      ) : (
        <span>{initials}</span>
      )}
    </div>
  )
}

Avatar.propTypes = {
  src: PropTypes.string,
  alt: PropTypes.string,
  name: PropTypes.string,
  size: PropTypes.oneOf(['xs', 'sm', 'md', 'lg', 'xl']),
  className: PropTypes.string,
}

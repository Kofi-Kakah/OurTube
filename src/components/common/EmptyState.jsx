import PropTypes from 'prop-types'

export default function EmptyState({
  icon,
  title,
  description,
  action,
  className = '',
}) {
  return (
    <div
      role="region"
      aria-label={title}
      className={`flex flex-col items-center justify-center text-center p-8 max-w-md mx-auto ${className}`}
    >
      {icon && (
        <div className="mb-4 text-[var(--text-secondary)] opacity-80 inline-flex items-center justify-center p-4 rounded-full bg-[var(--bg-surface-elevated)] border border-[var(--border-color)]">
          {icon}
        </div>
      )}
      {title && (
        <h3 className="text-lg md:text-xl font-semibold text-[var(--text-primary)] mb-2">
          {title}
        </h3>
      )}
      {description && (
        <p className="text-sm text-[var(--text-secondary)] mb-6 max-w-sm">
          {description}
        </p>
      )}
      {action && <div className="mt-2">{action}</div>}
    </div>
  )
}

EmptyState.propTypes = {
  icon: PropTypes.node,
  title: PropTypes.string.isRequired,
  description: PropTypes.string,
  action: PropTypes.node,
  className: PropTypes.string,
}

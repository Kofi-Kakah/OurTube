import PropTypes from 'prop-types'
import { X, CheckCircle2, AlertCircle, Info } from 'lucide-react'

export default function Toast({ toast, onClose }) {
  const { message, type, action } = toast

  const icons = {
    info: <Info className="w-5 h-5 text-[var(--accent)] shrink-0" />,
    success: <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0" />,
    error: <AlertCircle className="w-5 h-5 text-[var(--danger)] shrink-0" />,
  }

  return (
    <div
      role="status"
      className="pointer-events-auto flex items-center justify-between gap-3 p-4 rounded-xl bg-[var(--bg-surface-elevated)] border border-[var(--border-color)] shadow-xl text-[var(--text-primary)] animate-in fade-in slide-in-from-bottom-2 duration-200"
    >
      <div className="flex items-center gap-3">
        {icons[type] || icons.info}
        <p className="text-sm font-medium">{message}</p>
      </div>

      <div className="flex items-center gap-2">
        {action && (
          <button
            onClick={() => {
              action.onClick?.()
              onClose()
            }}
            className="text-xs font-semibold text-[var(--accent)] hover:underline uppercase tracking-wider cursor-pointer"
          >
            {action.label}
          </button>
        )}
        <button
          onClick={onClose}
          aria-label="Dismiss toast"
          className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] cursor-pointer p-1 rounded-md"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}

Toast.propTypes = {
  toast: PropTypes.shape({
    id: PropTypes.string.isRequired,
    message: PropTypes.string.isRequired,
    type: PropTypes.oneOf(['info', 'success', 'error']),
    action: PropTypes.shape({
      label: PropTypes.string.isRequired,
      onClick: PropTypes.func.isRequired,
    }),
  }).isRequired,
  onClose: PropTypes.func.isRequired,
}

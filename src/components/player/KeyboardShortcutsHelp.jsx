import { useCallback } from 'react'
import PropTypes from 'prop-types'
import { X, HelpCircle } from 'lucide-react'

const SHORTCUTS = [
  { key: 'Space / K', action: 'Play / pause' },
  { key: '← / →', action: 'Seek −5s / +5s' },
  { key: 'J / L', action: 'Seek −10s / +10s' },
  { key: '↑ / ↓', action: 'Volume +/− 5%' },
  { key: 'M', action: 'Mute / unmute' },
  { key: 'F', action: 'Fullscreen' },
  { key: 'T', action: 'Theater mode' },
  { key: 'I', action: 'Picture-in-picture' },
  { key: '< / >', action: 'Decrease / increase speed' },
  { key: '0 – 9', action: 'Jump to 0% – 90%' },
  { key: 'Home / End', action: 'Jump to start / end' },
  { key: 'Shift + N', action: 'Next video' },
  { key: '?', action: 'Show this help' },
]

/**
 * Keyboard shortcuts help modal. Lists every shortcut with its action.
 * Closes on outside click / Escape.
 */
export default function KeyboardShortcutsHelp({ isOpen, onClose }) {
  const handleClose = useCallback(() => onClose(), [onClose])

  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={handleClose}
      onKeyDown={(e) => {
        if (e.key === 'Escape') handleClose()
      }}
    >
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" aria-hidden="true" onClick={handleClose} />

      {/* Modal card */}
      <div className="relative w-full max-w-lg bg-[var(--bg-surface-elevated)] border border-[var(--border-color)] rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-[var(--border-color)]">
          <div className="flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-[var(--accent)] shrink-0" />
            <h2 className="text-lg font-semibold text-[var(--text-primary)]">
              Keyboard shortcuts
            </h2>
          </div>
          <button
            type="button"
            onClick={handleClose}
            className="w-7 h-7 rounded-full bg-[var(--bg-base)] border border-[var(--border-color)] flex items-center justify-center text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface-elevated)] transition-colors"
            aria-label="Close help"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="overflow-y-auto p-6 text-[var(--text-primary)]">
          <p className="text-sm text-[var(--text-secondary)] mb-6">
            Shortcuts work when the player or watch page is focused and you are
            not typing in a text field.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {SHORTCUTS.map(({ key, action }) => (
              <div
                key={key}
                className="flex items-center gap-3 px-3 py-2 rounded-lg border border-[var(--border-color)] bg-[var(--bg-base)]"
              >
                <span className="shrink-0 text-xs font-mono font-bold text-[var(--accent)] bg-[var(--bg-surface-elevated)]/50 px-1.5 py-0.5 rounded border border-[var(--border-color)]">
                  {key}
                </span>
                <span className="text-sm text-[var(--text-primary)]">{action}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

KeyboardShortcutsHelp.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
}

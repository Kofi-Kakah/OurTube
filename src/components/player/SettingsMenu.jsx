import { useState, useCallback } from 'react'
import PropTypes from 'prop-types'
import { ChevronLeft, Clock, Play, X } from 'lucide-react'

/**
 * Settings menu with nested panels: Playback speed, Quality, Autoplay.
 * Opens from the gear icon in Controls. Closes on outside click / Escape.
 * All values are persisted via the parent's userStore actions.
 */
export default function SettingsMenu({
  isOpen,
  onClose,
  currentSpeed,
  speeds,
  onSetSpeed,
  currentQuality,
  qualities,
  onSetQuality,
  autoplay,
  onToggleAutoplay,
}) {
  const [panel, setPanel] = useState(null) // null | 'speed' | 'quality'

  const handleBack = useCallback(() => setPanel(null), [])

  const isSpeedSelected = (s) => s === currentSpeed
  const isQualitySelected = (q) => q === currentQuality

  const speedLabel = (s) => (s === 1 ? 'Normal' : `${s}x`)
  const qualityLabel = (q) => (q === 'auto' ? 'Auto' : q)

  if (!isOpen) return null

  const renderSpeedPanel = () => (
    <div className="flex flex-col gap-1">
      <div className="flex items-center gap-2 px-4 py-3 border-b border-[var(--border-color)]">
        <button
          type="button"
          onClick={handleBack}
          className="-ml-1 flex items-center text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
          aria-label="Back"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
        <span className="text-sm font-medium text-[var(--text-primary)]">
          Playback speed
        </span>
      </div>
      {speeds.map((s) => (
        <button
          key={s}
          type="button"
          onClick={() => {
            onSetSpeed(s)
            setPanel(null)
          }}
          className={`w-full flex items-center gap-3 px-4 py-3 text-left text-sm transition-colors ${
            isSpeedSelected(s)
              ? 'bg-[var(--bg-surface-elevated)] text-[var(--accent)] font-semibold'
              : 'text-[var(--text-primary)] hover:bg-[var(--bg-base)]'
          }`}
        >
          <span>{speedLabel(s)}</span>
          {isSpeedSelected(s) && (
            <Play className="ml-auto w-4 h-4 text-[var(--accent)] shrink-0" />
          )}
        </button>
      ))}
    </div>
  )

  const renderQualityPanel = () => (
    <div className="flex flex-col gap-1">
      <div className="flex items-center gap-2 px-4 py-3 border-b border-[var(--border-color)]">
        <button
          type="button"
          onClick={handleBack}
          className="-ml-1 flex items-center text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
          aria-label="Back"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
        <span className="text-sm font-medium text-[var(--text-primary)]">
          Quality
        </span>
      </div>
      {qualities.map((q) => (
        <button
          key={q}
          type="button"
          onClick={() => {
            onSetQuality(q)
            setPanel(null)
          }}
          className={`w-full flex items-center gap-3 px-4 py-3 text-left text-sm transition-colors ${
            isQualitySelected(q)
              ? 'bg-[var(--bg-surface-elevated)] text-[var(--accent)] font-semibold'
              : 'text-[var(--text-primary)] hover:bg-[var(--bg-base)]'
          }`}
        >
          <span>{qualityLabel(q)}</span>
          {isQualitySelected(q) && (
            <Play className="ml-auto w-4 h-4 text-[var(--accent)] shrink-0" />
          )}
        </button>
      ))}
    </div>
  )

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={onClose}
      onKeyDown={(e) => {
        if (e.key === 'Escape') onClose()
      }}
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm"
        aria-hidden="true"
        onClick={onClose}
      />

      {/* Menu card */}
      <div
        className="relative w-full max-w-md bg-[var(--bg-surface-elevated)] border border-[var(--border-color)] rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-[var(--border-color)]">
          <h2 className="text-lg font-semibold text-[var(--text-primary)]">
            Settings
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-[var(--bg-base)] border border-[var(--border-color)] flex items-center justify-center text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface-elevated)] transition-colors"
            aria-label="Close settings"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="overflow-y-auto p-2 text-[var(--text-primary)]">
          {panel === 'speed' ? renderSpeedPanel() : panel === 'quality' ? renderQualityPanel() : (
            <div className="flex flex-col gap-0.5">
              <button
                type="button"
                onClick={() => setPanel('speed')}
                className="w-full flex items-center justify-between px-4 py-3 text-left text-sm transition-colors hover:bg-[var(--bg-base)]"
                role="menuitem"
              >
                <span className="flex items-center gap-2">
                  <Clock className="w-4 h-4 shrink-0 text-[var(--text-secondary)]" />
                  <span>Playback speed</span>
                </span>
                <span className="text-xs text-[var(--text-secondary)]">
                  {speedLabel(currentSpeed)}
                </span>
              </button>
              <button
                type="button"
                onClick={() => setPanel('quality')}
                className="w-full flex items-center justify-between px-4 py-3 text-left text-sm transition-colors hover:bg-[var(--bg-base)] border-t border-[var(--border-color)]"
                role="menuitem"
              >
                <span className="flex items-center gap-2">
                  <Play className="w-4 h-4 shrink-0 text-[var(--text-secondary)]" />
                  <span>Quality</span>
                </span>
                <span className="text-xs text-[var(--text-secondary)]">
                  {qualityLabel(currentQuality)}
                </span>
              </button>
              <button
                type="button"
                onClick={onToggleAutoplay}
                className={`w-full flex items-center justify-between px-4 py-3 text-left text-sm transition-colors hover:bg-[var(--bg-base)] border-t border-[var(--border-color)] ${
                  autoplay ? 'text-[var(--accent)]' : ''
                }`}
                role="menuitem"
                aria-pressed={autoplay}
              >
                <span className="flex items-center gap-2">
                  <Play className="w-4 h-4 shrink-0 text-[var(--text-secondary)]" />
                  <span>Autoplay next video</span>
                </span>
                <span
                  className={`w-5 h-2.5 rounded-full transition-colors ${
                    autoplay
                      ? 'bg-[var(--accent)]'
                      : 'bg-[var(--border-color)]'
                  }`}
                >
                  <span
                    className={`block w-2 h-2 rounded-full bg-white ${
                      autoplay ? 'translate-x-full' : 'translate-x-0'
                    } transition-transform`}
                  />
                </span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

SettingsMenu.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  currentSpeed: PropTypes.number.isRequired,
  speeds: PropTypes.arrayOf(PropTypes.number).isRequired,
  onSetSpeed: PropTypes.func.isRequired,
  currentQuality: PropTypes.string.isRequired,
  qualities: PropTypes.arrayOf(PropTypes.string).isRequired,
  onSetQuality: PropTypes.func.isRequired,
  autoplay: PropTypes.bool.isRequired,
  onToggleAutoplay: PropTypes.func.isRequired,
}

import { useState, useRef, useCallback } from 'react'
import PropTypes from 'prop-types'
import { Volume2, VolumeOff } from 'lucide-react'

/**
 * Volume control: mute toggle + volume slider (0-1). When muted the slider
 * reads 0 but the remembered volume is restored on unmute.
 */
export default function VolumeControl({ volume, muted, onSetVolume, onToggleMute }) {
  const sliderRef = useRef(null)
  const [hoverVolume, setHoverVolume] = useState(null)
  const [hoverX, setHoverX] = useState(0)

  const displayVolume = muted ? 0 : volume

  const formatPercent = (v) => `${Math.round(v * 100)}%`

  const updateHover = useCallback(
    (clientX) => {
      const el = sliderRef.current
      if (!el) return
      const rect = el.getBoundingClientRect()
      let x = clientX - rect.left
      x = Math.max(0, Math.min(rect.width, x))
      setHoverX(x)
      setHoverVolume(x / rect.width)
    },
    []
  )

  const onKeyDown = useCallback(
    (event) => {
      const step = 0.05
      if (event.key === 'ArrowUp' || event.key === 'ArrowRight') {
        event.preventDefault()
        onSetVolume(Math.min(1, volume + step))
        return
      }
      if (event.key === 'ArrowDown' || event.key === 'ArrowLeft') {
        event.preventDefault()
        onSetVolume(Math.max(0, volume - step))
        return
      }
    },
    [volume, onSetVolume]
  )

  return (
    <div className="flex items-center gap-2 shrink-0">
      <button
        type="button"
        onClick={onToggleMute}
        aria-label={muted ? 'Unmute' : 'Mute'}
        aria-pressed={muted}
        className="w-7 h-7 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-white transition-colors"
      >
        {muted ? <VolumeOff className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
      </button>
      <div
        className="relative w-24 h-1.5 bg-white/30 rounded-full overflow-hidden group"
        onMouseMove={updateHover}
        onMouseLeave={() => setHoverVolume(null)}
      >
        <div
          className="h-full bg-white/60"
          style={{ width: `${displayVolume * 100}%` }}
        />
        <div className="h-full bg-[var(--accent)] relative" style={{ width: `${displayVolume * 100}%` }}>
          <div
            className={`absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-[var(--accent)] ring-1 ring-white shadow-sm cursor-pointer ${
              hoverVolume != null ? 'scale-125' : 'scale-100'
            }`}
          />
        </div>
      </div>
      <input
        ref={sliderRef}
        type="range"
        min="0"
        max="1"
        step="0.01"
        defaultValue={volume}
        aria-label="Volume"
        aria-valuenow={displayVolume}
        aria-valuemin="0"
        aria-valuemax="1"
        aria-valuetext={formatPercent(displayVolume)}
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
        onChange={(e) => onSetVolume(Number(e.target.value))}
        onKeyDown={onKeyDown}
        onFocus={() => setHoverVolume(volume)}
        onBlur={() => setHoverVolume(null)}
      />
      {hoverVolume != null && (
        <div
          className="absolute -top-8 -translate-y-full px-1.5 py-0.5 rounded bg-black/90 text-white text-[10px] whitespace-nowrap pointer-events-none"
          style={{ left: `${hoverX}px`, transform: 'translateX(-50%)' }}
        >
          {formatPercent(hoverVolume)}
        </div>
      )}
    </div>
  )
}

VolumeControl.propTypes = {
  volume: PropTypes.number.isRequired,
  muted: PropTypes.bool.isRequired,
  onSetVolume: PropTypes.func.isRequired,
  onToggleMute: PropTypes.func.isRequired,
}

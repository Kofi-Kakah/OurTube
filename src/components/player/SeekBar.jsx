import { useState, useRef, useCallback } from 'react'
import PropTypes from 'prop-types'

/**
 * Seek bar: played range, buffered range, hover tooltip with scrub time,
 * draggable thumb (pointer/touch), click to seek, keyboard (arrows/Home/End).
 * role="slider" with aria-valuenow/min/max/valuetext.
 */
export default function SeekBar({ currentTime, duration, buffered, onSeek, onDragChange }) {
  const barRef = useRef(null)
  const sliderRef = useRef(null)
  const [dragging, setDragging] = useState(false)
  const [hoverTime, setHoverTime] = useState(null)
  const [hoverX, setHoverX] = useState(0)

  const percentPlayed = duration > 0 ? Math.max(0, Math.min(1, currentTime / duration)) : 0
  const percentBuffered = duration > 0 ? Math.max(0, Math.min(1, buffered || 0)) : 0

  const formatTime = (seconds) => {
    if (seconds == null || isNaN(seconds)) return '0:00'
    const total = Math.max(0, Math.floor(seconds))
    const m = Math.floor(total / 60)
    const s = total % 60
    return `${m}:${String(s).padStart(2, '0')}`
  }

  const seekAt = useCallback(
    (clientX) => {
      const bar = barRef.current
      if (!bar || duration <= 0) return
      const rect = bar.getBoundingClientRect()
      let x = clientX - rect.left
      x = Math.max(0, Math.min(rect.width, x))
      onSeek((x / rect.width) * duration)
    },
    [duration, onSeek]
  )

  const updateHover = useCallback(
    (clientX) => {
      const bar = barRef.current
      if (!bar || duration <= 0) return
      const rect = bar.getBoundingClientRect()
      let x = clientX - rect.left
      x = Math.max(0, Math.min(rect.width, x))
      setHoverX(x)
      setHoverTime((x / rect.width) * duration)
    },
    [duration]
  )

  const onPointerDown = useCallback(
    (event) => {
      event.preventDefault()
      const bar = barRef.current
      if (!bar) return
      bar.setPointerCapture(event.pointerId)
      setDragging(true)
      onDragChange?.(true)
      seekAt(event.clientX)
    },
    [seekAt, onDragChange]
  )

  const onPointerMove = useCallback(
    (event) => {
      if (!dragging) return
      seekAt(event.clientX)
    },
    [dragging, seekAt]
  )

  const onPointerUp = useCallback(
    (event) => {
      if (!dragging) return
      const bar = barRef.current
      if (bar) bar.releasePointerCapture(event.pointerId)
      setDragging(false)
      onDragChange?.(false)
      seekAt(event.clientX)
    },
    [dragging, seekAt, onDragChange]
  )

  const onKeyDown = useCallback(
    (event) => {
      if (duration <= 0) return
      const step = duration * 0.01
      if (event.key === 'ArrowLeft') {
        event.preventDefault()
        onSeek(Math.max(0, currentTime - step))
        return
      }
      if (event.key === 'ArrowRight') {
        event.preventDefault()
        onSeek(Math.min(duration, currentTime + step))
        return
      }
      if (event.key === 'Home') {
        event.preventDefault()
        onSeek(0)
        return
      }
      if (event.key === 'End') {
        event.preventDefault()
        onSeek(duration)
        return
      }
    },
    [currentTime, duration, onSeek]
  )

  const onMouseMove = useCallback(
    (event) => {
      if (dragging) return
      updateHover(event.clientX)
    },
    [dragging, updateHover]
  )

  const ariaValueText = `${Math.round(percentPlayed * 100)}% played`

  return (
    <div
      className="relative w-full h-4 group/cursor"
      onMouseMove={onMouseMove}
      onMouseLeave={() => setHoverTime(null)}
    >
      <div
        ref={barRef}
        className="w-full h-1.5 bg-white/30 rounded-full overflow-hidden"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={() => {
          if (dragging) {
            setDragging(false)
            onDragChange?.(false)
          }
        }}
      >
        <div className="h-full bg-white/60" style={{ width: `${percentBuffered * 100}%` }} />
        <div className="h-full bg-[var(--accent)] relative" style={{ width: `${percentPlayed * 100}%` }}>
          <div
            className={`absolute right-0 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-[var(--accent)] ring-2 ring-white shadow-sm cursor-pointer transition-transform ${
              dragging ? 'scale-125' : 'scale-100'
            }`}
          />
        </div>
      </div>

      <input
        ref={sliderRef}
        type="range"
        min="0"
        max={Math.floor(duration) || 0}
        defaultValue={currentTime}
        step="any"
        aria-label="Seek bar"
        aria-valuenow={currentTime}
        aria-valuemin="0"
        aria-valuemax={Math.floor(duration) || 0}
        aria-valuetext={ariaValueText}
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
        onChange={(event) => onSeek(Number(event.target.value))}
        onKeyDown={onKeyDown}
        onFocus={() => setHoverTime(currentTime)}
        onBlur={() => setHoverTime(null)}
      />

      {hoverTime != null && (
        <div
          className="absolute -top-8 -translate-y-full px-1.5 py-0.5 rounded bg-black/90 text-white text-[10px] whitespace-nowrap pointer-events-none"
          style={{ left: `${hoverX}px`, transform: 'translateX(-50%)' }}
        >
          {formatTime(hoverTime)} / {formatTime(duration)}
        </div>
      )}
    </div>
  )
}

SeekBar.propTypes = {
  currentTime: PropTypes.number.isRequired,
  duration: PropTypes.number.isRequired,
  buffered: PropTypes.number.isRequired,
  onSeek: PropTypes.func.isRequired,
  onDragChange: PropTypes.func,
}

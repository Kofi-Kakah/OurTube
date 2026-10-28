import { useCallback } from 'react'
import PropTypes from 'prop-types'
import { Play, Pause, Maximize, Minimize, Theater, Settings } from 'lucide-react'
import SeekBar from './SeekBar'
import VolumeControl from './VolumeControl'

/**
 * Bottom control bar (always-dark overlay). Play/pause, current time, seek
 * bar, duration, volume, theater mode, fullscreen.
 */
export default function Controls({
  isPlaying,
  isWaiting,
  currentTime,
  duration,
  buffered,
  volume,
  muted,
  isTheater,
  isFullscreen,
  onTogglePlay,
  onSeek,
  onDragChange,
  onSetVolume,
  onToggleMute,
  onToggleTheater,
  onToggleFullscreen,
}) {
  const formatTime = (seconds) => {
    if (seconds == null || isNaN(seconds)) return '0:00'
    const total = Math.max(0, Math.floor(seconds))
    const m = Math.floor(total / 60)
    const s = total % 60
    return `${m}:${String(s).padStart(2, '0')}`
  }

  const togglePlay = useCallback(() => onTogglePlay(), [onTogglePlay])

  return (
    <div
      className="absolute inset-x-0 bottom-0 z-30 p-3 bg-gradient-to-t from-black/80 via-transparent to-transparent text-white"
    >
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={togglePlay}
          aria-label={isPlaying || isWaiting ? 'Pause video' : 'Play video'}
          className="w-8 h-8 rounded-full bg-black/60 flex items-center justify-center text-white hover:bg-black/80 transition-colors"
        >
          {isPlaying || isWaiting ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
        </button>

        <div className="flex-1 min-w-0">
          <SeekBar
            currentTime={currentTime}
            duration={duration}
            buffered={buffered}
            onSeek={onSeek}
            onDragChange={onDragChange}
          />
        </div>

        <span className="shrink-0 text-[11px] text-white/90">
          {formatTime(currentTime)} / {formatTime(duration)}
        </span>

        <VolumeControl
          volume={volume}
          muted={muted}
          onSetVolume={onSetVolume}
          onToggleMute={onToggleMute}
        />

        <button
          type="button"
          onClick={onToggleTheater}
          aria-label={isTheater ? 'Exit theater mode' : 'Theater mode'}
          aria-pressed={isTheater}
          className="w-7 h-7 rounded-full bg-black/60 flex items-center justify-center text-white hover:bg-black/80 transition-colors"
        >
          <Theater className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={onToggleFullscreen}
          aria-label={isFullscreen ? 'Exit fullscreen' : 'Fullscreen'}
          aria-pressed={isFullscreen}
          className="w-7 h-7 rounded-full bg-black/60 flex items-center justify-center text-white hover:bg-black/80 transition-colors"
        >
          {isFullscreen ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
        </button>

        <button
          type="button"
          aria-label="Settings"
          className="w-7 h-7 rounded-full bg-black/60 flex items-center justify-center text-white hover:bg-black/80 transition-colors opacity-60 cursor-not-allowed"
          disabled
        >
          <Settings className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}

Controls.propTypes = {
  isPlaying: PropTypes.bool.isRequired,
  isWaiting: PropTypes.bool.isRequired,
  currentTime: PropTypes.number.isRequired,
  duration: PropTypes.number.isRequired,
  buffered: PropTypes.number.isRequired,
  volume: PropTypes.number.isRequired,
  muted: PropTypes.bool.isRequired,
  isTheater: PropTypes.bool.isRequired,
  isFullscreen: PropTypes.bool.isRequired,
  onTogglePlay: PropTypes.func.isRequired,
  onSeek: PropTypes.func.isRequired,
  onDragChange: PropTypes.func.isRequired,
  onSetVolume: PropTypes.func.isRequired,
  onToggleMute: PropTypes.func.isRequired,
  onToggleTheater: PropTypes.func.isRequired,
  onToggleFullscreen: PropTypes.func.isRequired,
}

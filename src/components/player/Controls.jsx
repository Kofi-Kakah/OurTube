import { useCallback } from 'react'
import PropTypes from 'prop-types'
import {
  Play,
  Pause,
  Maximize,
  Minimize,
  Theater,
  Settings,
  PictureInPicture,
  PictureInPicture2,
} from 'lucide-react'
import SeekBar from './SeekBar'
import VolumeControl from './VolumeControl'
import SettingsMenu from './SettingsMenu'

const SPEEDS = [0.25, 0.5, 0.75, 1, 1.25, 1.5, 1.75, 2]

/**
 * Bottom control bar (always-dark overlay). Play/pause, current time, seek
 * bar, duration, volume, theater mode, fullscreen, PiP, settings.
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
  isPiP,
  pipSupported,
  currentSpeed,
  currentQuality,
  qualities,
  autoplay,
  onTogglePlay,
  onSeek,
  onDragChange,
  onSetVolume,
  onToggleMute,
  onSetPlaybackRate,
  onSetQuality,
  onToggleAutoplay,
  onToggleTheater,
  onToggleFullscreen,
  onTogglePiP,
  onOpenSettings,
  onCloseSettings,
  settingsOpen,
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

        {pipSupported && (
          <button
            type="button"
            onClick={onTogglePiP}
            aria-label={isPiP ? 'Exit picture-in-picture' : 'Picture-in-picture'}
            aria-pressed={isPiP}
            className={`w-7 h-7 rounded-full bg-black/60 flex items-center justify-center text-white hover:bg-black/80 transition-colors ${
              isPiP ? 'bg-[var(--accent)]' : ''
            }`}
          >
            {isPiP ? <PictureInPicture2 className="w-4 h-4" /> : <PictureInPicture className="w-4 h-4" />}
          </button>
        )}

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
          onClick={onOpenSettings}
          aria-label="Settings"
          className="w-7 h-7 rounded-full bg-black/60 flex items-center justify-center text-white hover:bg-black/80 transition-colors"
        >
          <Settings className="w-4 h-4" />
        </button>
      </div>

      {settingsOpen && (
        <SettingsMenu
          isOpen={settingsOpen}
          onClose={onCloseSettings}
          currentSpeed={currentSpeed}
          speeds={SPEEDS}
          onSetSpeed={onSetPlaybackRate}
          currentQuality={currentQuality}
          qualities={qualities}
          onSetQuality={onSetQuality}
          autoplay={autoplay}
          onToggleAutoplay={onToggleAutoplay}
        />
      )}
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
  isPiP: PropTypes.bool.isRequired,
  pipSupported: PropTypes.bool.isRequired,
  currentSpeed: PropTypes.number.isRequired,
  currentQuality: PropTypes.string.isRequired,
  qualities: PropTypes.arrayOf(PropTypes.string).isRequired,
  autoplay: PropTypes.bool.isRequired,
  onTogglePlay: PropTypes.func.isRequired,
  onSeek: PropTypes.func.isRequired,
  onDragChange: PropTypes.func.isRequired,
  onSetVolume: PropTypes.func.isRequired,
  onToggleMute: PropTypes.func.isRequired,
  onSetPlaybackRate: PropTypes.func.isRequired,
  onSetQuality: PropTypes.func.isRequired,
  onToggleAutoplay: PropTypes.func.isRequired,
  onToggleTheater: PropTypes.func.isRequired,
  onToggleFullscreen: PropTypes.func.isRequired,
  onTogglePiP: PropTypes.func.isRequired,
  onOpenSettings: PropTypes.func.isRequired,
  onCloseSettings: PropTypes.func.isRequired,
  settingsOpen: PropTypes.bool.isRequired,
}

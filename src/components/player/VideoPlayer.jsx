import { useCallback, useState } from 'react'
import PropTypes from 'prop-types'
import { AlertCircle, RefreshCw } from 'lucide-react'
import { Spinner } from '@/components/common'
import { useVideoPlayer } from '@/hooks'
import { useUserStore } from '@/store'
import BigPlayButton from './BigPlayButton'
import Controls from './Controls'

/**
 * Custom video player (Phase 11+12). Replaces native `<video controls>` with a
 * custom, accessible, always-dark-themed control overlay.
 *
 * Props mirror the previous native-player interface so Watch.jsx keeps working:
 * video, autoPlay, onPlay, onPause, onTimeUpdate, onEnded, onSeeked, videoRef,
 * plus onWaiting and onError.
 *
 * Progress tracking (Phase 8) continues to work: Watch passes callbacks that
 * read currentTime/duration from the exposed video ref.
 *
 * Settings (Phase 12): playback speed, quality, autoplay are persisted via
 * userStore and applied to the video element. PiP and keyboard shortcuts are
 * wired up here.
 */
export default function VideoPlayer({
  video,
  autoPlay = false,
  videoRef,
  onPlay,
  onPause,
  onTimeUpdate,
  onEnded,
  onSeeked,
  onWaiting,
  onError,
  onToggleTheater,
  onToggleFullscreen,
  onTogglePiP,
}) {
  const {
    autoplayDefault,
    defaultPlaybackSpeed,
    defaultQuality,
    toggleAutoplay,
    setPlaybackSpeed: storeSetPlaybackSpeed,
    setDefaultQuality: storeSetDefaultQuality,
  } = useUserStore()

  const [settingsOpen, setSettingsOpen] = useState(false)

  const {
    setVideoRef,
    containerRef,
    state,
    setHover,
    togglePlay,
    seek,
    setVolume,
    toggleMute,
    setPlaybackRate,
    setQuality,
    toggleFullscreen,
    toggleTheater,
    togglePiP,
    retry,
    qualities,
    pipSupported,
  } = useVideoPlayer({
    video,
    autoPlay,
    videoRef,
    initialPlaybackRate: defaultPlaybackSpeed,
    initialQuality: defaultQuality,
    onPlay,
    onPause,
    onTimeUpdate,
    onEnded,
    onSeeked,
    onWaiting,
    onError,
  })

  const {
    isPlaying,
    isWaiting,
    currentTime,
    duration,
    buffered,
    volume,
    muted,
    error,
    controlsVisible,
    showBigPlay,
    isTheater,
    isFullscreen,
    isPiP,
  } = state

  const showControls = controlsVisible || !isPlaying || isWaiting

  const handleRetry = useCallback(() => {
    retry()
  }, [retry])

  const handleDragChange = useCallback(() => {
    // scrubbing suppression is handled inside the hook
  }, [])

  const handleSetPlaybackRate = useCallback(
    (rate) => {
      setPlaybackRate(rate)
      storeSetPlaybackSpeed(rate)
    },
    [setPlaybackRate, storeSetPlaybackSpeed]
  )

  const handleSetQuality = useCallback(
    (q) => {
      setQuality(q)
      storeSetDefaultQuality(q)
    },
    [setQuality, storeSetDefaultQuality]
  )

  const handleToggleAutoplay = useCallback(() => {
    toggleAutoplay()
  }, [toggleAutoplay])

  const handleToggleTheater = useCallback(() => {
    toggleTheater()
    onToggleTheater?.()
  }, [toggleTheater, onToggleTheater])

  const handleToggleFullscreen = useCallback(() => {
    toggleFullscreen()
    onToggleFullscreen?.()
  }, [toggleFullscreen, onToggleFullscreen])

  const handleTogglePiP = useCallback(() => {
    togglePiP()
    onTogglePiP?.()
  }, [togglePiP, onTogglePiP])

  const handleOpenSettings = useCallback(() => setSettingsOpen(true), [])
  const handleCloseSettings = useCallback(() => setSettingsOpen(false), [])

  if (error) {
    return (
      <div
        ref={containerRef}
        className="w-full aspect-video bg-[var(--bg-base)] rounded-2xl overflow-hidden relative flex flex-col items-center justify-center p-6 text-center"
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        role="alert"
        aria-live="polite"
      >
        <AlertCircle className="w-10 h-10 text-[var(--danger)] mb-3" />
        <p className="text-sm text-[var(--text-secondary)] mb-3">
          Unable to play this video. Please try again later.
        </p>
        <button
          type="button"
          onClick={handleRetry}
          className="flex items-center gap-1.5 text-sm text-[var(--accent)] hover:underline"
        >
          <RefreshCw className="w-4 h-4" /> Retry
        </button>
      </div>
    )
  }

  return (
    <div
      ref={containerRef}
      className={`w-full aspect-video rounded-2xl overflow-hidden relative bg-black ${
        isTheater ? 'mx-auto max-w-[92vw]' : ''
      }`}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <video
        ref={setVideoRef}
        playsInline
        preload="metadata"
        poster={video.thumbnail}
        className="w-full h-full block"
      >
        {video.sources?.map((source) => (
          <source
            key={source.quality}
            src={source.url}
            type={source.type}
            data-quality={source.quality}
          />
        ))}
        Your browser does not support the video tag.
      </video>

      {isWaiting && !error && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/40 z-10">
          <Spinner size="lg" aria-label="Loading video" />
        </div>
      )}

      {showBigPlay && (
        <BigPlayButton visible={showBigPlay} onClick={togglePlay} />
      )}

      {showControls && (
        <Controls
          isPlaying={isPlaying}
          isWaiting={isWaiting}
          currentTime={currentTime}
          duration={duration}
          buffered={buffered}
          volume={volume}
          muted={muted}
          isTheater={isTheater}
          isFullscreen={isFullscreen}
          isPiP={isPiP}
          pipSupported={pipSupported}
          currentSpeed={state.playbackRate}
          currentQuality={state.quality}
          qualities={qualities}
          autoplay={autoplayDefault}
          onTogglePlay={togglePlay}
          onSeek={seek}
          onDragChange={handleDragChange}
          onSetVolume={setVolume}
          onToggleMute={toggleMute}
          onSetPlaybackRate={handleSetPlaybackRate}
          onSetQuality={handleSetQuality}
          onToggleAutoplay={handleToggleAutoplay}
          onToggleTheater={handleToggleTheater}
          onToggleFullscreen={handleToggleFullscreen}
          onTogglePiP={handleTogglePiP}
          onOpenSettings={handleOpenSettings}
          onCloseSettings={handleCloseSettings}
          settingsOpen={settingsOpen}
        />
      )}
    </div>
  )
}

VideoPlayer.propTypes = {
  video: PropTypes.shape({
    id: PropTypes.string.isRequired,
    thumbnail: PropTypes.string.isRequired,
    sources: PropTypes.arrayOf(
      PropTypes.shape({
        quality: PropTypes.string.isRequired,
        url: PropTypes.string.isRequired,
        type: PropTypes.string.isRequired,
      })
    ),
  }).isRequired,
  autoPlay: PropTypes.bool,
  videoRef: PropTypes.func,
  onPlay: PropTypes.func,
  onPause: PropTypes.func,
  onTimeUpdate: PropTypes.func,
  onEnded: PropTypes.func,
  onSeeked: PropTypes.func,
  onWaiting: PropTypes.func,
  onError: PropTypes.func,
  onToggleTheater: PropTypes.func,
  onToggleFullscreen: PropTypes.func,
  onTogglePiP: PropTypes.func,
}

import { useCallback } from 'react'
import PropTypes from 'prop-types'
import { AlertCircle, RefreshCw } from 'lucide-react'
import { Spinner } from '@/components/common'
import { useVideoPlayer } from '@/hooks'
import BigPlayButton from './BigPlayButton'
import Controls from './Controls'

/**
 * Custom video player (Phase 11). Replaces native `<video controls>` with a
 * custom, accessible, always-dark-themed control overlay.
 *
 * Props mirror the previous native-player interface so Watch.jsx keeps working:
 * video, autoPlay, onPlay, onPause, onTimeUpdate, onEnded, onSeeked, videoRef,
 * plus onWaiting and onError.
 *
 * Progress tracking (Phase 8) continues to work: Watch passes callbacks that
 * read currentTime/duration from the exposed video ref.
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
}) {
  const {
    elRef,
    containerRef,
    state,
    setHover,
    togglePlay,
    seek,
    setVolume,
    toggleMute,
    toggleFullscreen,
    toggleTheater,
    retry,
  } = useVideoPlayer({
    video,
    autoPlay,
    videoRef,
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
  } = state

  const showControls = controlsVisible || !isPlaying || isWaiting

  const handleRetry = useCallback(() => {
    retry()
  }, [retry])

  const handleDragChange = useCallback(() => {
    // scrubbing suppression is handled inside the hook
  }, [])

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
        ref={elRef}
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
          onTogglePlay={togglePlay}
          onSeek={seek}
          onDragChange={handleDragChange}
          onSetVolume={setVolume}
          onToggleMute={toggleMute}
          onToggleTheater={toggleTheater}
          onToggleFullscreen={toggleFullscreen}
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
}

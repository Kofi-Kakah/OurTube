import { useState, useRef, useEffect, useCallback } from 'react'
import PropTypes from 'prop-types'
import { Spinner } from '@/components/common'

/**
 * Native `<video controls>` player (custom controls come in Phase 11).
 * Renders all available source qualities as `<source>` elements so the
 * browser can pick a playable one. Shows a loading scrim and error state.
 */
export default function VideoPlayer({
  video,
  autoPlay = false,
  onPlay,
  onPause,
  onTimeUpdate,
  onEnded,
  onSeeked,
  onWaiting,
  videoRef,
}) {
  const videoElRef = useRef(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  const handleLoaded = useCallback(() => setIsLoading(false), [])
  const handleError = useCallback(() => {
    setIsLoading(false)
    setError('Unable to play this video. Please try again later.')
  }, [])

  // Expose the video element to the parent (e.g. for resume seeking)
  useEffect(() => {
    if (videoRef && typeof videoRef === 'function') {
      videoRef(videoElRef.current)
    }
  }, [videoRef])

  // Re-load the video source when the video changes and clean up on unmount
  useEffect(() => {
    const videoEl = videoElRef.current
    if (!videoEl) return
    videoEl.load()
    return () => {
      videoEl.pause()
      videoEl.src = ''
      videoEl.load()
    }
  }, [video?.id])

  const handleRetry = useCallback(() => {
    setError(null)
    setIsLoading(true)
    videoElRef.current?.load()
  }, [])

  return (
    <div
      className="w-full aspect-video bg-[var(--bg-surface-elevated)] rounded-2xl overflow-hidden relative"
    >
      {error ? (
        <div
          className="absolute inset-0 flex flex-col items-center justify-center bg-[var(--bg-base)] p-6 text-center"
          role="alert"
          aria-live="polite"
        >
          <p className="text-sm text-[var(--text-secondary)] mb-3">
            {error}
          </p>
          <button
            type="button"
            onClick={handleRetry}
            className="text-sm text-[var(--accent)] hover:underline"
          >
            Retry
          </button>
        </div>
      ) : (
        <video
          ref={videoElRef}
          controls
          playsInline
          autoPlay={autoPlay}
          preload="metadata"
          poster={video.thumbnail}
          className="w-full h-full block"
          onLoadedData={handleLoaded}
          onError={handleError}
          onPlay={onPlay}
          onPause={onPause}
          onTimeUpdate={onTimeUpdate}
          onEnded={onEnded}
          onSeeked={onSeeked}
          onWaiting={onWaiting}
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
      )}

      {isLoading && !error && (
        <div
          className="absolute inset-0 flex items-center justify-center bg-black/40 z-10"
          aria-label="Loading video"
        >
          <Spinner size="lg" />
        </div>
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
  onPlay: PropTypes.func,
  onPause: PropTypes.func,
  onTimeUpdate: PropTypes.func,
  onEnded: PropTypes.func,
  onSeeked: PropTypes.func,
  onWaiting: PropTypes.func,
  videoRef: PropTypes.func,
}

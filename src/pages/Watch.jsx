import { useState, useEffect, useCallback, useRef } from 'react'
import { useParams } from 'react-router-dom'
import PropTypes from 'prop-types'
import { getVideoById, getChannelById } from '@/services'
import { VideoPlayer } from '@/components/player'
import { RecommendedList } from '@/components/video'
import { CommentSection } from '@/components/comments'
import { EmptyState, Button, Avatar } from '@/components/common'
import { useHistoryStore } from '@/store'
import { formatViews, formatRelativeTime, formatDuration } from '@/utils/formatters'
import { AlertCircle, Clock, RotateCcw } from 'lucide-react'
import { LikeDislikeButtons, SubscribeButton } from '@/components/video'

/**
 * Watch page: native video player, video details, recommended videos, comments.
 * Responsive: single column on mobile, two-column (player/recommended left,
 * details right) on lg+. Handles invalid videoId with a 404-style state.
 * Progress tracking: records history on play, saves progress every ~5s while
 * playing and on pause/unload, supports resume with a "Start over" option.
 */
export default function Watch() {
  const { videoId } = useParams()
  const {
    addEntry,
    updateProgress,
    getProgress,
  } = useHistoryStore()

  const [video, setVideo] = useState(null)
  const [channel, setChannel] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [descriptionExpanded, setDescriptionExpanded] = useState(false)
  const [resumeChoice, setResumeChoice] = useState(null) // 'resume' | 'over' | null
  const [resumeSeconds, setResumeSeconds] = useState(0)
  const [resumeDuration, setResumeDuration] = useState(0)

  const videoElRef = useRef(null)
  const lastSaveRef = useRef(0)

  const SAVE_INTERVAL_MS = 5000

  const loadVideo = useCallback(async () => {
    if (!videoId) {
      setError('No video specified.')
      setIsLoading(false)
      return
    }
    setIsLoading(true)
    setError(null)
    try {
      const v = await getVideoById(videoId)
      if (!v) {
        setError('Video not found.')
        setIsLoading(false)
        return
      }
      setVideo(v)
      const ch = await getChannelById(v.channelId)
      setChannel(ch)

      // Check for saved progress to offer resume
      const saved = getProgress(videoId)
      if (saved && saved.percentage > 0 && saved.percentage < 100) {
        setResumeSeconds(saved.progressSeconds)
        setResumeDuration(saved.durationSeconds)
        setResumeChoice(null)
      }
    } catch {
      setError('Failed to load video. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }, [videoId, getProgress])

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadVideo()
  }, [loadVideo])

  // Persist progress on unmount / route change
  useEffect(() => {
    return () => {
      if (videoElRef.current && video) {
        updateProgress(
          videoId,
          videoElRef.current.currentTime,
          videoElRef.current.duration
        )
      }
    }
  }, [videoId, video, updateProgress])

  const handlePlay = useCallback(() => {
    if (videoElRef.current) {
      addEntry({
        videoId,
        progressSeconds: Math.floor(videoElRef.current.currentTime),
        durationSeconds: Math.floor(videoElRef.current.duration || 0),
      })
    }
    lastSaveRef.current = Date.now()
  }, [videoId, addEntry])

  const handlePause = useCallback(() => {
    if (videoElRef.current) {
      updateProgress(
        videoId,
        Math.floor(videoElRef.current.currentTime),
        Math.floor(videoElRef.current.duration || 0)
      )
    }
  }, [videoId, updateProgress])

  const handleTimeUpdate = useCallback(() => {
    if (!videoElRef.current) return
    const now = Date.now()
    if (now - lastSaveRef.current < SAVE_INTERVAL_MS) return
    lastSaveRef.current = now
    updateProgress(
      videoId,
      Math.floor(videoElRef.current.currentTime),
      Math.floor(videoElRef.current.duration || 0)
    )
  }, [videoId, updateProgress])

  const handleEnded = useCallback(() => {
    // Mark completed: store resets progress when >= 95% watched
    if (videoElRef.current) {
      updateProgress(
        videoId,
        Math.floor(videoElRef.current.duration || 0),
        Math.floor(videoElRef.current.duration || 0)
      )
    }
    setResumeChoice(null)
  }, [videoId, updateProgress])

  const handleSeeked = useCallback(() => {
    lastSaveRef.current = Date.now()
  }, [])

  const handleResume = () => {
    setResumeChoice('resume')
    if (videoElRef.current && resumeSeconds > 0) {
      videoElRef.current.currentTime = resumeSeconds
    }
  }

  const handleStartOver = () => {
    setResumeChoice('over')
    if (videoElRef.current) {
      videoElRef.current.currentTime = 0
    }
  }

  const resumeLabel =
    resumeSeconds > 0 && resumeDuration > 0
      ? `${formatRelativeTime(new Date().toISOString())} — ${Math.floor(
          resumeSeconds / 60
        )}:${String(resumeSeconds % 60).padStart(2, '0')} / ${formatDuration(
          resumeDuration
        )}`
      : null

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <p className="text-sm text-[var(--text-secondary)]">Loading video…</p>
      </div>
    )
  }

  if (error || !video) {
    return (
      <div className="py-20">
        <EmptyState
          icon={<AlertCircle className="w-8 h-8 text-[var(--text-secondary)]" />}
          title={error || 'Video not found'}
          description={
            error ||
            'The video you are looking for does not exist or has been removed.'
          }
          action={
            <Button onClick={() => window.history.back()} variant="outline">
              Go back
            </Button>
          }
        />
      </div>
    )
  }

  const showResume =
    resumeChoice === null && resumeSeconds > 0 && resumeDuration > 0

  return (
    <div className="flex flex-col gap-6 w-full pb-8">
      {/* Resume banner */}
      {showResume && (
        <div
          className="flex items-center justify-between gap-3 px-3 py-2 rounded-xl border border-[var(--border-color)] bg-[var(--bg-surface-elevated)] text-sm"
        >
          <div className="flex items-center gap-2">
            <Clock className="w-3.5 h-3.5 shrink-0 text-[var(--text-secondary)]" />
            <span className="text-[var(--text-secondary)]">
              Resume from {Math.floor(resumeSeconds / 60)}:{String(
              resumeSeconds % 60
            ).padStart(2, '0')}?
          </span>
          </div>
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={handleResume}
              className="text-xs font-medium text-[var(--accent)] hover:underline"
            >
              Resume
            </button>
            <button
              type="button"
              onClick={handleStartOver}
              className="text-xs font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:underline"
            >
              Start over
            </button>
          </div>
        </div>
      )}

      {/* Player */}
      <section className="w-full">
        <VideoPlayer
          video={video}
          autoPlay={false}
          videoRef={(el) => {
            videoElRef.current = el
          }}
          onPlay={handlePlay}
          onPause={handlePause}
          onTimeUpdate={handleTimeUpdate}
          onEnded={handleEnded}
          onSeeked={handleSeeked}
        />
      </section>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Left: Recommended */}
        <div className="flex-1 lg:w-2/3 flex flex-col gap-6">
          <RecommendedList videoId={video.id} />
        </div>

        {/* Right: Details (desktop only) */}
        <div className="lg:w-1/3 flex flex-col gap-4 hidden lg:block">
          <VideoDetails
            video={video}
            channel={channel}
            descriptionExpanded={descriptionExpanded}
            setDescriptionExpanded={setDescriptionExpanded}
            resumeLabel={resumeLabel}
          />
        </div>
      </div>

      {/* Mobile single column: Details then Recommended */}
      <div className="lg:hidden flex flex-col gap-6">
        <VideoDetails
          video={video}
          channel={channel}
          descriptionExpanded={descriptionExpanded}
          setDescriptionExpanded={setDescriptionExpanded}
          resumeLabel={resumeLabel}
        />
        <RecommendedList videoId={video.id} />
      </div>

      {/* Comments (full width) */}
      <section className="w-full">
        <CommentSection videoId={video.id} />
      </section>
    </div>
  )
}

Watch.propTypes = {}

function VideoDetails({
  video,
  channel,
  descriptionExpanded,
  setDescriptionExpanded,
  resumeLabel,
}) {
  const isLong = video.description.length > 160
  const channelName = channel?.name || 'Unknown Channel'
  const channelAvatar = channel?.avatar || ''
  const subscribers = channel?.subscribersCount

  return (
    <div className="flex flex-col gap-4">
      <div className="flex gap-3">
        <Avatar src={channelAvatar} name={channelName} size="md" />
        <div className="flex-1 min-w-0">
          <h1 className="text-xl font-bold text-[var(--text-primary)] leading-snug mb-1">
            {video.title}
          </h1>
          <div className="flex items-center gap-1.5 text-sm text-[var(--text-secondary)] mb-1">
            <span>{channelName}</span>
            <span>•</span>
            <span>{formatViews(video.views)}</span>
            <span>•</span>
            <span>{formatRelativeTime(video.publishedAt)}</span>
          </div>
          {subscribers != null && (
            <p className="text-xs text-[var(--text-secondary)]">
              {subscribers.toLocaleString()} subscribers
            </p>
          )}
          {resumeLabel && (
            <p className="text-xs text-[var(--text-secondary)] mt-1 flex items-center gap-1">
              <RotateCcw className="w-3 h-3 shrink-0" />
              <span>Resume: {resumeLabel}</span>
            </p>
          )}
        </div>
        <div className="shrink-0 flex flex-col gap-1">
          <LikeDislikeButtons videoId={video.id} likesCount={video.likesCount} />
          <SubscribeButton
            channelId={channel?.id || ''}
            channelName={channelName}
            subscriberCount={subscribers ?? 0}
          />
        </div>
      </div>

      <div className="flex flex-wrap gap-2 text-sm text-[var(--text-secondary)] mt-2">
        {video.tags?.map((tag) => (
          <span
            key={tag}
            className="rounded-full bg-[var(--bg-surface-elevated)] border border-[var(--border-color)] px-2 py-0.5 text-xs cursor-default hover:bg-[var(--bg-base)] transition-colors"
          >
            #{tag}
          </span>
        ))}
      </div>

      <div className="mt-4">
        <p
          className={`text-sm text-[var(--text-primary)] leading-relaxed ${
            isLong && !descriptionExpanded ? 'line-clamp-3' : ''
          }`}
        >
          {video.description}
        </p>
        {isLong && (
          <button
            type="button"
            onClick={() => setDescriptionExpanded((prev) => !prev)}
            className="text-xs font-medium text-[var(--accent)] mt-1 hover:underline"
          >
            {descriptionExpanded ? 'Show less' : 'Show more'}
          </button>
        )}
      </div>
    </div>
  )
}

VideoDetails.propTypes = {
  video: PropTypes.object.isRequired,
  channel: PropTypes.object,
  descriptionExpanded: PropTypes.bool.isRequired,
  setDescriptionExpanded: PropTypes.func.isRequired,
  resumeLabel: PropTypes.string,
}

import { useState, useEffect, useCallback, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import PropTypes from 'prop-types'
import { getVideoById, getChannelById, getRecommended } from '@/services'
import { VideoPlayer } from '@/components/player'
import { RecommendedList } from '@/components/video'
import { CommentSection } from '@/components/comments'
import { EmptyState, Button, Avatar } from '@/components/common'
import { useHistoryStore, useUserStore } from '@/store'
import { useKeyboardShortcuts, usePageTitle } from '@/hooks'
import { formatViews, formatRelativeTime, formatDuration } from '@/utils/formatters'
import { AlertCircle, Clock, RotateCcw, Save, HelpCircle } from 'lucide-react'
import { LikeDislikeButtons, SubscribeButton } from '@/components/video'
import { AddToPlaylistModal } from '@/components/playlists'
import KeyboardShortcutsHelp from '@/components/player/KeyboardShortcutsHelp'

const AUTOPAY_COUNTDOWN_SECONDS = 5

/**
 * Watch page: custom video player, video details, recommended videos, comments.
 * Responsive: single column on mobile, two-column (player/recommended left,
 * details right) on lg+. Handles invalid videoId with a 404-style state.
 * Progress tracking: records history on play, saves progress every ~5s while
 * playing and on pause/unload, supports resume with a "Start over" option.
 * Autoplay next: 5-second countdown when a video ends (respects autoplay toggle).
 * Keyboard shortcuts with on-screen indicators + help modal.
 */
export default function Watch() {
  const { videoId } = useParams()
  const navigate = useNavigate()
  const {
    addEntry,
    updateProgress,
    getProgress,
  } = useHistoryStore()
  const {
    autoplayDefault,
    defaultPlaybackSpeed,
    setPlaybackSpeed,
  } = useUserStore()

  const [video, setVideo] = useState(null)
  const [channel, setChannel] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [descriptionExpanded, setDescriptionExpanded] = useState(false)
  const [resumeChoice, setResumeChoice] = useState(null) // 'resume' | 'over' | null
  const [resumeSeconds, setResumeSeconds] = useState(0)
  const [resumeDuration, setResumeDuration] = useState(0)
  const [addModalOpen, setAddModalOpen] = useState(false)
  const [selectedVideoId, setSelectedVideoId] = useState(null)
  const [autoplayCountdown, setAutoplayCountdown] = useState(null)
  const [nextVideo, setNextVideo] = useState(null)
  const [helpOpen, setHelpOpen] = useState(false)

  usePageTitle(video ? `${video.title} — OurTube` : 'Watch — OurTube')

  const videoElRef = useRef(null)
  const lastSaveRef = useRef(0)
  const countdownTimerRef = useRef(null)

  const SAVE_INTERVAL_MS = 5000

  const clearCountdown = useCallback(() => {
    if (countdownTimerRef.current) {
      clearInterval(countdownTimerRef.current)
      countdownTimerRef.current = null
    }
    setAutoplayCountdown(null)
    setNextVideo(null)
  }, [])

  const loadVideo = useCallback(async () => {
    if (!videoId) {
      setError('No video specified.')
      setIsLoading(false)
      return
    }
    // Clear any pending autoplay countdown when loading a new video
    clearCountdown()
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
  }, [videoId, getProgress, clearCountdown])

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadVideo()
  }, [loadVideo])

  // Persist progress on unmount / route change
  useEffect(() => {
    return () => {
      clearCountdown()
      if (videoElRef.current && video) {
        updateProgress(
          videoId,
          videoElRef.current.currentTime,
          videoElRef.current.duration
        )
      }
    }
  }, [videoId, video, updateProgress, clearCountdown])

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

  const handleEnded = useCallback(async () => {
    // Mark completed: store resets progress when >= 95% watched
    if (videoElRef.current) {
      updateProgress(
        videoId,
        Math.floor(videoElRef.current.duration || 0),
        Math.floor(videoElRef.current.duration || 0)
      )
    }
    setResumeChoice(null)

    // Autoplay next video when enabled
    if (!autoplayDefault || !videoElRef.current) return
    clearCountdown()
    try {
      const data = await getRecommended(videoId, { page: 1, limit: 1 })
      const next = data.items?.[0]
      if (!next) return
      setNextVideo(next)
      let remaining = AUTOPAY_COUNTDOWN_SECONDS
      setAutoplayCountdown(remaining)
      countdownTimerRef.current = setInterval(() => {
        remaining -= 1
        if (remaining <= 0) {
          clearCountdown()
          navigate(`/watch/${next.id}`)
        } else {
          setAutoplayCountdown(remaining)
        }
      }, 1000)
    } catch {
      // ignore autoplay fetch failures
    }
  }, [videoId, autoplayDefault, updateProgress, clearCountdown, navigate])

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

  // ---------- keyboard shortcuts ----------

  const { indicator } = useKeyboardShortcuts({
    enabled: true,
    currentPlaybackRate: defaultPlaybackSpeed,
    onPlayPause: () => {
      if (videoElRef.current) {
        if (videoElRef.current.paused) videoElRef.current.play().catch(() => {})
        else videoElRef.current.pause()
      }
    },
    onSeekBackward5: () => {
      if (videoElRef.current)
        videoElRef.current.currentTime = Math.max(
          0,
          videoElRef.current.currentTime - 5
        )
    },
    onSeekForward5: () => {
      if (videoElRef.current)
        videoElRef.current.currentTime = Math.min(
          videoElRef.current.duration || 0,
          videoElRef.current.currentTime + 5
        )
    },
    onSeekBackward10: () => {
      if (videoElRef.current)
        videoElRef.current.currentTime = Math.max(
          0,
          videoElRef.current.currentTime - 10
        )
    },
    onSeekForward10: () => {
      if (videoElRef.current)
        videoElRef.current.currentTime = Math.min(
          videoElRef.current.duration || 0,
          videoElRef.current.currentTime + 10
        )
    },
    onVolumeUp: () => {
      if (videoElRef.current) {
        videoElRef.current.muted = false
        videoElRef.current.volume = Math.min(
          1,
          videoElRef.current.volume + 0.05
        )
      }
    },
    onVolumeDown: () => {
      if (videoElRef.current) {
        videoElRef.current.muted = false
        videoElRef.current.volume = Math.max(
          0,
          videoElRef.current.volume - 0.05
        )
      }
    },
    onToggleMute: () => {
      if (videoElRef.current) videoElRef.current.muted = !videoElRef.current.muted
    },
    onToggleFullscreen: () => {},
    onToggleTheater: () => {},
    onTogglePiP: () => {},
    onSetPlaybackRate: (rate) => {
      if (videoElRef.current) videoElRef.current.playbackRate = rate
      setPlaybackSpeed(rate)
    },
    onJumpToPercent: (percent) => {
      if (videoElRef.current && videoElRef.current.duration) {
        videoElRef.current.currentTime = (percent / 100) * videoElRef.current.duration
      }
    },
    onGoToStart: () => {
      if (videoElRef.current) videoElRef.current.currentTime = 0
    },
    onGoToEnd: () => {
      if (videoElRef.current) videoElRef.current.currentTime = videoElRef.current.duration || 0
    },
    onNextVideo: () => {
      navigate('/watch/' + (nextVideo?.id || videoId))
    },
    onToggleHelp: () => setHelpOpen((prev) => !prev),
  })

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

  // Autoplay countdown overlay
  const showCountdown =
    autoplayCountdown != null && nextVideo && autoplayDefault

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

      {/* Autoplay next countdown */}
  {showCountdown && (
    <div
      className="fixed inset-0 z-40 flex flex-col items-center justify-center bg-black/75 text-white"
    >
          <div className="rounded-2xl bg-[var(--bg-surface-elevated)] border border-[var(--border-color)] p-6 text-center max-w-md w-full mx-4">
            <HelpCircle className="w-6 h-6 text-[var(--accent)] mb-3" />
            <h3 className="font-semibold text-[var(--text-primary)] mb-1">
              Up next
            </h3>
            <p className="text-sm text-[var(--text-secondary)] mb-4 truncate">
              {nextVideo.title}
            </p>
            <div className="flex items-center justify-center gap-3">
              <span className="text-[var(--accent)] font-mono font-bold text-lg">
                {autoplayCountdown}
              </span>
              <span className="text-sm text-[var(--text-secondary)]">
                seconds
              </span>
            </div>
            <div className="flex justify-end gap-2 mt-5">
              <button
                type="button"
                onClick={clearCountdown}
                className="px-3 py-1.5 rounded text-xs font-medium text-[var(--text-secondary)] hover:bg-[var(--bg-surface-elevated)] transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  clearCountdown()
                  navigate(`/watch/${nextVideo.id}`)
                }}
                className="px-3 py-1.5 rounded text-xs font-medium text-white bg-[var(--accent)] hover:bg-[var(--accent-hover)] transition-colors"
              >
                Play now
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Save to playlist action */}
      <div className="flex justify-end px-1">
        <button
          type="button"
          onClick={() => {
            setSelectedVideoId(video.id)
            setAddModalOpen(true)
          }}
          className="text-xs font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:underline"
          aria-label="Add to playlist"
        >
          <Save className="w-3.5 h-3.5" />
          <span>Save to playlist</span>
        </button>
      </div>

      {/* Player */}
      <section className="w-full relative">
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
          onToggleTheater={() => {}}
          onToggleFullscreen={() => {}}
          onTogglePiP={() => {}}
        />
      </section>

      {/* On-screen shortcut indicator */}
      {indicator && (
        <div
          className="fixed bottom-24 left-1/2 -translate-x-1/2 z-50 px-3 py-1.5 rounded-lg bg-black/80 text-white text-xs font-medium whitespace-nowrap"
        >
          {indicator.text}
        </div>
      )}

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
      <AddToPlaylistModal
        isOpen={addModalOpen}
        onClose={() => {
          setAddModalOpen(false)
          setSelectedVideoId(null)
        }}
        videoId={selectedVideoId}
      />
      <KeyboardShortcutsHelp
        isOpen={helpOpen}
        onClose={() => setHelpOpen(false)}
      />
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

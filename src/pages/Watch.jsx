import { useState, useEffect, useCallback } from 'react'
import { useParams } from 'react-router-dom'
import PropTypes from 'prop-types'
import { getVideoById, getChannelById } from '@/services'
import { VideoPlayer } from '@/components/player'
import { RecommendedList } from '@/components/video'
import { CommentSection } from '@/components/comments'
import { EmptyState, Button, Avatar } from '@/components/common'
import { formatViews, formatRelativeTime } from '@/utils/formatters'
import { AlertCircle } from 'lucide-react'

/**
 * Watch page: native video player, video details, recommended videos, comments.
 * Responsive: single column on mobile, two-column (player/recommended left,
 * details right) on lg+. Handles invalid videoId with a 404-style state.
 * Like/dislike and subscribe actions are intentionally omitted (Phase 7).
 */
export default function Watch() {
  const { videoId } = useParams()

  const [video, setVideo] = useState(null)
  const [channel, setChannel] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [descriptionExpanded, setDescriptionExpanded] = useState(false)

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
    } catch {
      setError('Failed to load video. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }, [videoId])

  useEffect(() => {
    // Data fetching in an effect is the standard pattern; setState calls
    // happen asynchronously after awaits, not synchronously in the body.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadVideo()
  }, [loadVideo])

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

  return (
    <div className="flex flex-col gap-6 w-full pb-8">
      {/* Player */}
      <section className="w-full">
        <VideoPlayer video={video} autoPlay={false} />
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
}

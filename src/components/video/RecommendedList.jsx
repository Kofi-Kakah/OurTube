import { useCallback } from 'react'
import { Link } from 'react-router-dom'
import PropTypes from 'prop-types'
import {
  formatDuration,
  formatViews,
  formatRelativeTime,
} from '@/utils/formatters'
import { Avatar } from '@/components/common'
import { useInfiniteScroll } from '@/hooks'
import { getRecommended } from '@/services'
import { channels } from '@/data'

const channelLookup = new Map(channels.map((ch) => [ch.id, ch]))

/**
 * Compact horizontal recommended video item used on the Watch page.
 */
function RecommendedVideoItem({ video }) {
  const channel = channelLookup.get(video.channelId) || {
    name: 'Creator',
    avatar: '',
  }

  return (
    <Link
      to={`/watch/${video.id}`}
      className="flex flex-col gap-2 w-[210px] shrink-0"
      aria-label={`Watch ${video.title}`}
    >
      <div className="relative aspect-video rounded-xl overflow-hidden bg-[var(--bg-surface-elevated)]">
        <img
          src={video.thumbnail}
          alt={video.title}
          loading="lazy"
          decoding="async"
          className="w-full h-full object-cover"
        />
        <span
          className="absolute bottom-1 right-1 px-1 py-0.5 rounded-md text-[10px] font-semibold bg-black/85 text-white"
        >
          {formatDuration(video.duration)}
        </span>
      </div>
      <div className="flex items-start gap-2">
        <Avatar src={channel.avatar} name={channel.name} size="sm" />
        <div className="flex-1 min-w-0">
          <h4 className="text-sm font-semibold text-[var(--text-primary)] line-clamp-2 leading-snug">
            {video.title}
          </h4>
          <p className="text-xs text-[var(--text-secondary)] mt-0.5 truncate">
            {channel.name}
          </p>
          <p className="text-xs text-[var(--text-secondary)] mt-0.5">
            {formatViews(video.views)} &middot; {formatRelativeTime(
            video.publishedAt
          )}
          </p>
        </div>
      </div>
    </Link>
  )
}

RecommendedVideoItem.propTypes = {
  video: PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    thumbnail: PropTypes.string.isRequired,
    duration: PropTypes.number.isRequired,
    views: PropTypes.number.isRequired,
    publishedAt: PropTypes.string.isRequired,
    channelId: PropTypes.string.isRequired,
  }).isRequired,
}

/**
 * Recommended videos list with infinite scroll.
 * Shows same-category/tagged videos first (handled by getRecommended).
 */
export default function RecommendedList({ videoId }) {
  const fetchRecommendedPage = useCallback(
    async (page) => {
      return getRecommended(videoId, { page, limit: 10 })
    },
    [videoId]
  )

  const {
    items: videos,
    isLoading,
    isLoadingMore,
    error,
    errorMore,
    sentinelRef,
    retry,
  } = useInfiniteScroll({
    fetchFn: fetchRecommendedPage,
    dependencies: [videoId],
  })

  if (isLoading && !videos.length) {
    return (
      <div className="flex flex-col gap-1">
        <h3 className="font-medium text-[var(--text-primary)] mb-2">
          Recommended
        </h3>
        <div className="flex gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="w-[210px] shrink-0">
              <div className="aspect-video rounded-xl bg-[var(--skeleton)] animate-pulse" />
              <div className="mt-1 h-4 w-4/5 bg-[var(--skeleton)] animate-pulse rounded" />
              <div className="mt-0.5 h-3 w-1/2 bg-[var(--skeleton)] animate-pulse rounded" />
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (error && !videos.length) {
    return (
      <div className="flex flex-col gap-1">
        <h3 className="font-medium text-[var(--text-primary)] mb-2">
          Recommended
        </h3>
        <div className="flex items-center gap-2 text-sm text-[var(--text-secondary)]">
          {error}
          <button
            type="button"
            onClick={retry}
            className="text-xs text-[var(--accent)] hover:underline"
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-1">
      <h3 className="font-medium text-[var(--text-primary)] mb-2">
        Recommended
      </h3>
      <div
        className="flex gap-4 overflow-x-auto no-scrollbar scrollbar-hide pb-2"
        role="feed"
        aria-busy={isLoadingMore}
      >
        {videos.map((video) => (
          <RecommendedVideoItem key={video.id} video={video} />
        ))}
        {isLoadingMore && (
          <div className="w-[210px] shrink-0 flex flex-col gap-2">
            <div className="aspect-video rounded-xl bg-[var(--skeleton)] animate-pulse" />
            <div className="mt-1 h-4 w-4/5 bg-[var(--skeleton)] animate-pulse rounded" />
            <div className="mt-0.5 h-3 w-1/2 bg-[var(--skeleton)] animate-pulse rounded" />
          </div>
        )}
        {errorMore && (
          <div className="w-[210px] shrink-0 flex items-center gap-2 px-2">
            <span className="text-xs text-[var(--text-secondary)]">
              {errorMore}
            </span>
            <button
              type="button"
              onClick={retry}
              className="text-xs text-[var(--accent)] hover:underline"
            >
              Retry
            </button>
          </div>
        )}
      </div>
      {!videos.length && !isLoading && !error && (
        <p className="text-xs text-[var(--text-secondary)]">
          No recommended videos available.
        </p>
      )}
      <div ref={sentinelRef} className="h-2 w-full" aria-hidden="true" />
    </div>
  )
}

RecommendedList.propTypes = {
  videoId: PropTypes.string.isRequired,
}

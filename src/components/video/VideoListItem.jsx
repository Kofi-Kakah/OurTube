import { memo } from 'react'
import { Link } from 'react-router-dom'
import PropTypes from 'prop-types'
import {
  formatDuration,
  formatViews,
  formatRelativeTime,
} from '@/utils/formatters'
import { channels } from '@/data'

const channelLookup = new Map(channels.map((ch) => [ch.id, ch]))

/**
 * Single video result in a vertical list layout: thumbnail left, metadata right.
 * Stacks (thumbnail above metadata) on mobile. Used by search results.
 */
function VideoListItem({ video }) {
  const channel = channelLookup.get(video.channelId) || {
    name: 'Creator',
    avatar: '',
  }

  return (
    <Link
      to={`/watch/${video.id}`}
      className="flex gap-3 p-3 rounded-xl border border-[var(--border-color)] bg-[var(--bg-surface)] hover:bg-[var(--bg-surface-elevated)] transition-colors focus-visible:outline-2 focus-visible:outline-[var(--accent)] sm:flex-row flex-col"
      aria-label={`Watch ${video.title}`}
    >
      <div
        className="relative shrink-0 w-[160px] h-[90px] sm:h-auto sm:w-[160px] rounded-lg overflow-hidden bg-[var(--bg-surface-elevated)] flex-shrink-0 mb-2 sm:mb-0"
      >
        <img
          src={video.thumbnail}
          alt={video.title}
          loading="lazy"
          decoding="async"
          className="w-full h-full object-cover"
        />
        <span
          className="absolute bottom-1 right-1 px-1.5 py-0.5 rounded-md text-xs font-semibold bg-black/85 text-white"
        >
          {formatDuration(video.duration)}
        </span>
      </div>

      <div className="flex flex-col min-w-0 flex-1">
        <h3
          className="font-semibold text-sm leading-snug text-[var(--text-primary)] line-clamp-2"
        >
          {video.title}
        </h3>
        <div className="flex items-center gap-1 text-xs text-[var(--text-secondary)] mt-1.5">
          <span>{channel.name}</span>
          <span>•</span>
          <span>{formatViews(video.views)}</span>
          <span>•</span>
          <span>{formatRelativeTime(video.publishedAt)}</span>
        </div>
      </div>
    </Link>
  )
}

VideoListItem.propTypes = {
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

export default memo(VideoListItem)

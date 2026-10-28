import { memo, useState } from 'react'
import { Link } from 'react-router-dom'
import PropTypes from 'prop-types'
import { MoreVertical, ListPlus, Share2 } from 'lucide-react'
import {
  formatDuration,
  formatViews,
  formatRelativeTime,
} from '@/utils/formatters'
import { Avatar, Dropdown, useToast } from '@/components/common'
import { useHistoryStore } from '@/store'
import { channels } from '@/data'
import { AddToPlaylistModal } from '@/components/playlists'

const channelLookup = new Map(channels.map((ch) => [ch.id, ch]))

function VideoCard({ video }) {
  const { showToast } = useToast()
  const historyEntry = useHistoryStore((state) =>
    state.entries.find((e) => e.videoId === video.id)
  )
  const progressPercentage =
    historyEntry?.percentage ??
    (historyEntry?.durationSeconds > 0
      ? Math.round(
          (historyEntry.progressSeconds / historyEntry.durationSeconds) * 100
        )
      : 0)
  const [addModalOpen, setAddModalOpen] = useState(false)

  const channel = channelLookup.get(video.channelId) || {
    name: 'Creator',
    avatar: '',
  }

  const handleShare = (e) => {
    e.preventDefault()
    e.stopPropagation()
    const watchUrl = `${window.location.origin}/watch/${video.id}`

    if (navigator.clipboard) {
      navigator.clipboard.writeText(watchUrl).then(
        () => {
          showToast({
            message: 'Link copied to clipboard!',
            type: 'success',
          })
        },
        () => {
          showToast({
            message: `Share URL: ${watchUrl}`,
            type: 'info',
          })
        }
      )
    } else {
      showToast({
        message: `Share URL: ${watchUrl}`,
        type: 'info',
      })
    }
  }

  const handleAddToPlaylist = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setAddModalOpen(true)
  }

  return (
    <>
      <article className="group flex flex-col gap-3 w-full">
      {/* Thumbnail Area */}
      <Link
        to={`/watch/${video.id}`}
        className="relative aspect-video w-full rounded-2xl overflow-hidden bg-[var(--bg-surface-elevated)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]"
        aria-label={`Watch ${video.title}`}
      >
        <img
          src={video.thumbnail}
          alt={video.title}
          loading="lazy"
          decoding="async"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />

        {/* Duration Badge */}
        <span
          className="absolute bottom-2 right-2 px-1.5 py-0.5 rounded-md text-xs font-semibold bg-black/85 text-white tracking-wide select-none"
          aria-label={`Duration ${formatDuration(video.duration)}`}
        >
          {formatDuration(video.duration)}
        </span>

        {/* Watch History Progress Bar (if partially watched) */}
        {progressPercentage > 0 && (
          <div
            className="absolute bottom-0 left-0 right-0 h-1 bg-white/30"
            aria-label={`${progressPercentage}% watched`}
          >
            <div
              className="h-full bg-[var(--accent)] transition-all"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        )}
      </Link>

      {/* Video Details Row */}
      <div className="flex items-start gap-3 px-0.5">
        {/* Channel Avatar */}
        <Link
          to={`/watch/${video.id}`}
          tabIndex={-1}
          className="shrink-0 mt-0.5"
          aria-hidden="true"
        >
          <Avatar
            src={channel.avatar}
            name={channel.name}
            size="md"
            className="ring-1 ring-[var(--border-color)]"
          />
        </Link>

        {/* Title, Channel Name, Views, Date */}
        <div className="flex-1 min-w-0">
          <Link
            to={`/watch/${video.id}`}
            className="font-semibold text-sm leading-snug text-[var(--text-primary)] line-clamp-2 group-hover:text-[var(--accent)] transition-colors focus-visible:outline-2 focus-visible:outline-[var(--accent)] rounded"
            title={video.title}
          >
            {video.title}
          </Link>

          <p className="text-xs text-[var(--text-secondary)] mt-1 truncate">
            {channel.name}
          </p>

          <p className="text-xs text-[var(--text-secondary)] flex items-center gap-1 mt-0.5">
            <span>{formatViews(video.views)}</span>
            <span>•</span>
            <span>{formatRelativeTime(video.publishedAt)}</span>
          </p>
        </div>

        {/* Three-Dot Menu */}
        <div className="shrink-0 -mr-1">
          <Dropdown
            align="right"
            trigger={({ isOpen }) => (
              <button
                type="button"
                aria-label={`Options for ${video.title}`}
                className={`p-1.5 rounded-full text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface-elevated)] transition-colors opacity-80 group-hover:opacity-100 ${
                  isOpen ? 'opacity-100 bg-[var(--bg-surface-elevated)]' : ''
                }`}
              >
                <MoreVertical className="w-4 h-4" />
              </button>
            )}
          >
            {({ close }) => (
              <div className="py-1">
                <button
                  type="button"
                  onClick={(e) => {
                    handleAddToPlaylist(e)
                    close()
                  }}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-xs text-[var(--text-primary)] hover:bg-[var(--bg-base)] text-left cursor-pointer"
                >
                  <ListPlus className="w-4 h-4 text-[var(--text-secondary)]" />
                  <span>Save to playlist</span>
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    handleShare(e)
                    close()
                  }}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-xs text-[var(--text-primary)] hover:bg-[var(--bg-base)] text-left cursor-pointer"
                >
                  <Share2 className="w-4 h-4 text-[var(--text-secondary)]" />
                  <span>Share</span>
                </button>
              </div>
            )}
          </Dropdown>
        </div>
      </div>
    </article>
    <AddToPlaylistModal
      isOpen={addModalOpen}
      onClose={() => setAddModalOpen(false)}
      videoId={video.id}
    />
    </>
  )
}

VideoCard.propTypes = {
  video: PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    description: PropTypes.string,
    thumbnail: PropTypes.string.isRequired,
    duration: PropTypes.number.isRequired,
    views: PropTypes.number.isRequired,
    publishedAt: PropTypes.string.isRequired,
    category: PropTypes.string.isRequired,
    channelId: PropTypes.string.isRequired,
  }).isRequired,
}

export default memo(VideoCard)

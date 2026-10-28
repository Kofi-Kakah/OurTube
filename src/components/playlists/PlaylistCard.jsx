import { Link } from 'react-router-dom'
import PropTypes from 'prop-types'
import { Play } from 'lucide-react'
import { usePlaylistStore } from '@/store'
import { Dropdown } from '@/components/common'

function TrashIcon({ className }) {
  return (
    <svg
      className={className}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0 1 16.138 21H7.862a2 2 0 0 1-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v3M4 7h16" />
    </svg>
  )
}

/**
 * Playlist card for the Playlists page grid: thumbnail collage, video count,
 * public/private badge, with a dropdown menu for rename/visibility/delete.
 */
export default function PlaylistCard({ playlist }) {
  const videoIds = playlist.videoIds || []
  const {
    deletePlaylist,
    updatePlaylist,
  } = usePlaylistStore()

  const handleDelete = () => {
    if (!window.confirm(`Delete playlist "${playlist.name}"?`)) return
    deletePlaylist(playlist.id)
  }

  const handlePlayAll = () => {
    if (videoIds.length === 0) return
    window.location.href = `/watch/${videoIds[0]}?list=${playlist.id}`
  }

  const handleUpdate = (updates) => {
    updatePlaylist(playlist.id, updates)
  }

  const firstThumbnail = videoIds[0]
    ? `https://picsum.photos/seed/${playlist.id}-0/300/180`
    : `https://picsum.photos/seed/${playlist.id}/300/180`

  return (
    <article className="flex flex-col gap-3 h-full rounded-2xl border border-[var(--border-color)] bg-[var(--bg-surface)] hover:bg-[var(--bg-surface-elevated)] transition-colors group">
      {/* Hero / collage thumbnail */}
      <div className="relative aspect-video rounded-xl overflow-hidden bg-[var(--bg-surface-elevated)]">
        <img
          src={firstThumbnail}
          alt={playlist.name}
          loading="lazy"
          decoding="async"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/40 flex items-center justify-center group-hover:opacity-100 opacity-0 transition-opacity">
          <button
            type="button"
            onClick={handlePlayAll}
            disabled={videoIds.length === 0}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white text-[var(--bg-base)] text-sm font-semibold hover:bg-[var(--text-secondary)]/90 transition-colors disabled:opacity-50"
            aria-label={
              videoIds.length
                ? 'Play all videos in playlist'
                : 'Playlist is empty'
            }
          >
            <Play className="w-4 h-4" />
            <span>Play all</span>
          </button>
        </div>
        <span
          className="absolute bottom-2 right-2 px-1.5 py-0.5 rounded-md text-xs font-semibold bg-black/85 text-white"
        >
          {videoIds.length}
        </span>
      </div>

      <div className="p-4">
        <Link
          to={`/playlists/${playlist.id}`}
          className="font-semibold text-sm leading-snug text-[var(--text-primary)] line-clamp-2 group-hover:text-[var(--accent)] transition-colors"
        >
          {playlist.name}
        </Link>
        <p className="text-xs text-[var(--text-secondary)] mt-0.5 line-clamp-2">
          {playlist.description || 'No description'}
        </p>
        <div className="flex items-center gap-1.5 mt-2 text-xs text-[var(--text-secondary)]">
          <span>{videoIds.length} video{videoIds.length !== 1 ? 's' : ''}</span>
          <span>•</span>
          <span>{playlist.isPublic ? 'Public' : 'Private'}</span>
        </div>
      </div>

      <div className="flex items-center justify-between px-3 py-2 border-t border-[var(--border-color)]">
        <Dropdown
          align="right"
          trigger={({ isOpen }) => (
            <button
              type="button"
              aria-expanded={isOpen}
              aria-label={`Options for ${playlist.name}`}
              className={`p-1.5 rounded-full text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface-elevated)] transition-colors opacity-80 group-hover:opacity-100`}
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <circle cx="12" cy="12" r="1" strokeWidth="2.5" />
                <circle cx="12" cy="5" r="1" strokeWidth="2.5" />
                <circle cx="12" cy="19" r="1" strokeWidth="2.5" />
              </svg>
            </button>
          )}
        >
          {({ close }) => (
            <div className="py-1">
              <button
                type="button"
                onClick={() => {
                  const name = window.prompt(
                    'Rename playlist:',
                    playlist.name
                  )
                  if (name !== null) handleUpdate({ name })
                  close()
                }}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-xs text-[var(--text-primary)] hover:bg-[var(--bg-surface-elevated)] text-left cursor-pointer"
              >
                <span className="w-4 h-4">✏️</span>
                <span>Rename</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  handleUpdate({ isPublic: !playlist.isPublic })
                  close()
                }}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-xs text-[var(--text-primary)] hover:bg-[var(--bg-surface-elevated)] text-left cursor-pointer"
              >
                <span className="w-4 h-4">
                  {playlist.isPublic ? '🔓' : '🔒'}
                </span>
                <span>
                  {playlist.isPublic ? 'Make private' : 'Make public'}
                </span>
              </button>
              <button
                type="button"
                onClick={() => {
                  handleDelete()
                  close()
                }}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-xs text-[var(--danger)] hover:bg-[var(--danger)]/10 text-left cursor-pointer"
              >
                <TrashIcon className="w-4 h-4" />
                <span>Delete</span>
              </button>
            </div>
          )}
        </Dropdown>
      </div>
    </article>
  )
}

PlaylistCard.propTypes = {
  playlist: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    description: PropTypes.string,
    videoIds: PropTypes.arrayOf(PropTypes.string),
    createdAt: PropTypes.string,
    isPublic: PropTypes.bool,
  }).isRequired,
}

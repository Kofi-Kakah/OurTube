import { useState, useCallback, useEffect, useMemo } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import PropTypes from 'prop-types'
import { Play, Trash2, ArrowUp, ArrowDown, ChevronLeft, Plus } from 'lucide-react'
import { getVideoById } from '@/services'
import { usePlaylistStore } from '@/store'
import { EmptyState, Button } from '@/components/common'
import { formatRelativeTime, formatDuration } from '@/utils/formatters'

/**
 * Playlist detail page: header (name, description, count, edit/delete), a
 * reorderable video list (up/down buttons, keyboard accessible), remove
 * video, and "Play all".
 */
export default function PlaylistDetail() {
  const { playlistId } = useParams()
  const navigate = useNavigate()
  const {
    playlists,
    removeVideoFromPlaylist,
    reorderPlaylist,
    deletePlaylist,
    updatePlaylist,
  } = usePlaylistStore()

  const playlist = playlists.find((p) => p.id === playlistId)
  const videoIds = useMemo(() => (playlist?.videoIds) || [], [playlist?.videoIds])

  const [editingName, setEditingName] = useState('')
  const [videosById, setVideosById] = useState({})
  const [videosLoading, setVideosLoading] = useState(true)

  useEffect(() => {
    let mounted = true
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setVideosLoading(true)
    Promise.all(
      videoIds.map((id) =>
        getVideoById(id).then((v) => ({ id, v }))
      )
    ).then((results) => {
      if (mounted) {
        const next = {}
        results.forEach(({ id, v }) => {
          if (v) next[id] = v
        })
        setVideosById(next)
        setVideosLoading(false)
      }
    })
    return () => {
      mounted = false
    }
  }, [videoIds])

  const handleMove = useCallback((id, fromIndex, toIndex) => {
    reorderPlaylist(playlistId, fromIndex, toIndex)
  }, [playlistId, reorderPlaylist])

  const handleRemove = useCallback((id) => {
    removeVideoFromPlaylist(playlistId, id)
  }, [playlistId, removeVideoFromPlaylist])

  const handleRename = () => {
    if (!editingName.trim()) return
    updatePlaylist(playlistId, { name: editingName.trim() })
    setEditingName('')
  }

  const handlePlayAll = () => {
    if (videoIds.length === 0) return
    navigate(`/watch/${videoIds[0]}?list=${playlistId}`)
  }

  if (!playlist) {
    return (
      <div className="py-20">
        <EmptyState
          icon={<ChevronLeft className="w-8 h-8 text-[var(--text-secondary)]" />}
          title="Playlist not found"
          description="The playlist you are looking for does not exist."
          action={
            <Button
              onClick={() => navigate('/playlists')}
              variant="outline"
            >
              Back to playlists
            </Button>
          }
        />
      </div>
    )
  }

  const handleDelete = () => {
    if (!window.confirm(`Delete playlist "${playlist.name}"?`)) return
    deletePlaylist(playlistId)
    navigate('/playlists')
  }

  if (videoIds.length === 0) {
    return (
      <div className="flex flex-col gap-6 w-full pb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-[var(--border-color)] pb-4">
          <div>
            <h1 className="font-bold text-[var(--text-primary)] text-xl">
              {playlist.name}
            </h1>
            <p className="text-sm text-[var(--text-secondary)] mt-1">
              {playlist.description || 'No description'}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePlayAll}
              disabled
              className="text-xs font-medium text-[var(--text-secondary)] opacity-50 cursor-not-allowed"
            >
              Play all
            </button>
            <button
              type="button"
              onClick={() => {
                setEditingName(playlist.name)
              }}
              className="text-xs font-medium text-[var(--text-secondary)] hover:text-[var(--accent)] underline"
            >
              Edit
            </button>
          </div>
        </div>
        <EmptyState
          icon={<Plus className="w-8 h-8 text-[var(--text-secondary)]" />}
          title="Empty playlist"
          description="Add videos to this playlist from any video page or search."
        />
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6 w-full pb-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-[var(--border-color)] pb-4">
        <div className="flex-1 min-w-0">
          <h1 className="font-bold text-[var(--text-primary)] text-xl">
            {playlist.name}
          </h1>
          <p className="text-sm text-[var(--text-secondary)] mt-1 line-clamp-2">
            {playlist.description || 'No description'}
          </p>
          <p className="text-xs text-[var(--text-secondary)] mt-2">
            {videoIds.length} video{videoIds.length !== 1 ? 's' : ''}
          </p>
        </div>
        <div className="flex items-center gap-2">
          {editingName ? (
            <>
              <input
                type="text"
                value={editingName}
                onChange={(e) => setEditingName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleRename()
                  if (e.key === 'Escape') setEditingName('')
                }}
                className="w-full rounded-lg border border-[var(--border-color)] bg-[var(--bg-base)] px-3 py-1.5 text-sm text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
                autoFocus
              />
              <div className="flex items-center gap-1 mt-2">
                <button
                  type="button"
                  onClick={handleRename}
                  className="text-xs font-medium text-[var(--accent)] hover:underline"
                >
                  Save
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setEditingName(playlist.name)
                  }}
                  className="text-xs font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] underline ml-2"
                >
                  Cancel
                </button>
              </div>
            </>
          ) : (
            <button
              type="button"
              onClick={() => setEditingName(playlist.name)}
              className="text-xs font-medium text-[var(--text-secondary)] hover:text-[var(--accent)] underline"
            >
              Edit
            </button>
          )}
          <button
            type="button"
            onClick={handleDelete}
            className="text-xs font-medium text-[var(--text-secondary)] hover:text-[var(--danger)] underline"
          >
            Delete
          </button>
          <button
            type="button"
            onClick={handlePlayAll}
            className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium text-white bg-[var(--accent)] hover:bg-[var(--accent-hover)] transition-colors"
          >
            <Play className="w-3.5 h-3.5" />
            <span>Play all</span>
          </button>
        </div>
      </div>

      <div role="feed" aria-label="Playlist videos" className="flex flex-col gap-1">
        {videoIds.map((id, index) => {
          const video = videosById[id]
          const isLoadingVideo = videosLoading && !video
          return (
            <div
              key={id}
              className="flex gap-3 items-center p-3 rounded-xl border border-[var(--border-color)] bg-[var(--bg-surface)] hover:bg-[var(--bg-surface-elevated)] transition-colors group"
            >
              <div
                className={`relative shrink-0 w-[160px] h-[90px] rounded-lg overflow-hidden bg-[var(--bg-surface-elevated)] flex-shrink-0 ${isLoadingVideo ? 'animate-pulse' : ''}`}
              >
                <img
                  src={video ? video.thumbnail : `https://picsum.photos/seed/${id}/160/90`}
                  alt={video ? video.title : 'Video'}
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-cover"
                />
                {video && (
                  <span
                    className="absolute bottom-1 right-1 px-1.5 py-0.5 rounded-md text-xs font-semibold bg-black/85 text-white"
                  >
                    {formatDuration(video.duration)}
                  </span>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <LinkToVideo
                  id={id}
                  title={video ? video.title : 'Unknown video'}
                  channelName={video ? 'Creator' : ''}
                  views={video ? video.views : 0}
                  publishedAt={video ? video.publishedAt : new Date().toISOString()}
                />
                {isLoadingVideo && (
                  <p className="text-xs text-[var(--text-secondary)] mt-0.5 animate-pulse">
                    Loading…
                  </p>
                )}
              </div>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => handleMove(id, index, Math.max(0, index - 1))}
                  disabled={index === 0}
                  aria-label="Move up"
                  className={`p-1.5 rounded text-xs transition-colors disabled:opacity-50 ${
                    index === 0
                      ? 'text-[var(--text-secondary)]'
                      : 'text-[var(--text-primary)] hover:bg-[var(--bg-surface-elevated)]'
                  }`}
                >
                  <ArrowUp className="w-3 h-3" />
                </button>
                <button
                  type="button"
                  onClick={() => handleMove(id, index, Math.min(videoIds.length - 1, index + 1))}
                  disabled={index === videoIds.length - 1}
                  aria-label="Move down"
                  className={`p-1.5 rounded text-xs transition-colors disabled:opacity-50 ${
                    index === videoIds.length - 1
                      ? 'text-[var(--text-secondary)]'
                      : 'text-[var(--text-primary)] hover:bg-[var(--bg-surface-elevated)]'
                  }`}
                >
                  <ArrowDown className="w-3 h-3" />
                </button>
                <button
                  type="button"
                  onClick={() => handleRemove(id)}
                  className="p-1.5 text-[var(--text-secondary)] hover:text-[var(--danger)] hover:bg-[var(--bg-surface-elevated)] rounded transition-colors"
                  aria-label="Remove from playlist"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

PlaylistDetail.propTypes = {}

function LinkToVideo({ id, title, channelName, views, publishedAt }) {
  return (
    <a
      href={`/watch/${id}`}
      className="flex flex-col gap-0.5"
      aria-label={`Watch ${title}`}
    >
      <h3 className="font-semibold text-sm leading-snug text-[var(--text-primary)] line-clamp-2">
        {title}
      </h3>
      <p className="text-xs text-[var(--text-secondary)] mt-0.5 flex items-center gap-1">
        <span>{channelName}</span>
        <span>•</span>
        <span>{views ? Math.floor(views / 1000) + 'K views' : '0 views'}</span>
        <span>•</span>
        <span>{formatRelativeTime(publishedAt)}</span>
      </p>
    </a>
  )
}

LinkToVideo.propTypes = {
  id: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  channelName: PropTypes.string,
  views: PropTypes.number,
  publishedAt: PropTypes.string,
}

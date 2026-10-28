import { useState, useCallback } from 'react'
import PropTypes from 'prop-types'
import { Check, Plus } from 'lucide-react'
import { usePlaylistStore } from '@/store'
import { Modal } from '@/components/common'
import CreatePlaylistForm from './CreatePlaylistForm'

/**
 * Add-to-playlist modal: list of existing playlists with checkboxes (checked
 * if the video is already in the playlist), an inline create-new playlist
 * form, and public/private toggle for new playlists. On select, adds the
 * video to checked playlists and closes.
 */
export default function AddToPlaylistModal({
  isOpen,
  onClose,
  videoId,
  onAdded,
}) {
  const {
    playlists,
    addVideoToPlaylist,
    isVideoInPlaylist,
  } = usePlaylistStore()

  const [checkedIds, setCheckedIds] = useState(new Set())
  const [showCreate, setShowCreate] = useState(false)
  const [adding, setAdding] = useState(false)

  const togglePlaylist = useCallback(
    (id) => {
      setCheckedIds((prev) => {
        const next = new Set(prev)
        if (next.has(id)) next.delete(id)
        else next.add(id)
        return next
      })
    },
    []
  )

  const handleAdd = useCallback(async () => {
    if (checkedIds.size === 0) return
    setAdding(true)
    try {
      checkedIds.forEach((pid) => addVideoToPlaylist(pid, videoId))
      onAdded?.()
      setCheckedIds(new Set())
      onClose()
    } finally {
      setAdding(false)
    }
  }, [checkedIds, videoId, addVideoToPlaylist, onAdded, onClose])

  const handleCreate = (playlist) => {
    addVideoToPlaylist(playlist.id, videoId)
    setShowCreate(false)
    onAdded?.()
    onClose()
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add to playlist" size="lg">
      <div className="space-y-4">
        <p className="text-sm text-[var(--text-secondary)]">
          Select playlists to save this video to:
        </p>

        <div className="border border-[var(--border-color)] rounded-xl bg-[var(--bg-base)] overflow-hidden">
          {playlists.length > 0 ? (
            playlists.map((playlist) => {
              const alreadyIn = isVideoInPlaylist(playlist.id, videoId)
              const isChecked = checkedIds.has(playlist.id) || alreadyIn
              return (
                <button
                  key={playlist.id}
                  type="button"
                  onClick={() => togglePlaylist(playlist.id)}
                  className="w-full flex items-center justify-between px-4 py-3 border-b border-[var(--border-color)] last:border-0 hover:bg-[var(--bg-surface-elevated)] transition-colors"
                  aria-checked={isChecked}
                  role="checkbox"
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={isChecked}
                      readOnly
                      className="rounded border-[var(--border-color)] text-[var(--accent)] focus:ring-[var(--accent)]"
                      aria-label={playlist.name}
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-[var(--text-primary)] truncate">
                        {playlist.name}
                      </p>
                      <p className="text-xs text-[var(--text-secondary)] truncate">
                        {playlist.videoIds.length} video{playlist.videoIds.length !== 1 ? 's' : ''}
                      </p>
                    </div>
                    {isChecked ? (
                      <Check className="w-4 h-4 text-[var(--accent)]" />
                    ) : (
                      <svg
                        className="w-4 h-4 text-[var(--text-secondary)]"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <circle cx="12" cy="12" r="1" strokeWidth="2.5" />
                      </svg>
                    )}
                  </div>
                </button>
              )
            })
          ) : (
            <div className="px-4 py-4 text-center text-sm text-[var(--text-secondary)]">
              No playlists yet. Create one below.
            </div>
          )}
        </div>

        <div className="flex items-center gap-2 pt-2">
          <button
            type="button"
            onClick={() => setShowCreate((prev) => !prev)}
            className="flex items-center gap-1.5 text-xs font-medium text-[var(--accent)] hover:underline"
          >
            <Plus className="w-3 h-3" />
            <span>{showCreate ? 'Cancel' : 'Create new playlist'}</span>
          </button>
        </div>

        {showCreate && (
          <CreatePlaylistForm
            onCreate={handleCreate}
            onCancel={() => setShowCreate(false)}
          />
        )}

        <div className="border-t border-[var(--border-color)] pt-3">
          <button
            type="button"
            onClick={handleAdd}
            disabled={adding || checkedIds.size === 0}
            className="w-full px-4 py-2 rounded-lg text-xs font-medium text-white bg-[var(--accent)] hover:bg-[var(--accent-hover)] disabled:opacity-50 transition-colors"
          >
            {adding ? 'Adding…' : `Add to ${checkedIds.size} playlist${checkedIds.size !== 1 ? 's' : ''}`}
          </button>
        </div>
      </div>
    </Modal>
  )
}

AddToPlaylistModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  videoId: PropTypes.string.isRequired,
  onAdded: PropTypes.func,
}

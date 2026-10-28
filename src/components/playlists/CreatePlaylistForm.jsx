import { useState } from 'react'
import PropTypes from 'prop-types'
import { usePlaylistStore } from '@/store'

/**
 * Inline create-playlist form: name (required), description, public/private
 * toggle. On submit calls store.createPlaylist and invokes onCreate.
 */
export default function CreatePlaylistForm({ onCreate, onCancel }) {
  const { createPlaylist } = usePlaylistStore()
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [isPublic, setIsPublic] = useState(false)
  const [creating, setCreating] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!name.trim()) return
    setCreating(true)
    try {
      const playlist = createPlaylist({ name, description, isPublic })
      onCreate?.(playlist)
    } finally {
      setCreating(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
      <div>
        <label
          htmlFor="playlist-name"
          className="block text-xs font-medium text-[var(--text-secondary)] mb-1"
        >
          Playlist name
        </label>
        <input
          id="playlist-name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="My playlist"
          className="w-full rounded-lg border border-[var(--border-color)] bg-[var(--bg-base)] px-3 py-2 text-sm text-[var(--text-primary)] placeholder-[var(--text-secondary)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)] disabled:opacity-50"
          disabled={creating}
          autoFocus
        />
      </div>
      <div>
        <label
          htmlFor="playlist-description"
          className="block text-xs font-medium text-[var(--text-secondary)] mb-1"
        >
          Description (optional)
        </label>
        <textarea
          id="playlist-description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="What is this playlist about?"
          rows={2}
          className="w-full rounded-lg border border-[var(--border-color)] bg-[var(--bg-base)] px-3 py-2 text-sm text-[var(--text-primary)] placeholder-[var(--text-secondary)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)] disabled:opacity-50"
          disabled={creating}
        />
      </div>
      <div className="flex items-center gap-2">
        <input
          id="playlist-public"
          type="checkbox"
          checked={isPublic}
          onChange={(e) => setIsPublic(e.target.checked)}
          disabled={creating}
          className="rounded border-[var(--border-color)] bg-[var(--bg-base)] text-[var(--accent)] focus:ring-[var(--accent)]"
        />
        <label
          htmlFor="playlist-public"
          className="text-sm text-[var(--text-primary)] cursor-pointer disabled:opacity-50"
        >
          Public playlist
        </label>
      </div>
      <div className="flex justify-end gap-2 pt-2">
        <button
          type="button"
          onClick={onCancel}
          disabled={creating}
          className="px-3 py-1.5 rounded text-xs font-medium text-[var(--text-secondary)] hover:bg-[var(--bg-surface-elevated)] transition-colors disabled:opacity-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={creating || !name.trim()}
          className="px-3 py-1.5 rounded text-xs font-medium text-white bg-[var(--accent)] hover:bg-[var(--accent-hover)] transition-colors disabled:opacity-50"
        >
          {creating ? 'Creating…' : 'Create'}
        </button>
      </div>
    </form>
  )
}

CreatePlaylistForm.propTypes = {
  onCreate: PropTypes.func,
  onCancel: PropTypes.func,
}

import { useState } from 'react'
import { Plus } from 'lucide-react'
import { usePlaylistStore } from '@/store'
import { EmptyState, Button } from '@/components/common'
import { PlaylistCard, AddToPlaylistModal } from '@/components/playlists'

/**
 * Playlists page: grid of playlist cards (collage thumbnail, video count,
 * public/private badge) plus a "Create playlist" button and an inline
 * AddToPlaylistModal for adding videos to playlists.
 */
export default function Playlists() {
  const { playlists } = usePlaylistStore()
  const [addModalOpen, setAddModalOpen] = useState(false)
  const [selectedVideoId, setSelectedVideoId] = useState(null)

  if (playlists.length === 0) {
    return (
      <div className="py-16">
        <EmptyState
          icon={<Plus className="w-8 h-8 text-[var(--text-secondary)]" />}
          title="No playlists yet"
          description="Create your first playlist to save and organize videos."
          action={
            <Button
              onClick={() => setAddModalOpen(true)}
              variant="primary"
              startIcon={<Plus className="w-4 h-4" />}
            >
              Create playlist
            </Button>
          }
        />
        <AddToPlaylistModal
          isOpen={addModalOpen}
          onClose={() => setAddModalOpen(false)}
          videoId={selectedVideoId}
        />
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6 w-full pb-8">
      <div className="flex items-center justify-between">
        <h1 className="font-bold text-[var(--text-primary)] text-xl">
          Playlists
        </h1>
        <Button
          onClick={() => setAddModalOpen(true)}
          variant="outline"
          startIcon={<Plus className="w-4 h-4" />}
        >
          Create playlist
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-x-4 gap-y-6">
        {playlists.map((playlist) => (
          <PlaylistCard key={playlist.id} playlist={playlist} />
        ))}
      </div>

      <AddToPlaylistModal
        isOpen={addModalOpen}
        onClose={() => {
          setAddModalOpen(false)
          setSelectedVideoId(null)
        }}
        videoId={selectedVideoId}
      />
    </div>
  )
}

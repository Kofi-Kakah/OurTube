import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { initialPlaylists } from '@/data'

export const usePlaylistStore = create(
  persist(
    (set, get) => ({
      playlists: initialPlaylists,

      createPlaylist: ({ name, description = '', isPublic = false }) => {
        const id = `pl-${Date.now()}`
        const newPlaylist = {
          id,
          name: name.trim(),
          description: description.trim(),
          videoIds: [],
          createdAt: new Date().toISOString(),
          isPublic,
        }

        set((state) => ({
          playlists: [...state.playlists, newPlaylist],
        }))

        return newPlaylist
      },

      deletePlaylist: (playlistId) => {
        set((state) => ({
          playlists: state.playlists.filter((p) => p.id !== playlistId),
        }))
      },

      updatePlaylist: (playlistId, updates) => {
        set((state) => ({
          playlists: state.playlists.map((p) =>
            p.id === playlistId ? { ...p, ...updates } : p
          ),
        }))
      },

      addVideoToPlaylist: (playlistId, videoId) => {
        set((state) => ({
          playlists: state.playlists.map((p) => {
            if (p.id !== playlistId) return p
            if (p.videoIds.includes(videoId)) return p
            return { ...p, videoIds: [...p.videoIds, videoId] }
          }),
        }))
      },

      removeVideoFromPlaylist: (playlistId, videoId) => {
        set((state) => ({
          playlists: state.playlists.map((p) => {
            if (p.id !== playlistId) return p
            return {
              ...p,
              videoIds: p.videoIds.filter((id) => id !== videoId),
            }
          }),
        }))
      },

      reorderPlaylist: (playlistId, startIndex, endIndex) => {
        set((state) => ({
          playlists: state.playlists.map((p) => {
            if (p.id !== playlistId) return p
            const nextVideoIds = [...p.videoIds]
            const [movedItem] = nextVideoIds.splice(startIndex, 1)
            nextVideoIds.splice(endIndex, 0, movedItem)
            return { ...p, videoIds: nextVideoIds }
          }),
        }))
      },

      isVideoInPlaylist: (playlistId, videoId) => {
        const playlist = get().playlists.find((p) => p.id === playlistId)
        return Boolean(playlist?.videoIds.includes(videoId))
      },
    }),
    {
      name: 'ourtube-playlist-storage',
    }
  )
)

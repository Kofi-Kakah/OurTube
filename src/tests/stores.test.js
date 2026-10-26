import { describe, it, expect, beforeEach } from 'vitest'
import { useUserStore, useHistoryStore, usePlaylistStore } from '@/store'

describe('Zustand Stores', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  describe('useUserStore', () => {
    it('manages channel subscriptions', () => {
      const channelId = 'ch-test-1'
      expect(useUserStore.getState().isSubscribed(channelId)).toBe(false)

      useUserStore.getState().subscribe(channelId)
      expect(useUserStore.getState().isSubscribed(channelId)).toBe(true)

      useUserStore.getState().toggleSubscribe(channelId)
      expect(useUserStore.getState().isSubscribed(channelId)).toBe(false)
    })

    it('manages like and dislike mutual exclusivity', () => {
      const videoId = 'vid-test-1'
      useUserStore.getState().likeVideo(videoId)
      expect(useUserStore.getState().getVideoReaction(videoId)).toBe('like')

      // Disliking should switch reaction from like to dislike
      useUserStore.getState().dislikeVideo(videoId)
      expect(useUserStore.getState().getVideoReaction(videoId)).toBe('dislike')
      expect(useUserStore.getState().likedVideoIds).not.toContain(videoId)

      // Removing dislike
      useUserStore.getState().removeDislike(videoId)
      expect(useUserStore.getState().getVideoReaction(videoId)).toBeNull()
    })

    it('updates user profile information', () => {
      useUserStore.getState().updateProfile({ name: 'Alex Updated' })
      expect(useUserStore.getState().user.name).toBe('Alex Updated')
    })
  })

  describe('useHistoryStore', () => {
    beforeEach(() => {
      useHistoryStore.setState({ entries: [], isPaused: false })
    })

    it('adds entry and records watch progress', () => {
      useHistoryStore.getState().addEntry({
        videoId: 'vid-hist-1',
        progressSeconds: 120,
        durationSeconds: 600,
      })

      const progress = useHistoryStore.getState().getProgress('vid-hist-1')
      expect(progress).not.toBeNull()
      expect(progress.progressSeconds).toBe(120)
      expect(progress.percentage).toBe(20)
    })

    it('resets progress when watched over 95%', () => {
      useHistoryStore.getState().updateProgress('vid-hist-2', 580, 600) // ~96.6%
      const progress = useHistoryStore.getState().getProgress('vid-hist-2')
      expect(progress).toBeNull() // Progress reset because it is completed
    })

    it('does not record when history is paused', () => {
      useHistoryStore.getState().togglePauseHistory()
      expect(useHistoryStore.getState().isPaused).toBe(true)

      useHistoryStore.getState().addEntry({ videoId: 'vid-paused-test' })
      expect(
        useHistoryStore
          .getState()
          .entries.some((e) => e.videoId === 'vid-paused-test')
      ).toBe(false)
    })

    it('removes entry and clears history', () => {
      useHistoryStore.setState({ isPaused: false })
      useHistoryStore.getState().addEntry({ videoId: 'vid-remove-1' })
      useHistoryStore.getState().removeEntry('vid-remove-1')
      expect(useHistoryStore.getState().entries).toHaveLength(0)

      useHistoryStore.getState().addEntry({ videoId: 'vid-clear-1' })
      useHistoryStore.getState().clearHistory()
      expect(useHistoryStore.getState().entries).toHaveLength(0)
    })
  })

  describe('usePlaylistStore', () => {
    it('creates new playlist and manages videos', () => {
      const newPl = usePlaylistStore.getState().createPlaylist({
        name: 'My Best Tracks',
        description: 'Favorites',
      })

      expect(newPl.id).toBeDefined()
      expect(newPl.name).toBe('My Best Tracks')

      usePlaylistStore.getState().addVideoToPlaylist(newPl.id, 'vid-10')
      expect(
        usePlaylistStore.getState().isVideoInPlaylist(newPl.id, 'vid-10')
      ).toBe(true)

      usePlaylistStore.getState().removeVideoFromPlaylist(newPl.id, 'vid-10')
      expect(
        usePlaylistStore.getState().isVideoInPlaylist(newPl.id, 'vid-10')
      ).toBe(false)
    })

    it('reorders videos in playlist', () => {
      const pl = usePlaylistStore
        .getState()
        .createPlaylist({ name: 'Reorder Test' })
      usePlaylistStore.getState().addVideoToPlaylist(pl.id, 'v1')
      usePlaylistStore.getState().addVideoToPlaylist(pl.id, 'v2')
      usePlaylistStore.getState().addVideoToPlaylist(pl.id, 'v3')

      usePlaylistStore.getState().reorderPlaylist(pl.id, 0, 2)
      const updated = usePlaylistStore
        .getState()
        .playlists.find((p) => p.id === pl.id)
      expect(updated.videoIds).toEqual(['v2', 'v3', 'v1'])
    })

    it('deletes playlist', () => {
      const pl = usePlaylistStore
        .getState()
        .createPlaylist({ name: 'To Delete' })
      usePlaylistStore.getState().deletePlaylist(pl.id)
      const found = usePlaylistStore
        .getState()
        .playlists.find((p) => p.id === pl.id)
      expect(found).toBeUndefined()
    })
  })
})

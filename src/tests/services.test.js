import { describe, it, expect } from 'vitest'
import {
  getVideos,
  getVideoById,
  searchVideos,
  getRecommended,
  getCategories,
  getChannels,
  getChannelById,
  getComments,
  addComment,
  deleteComment,
  likeComment,
} from '@/services'

describe('Mock API Services', () => {
  describe('videosApi', () => {
    it('returns paginated videos with correct structure', async () => {
      const result = await getVideos({ page: 1, limit: 10 })
      expect(result).toHaveProperty('items')
      expect(result).toHaveProperty('page', 1)
      expect(result).toHaveProperty('hasMore', true)
      expect(result).toHaveProperty('total')
      expect(result.items.length).toBe(10)
    })

    it('filters videos by category', async () => {
      const result = await getVideos({ category: 'Gaming', limit: 20 })
      expect(result.items.length).toBeGreaterThan(0)
      result.items.forEach((video) => {
        expect(video.category).toBe('Gaming')
      })
    })

    it('fetches a single video by ID', async () => {
      const video = await getVideoById('vid-1')
      expect(video).not.toBeNull()
      expect(video.id).toBe('vid-1')
      expect(video.title).toBeDefined()
    })

    it('returns null for non-existent video ID', async () => {
      const video = await getVideoById('vid-does-not-exist')
      expect(video).toBeNull()
    })

    it('searches videos by query keyword', async () => {
      const result = await searchVideos({ q: 'React' })
      expect(result.items.length).toBeGreaterThan(0)
      const matches = result.items.some(
        (v) =>
          v.title.toLowerCase().includes('react') || v.tags.includes('react')
      )
      expect(matches).toBe(true)
    })

    it('returns recommended videos excluding the current video', async () => {
      const result = await getRecommended('vid-1', { limit: 5 })
      expect(result.items.length).toBe(5)
      expect(result.items.every((v) => v.id !== 'vid-1')).toBe(true)
    })

    it('returns categories list', async () => {
      const cats = await getCategories()
      expect(cats.length).toBeGreaterThanOrEqual(10)
      expect(cats).toContain('All')
    })
  })

  describe('channelsApi', () => {
    it('returns all channels', async () => {
      const channelsList = await getChannels()
      expect(channelsList.length).toBeGreaterThanOrEqual(12)
    })

    it('returns channel by ID', async () => {
      const channel = await getChannelById('ch-1')
      expect(channel).not.toBeNull()
      expect(channel.id).toBe('ch-1')
      expect(channel.name).toBe('TechLead Daily')
    })
  })

  describe('commentsApi', () => {
    it('fetches comments for a video', async () => {
      const result = await getComments('vid-1')
      expect(result.items.length).toBeGreaterThan(0)
    })

    it('adds a new comment and retrieves it', async () => {
      const newComment = await addComment({
        videoId: 'vid-99',
        userId: 'usr-1',
        userName: 'Alex Creator',
        userAvatar: '',
        text: 'Unit test comment',
      })

      expect(newComment.id).toBeDefined()
      expect(newComment.text).toBe('Unit test comment')

      const result = await getComments('vid-99')
      expect(result.items.some((c) => c.id === newComment.id)).toBe(true)
    })

    it('likes a comment', async () => {
      const result = await getComments('vid-1')
      const targetComment = result.items[0]
      const initialLikes = targetComment.likesCount

      const updated = await likeComment(targetComment.id, true)
      expect(updated.likesCount).toBe(initialLikes + 1)
    })

    it('deletes a comment', async () => {
      const newComment = await addComment({
        videoId: 'vid-temp',
        userId: 'usr-1',
        userName: 'Alex',
        text: 'Temporary comment',
      })

      await deleteComment(newComment.id)
      const result = await getComments('vid-temp')
      expect(result.items.some((c) => c.id === newComment.id)).toBe(false)
    })
  })
})

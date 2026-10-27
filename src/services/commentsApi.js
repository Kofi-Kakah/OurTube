import { comments as initialComments } from '@/data'
import { simulateNetwork, paginate } from './apiClient'

const STORAGE_KEY = 'ourtube-comments'

const loadComments = () => {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (raw) return JSON.parse(raw)
  } catch {
    // Ignore localStorage read errors; fall back to mock data.
  }
  return [...initialComments]
}

const saveComments = () => {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(commentsStore))
  } catch {
    // Ignore localStorage write errors (e.g. quota exceeded).
  }
}

// In-memory comments store seeded from mock data and persisted to localStorage
let commentsStore = loadComments()

/**
 * Fetches comments for a specific video
 */
export async function getComments(
  videoId,
  { page = 1, limit = 10, sortBy = 'top', simulateError = false } = {}
) {
  await simulateNetwork({ forceError: simulateError })

  let videoComments = commentsStore.filter((c) => c.videoId === videoId)

  if (sortBy === 'top') {
    videoComments.sort((a, b) => b.likesCount - a.likesCount)
  } else if (sortBy === 'newest') {
    videoComments.sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )
  }

  return paginate(videoComments, page, limit)
}

/**
 * Adds a new comment or reply
 */
export async function addComment({
  videoId,
  userId,
  userName,
  userAvatar,
  text,
  parentId = null,
}) {
  await simulateNetwork({ minMs: 150, maxMs: 350 })

  const newComment = {
    id: `cmt-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    videoId,
    userId,
    userName,
    userAvatar,
    text,
    createdAt: new Date().toISOString(),
    likesCount: 0,
    parentId,
  }

  commentsStore.unshift(newComment)
  saveComments()
  return { ...newComment }
}

/**
 * Deletes a comment by ID
 */
export async function deleteComment(commentId) {
  await simulateNetwork({ minMs: 150, maxMs: 300 })
  commentsStore = commentsStore.filter(
    (c) => c.id !== commentId && c.parentId !== commentId
  )
  saveComments()
  return { success: true }
}

/**
 * Likes or unlikes a comment
 */
export async function likeComment(commentId, increment = true) {
  await simulateNetwork({ minMs: 100, maxMs: 250 })
  const comment = commentsStore.find((c) => c.id === commentId)
  if (comment) {
    comment.likesCount = Math.max(0, comment.likesCount + (increment ? 1 : -1))
    saveComments()
    return { ...comment }
  }
  return null
}

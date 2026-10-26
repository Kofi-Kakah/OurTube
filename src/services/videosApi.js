import { videos, categories } from '@/data'
import { simulateNetwork, paginate } from './apiClient'

/**
 * Fetches videos with optional category filter, sorting, and pagination
 */
export async function getVideos({
  page = 1,
  limit = 12,
  category = 'All',
  sort = 'newest',
  simulateError = false,
} = {}) {
  await simulateNetwork({ forceError: simulateError })

  let filtered = [...videos]

  if (category && category !== 'All') {
    filtered = filtered.filter(
      (v) => v.category.toLowerCase() === category.toLowerCase()
    )
  }

  if (sort === 'popular') {
    filtered.sort((a, b) => b.views - a.views)
  } else if (sort === 'newest') {
    filtered.sort(
      (a, b) =>
        new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
    )
  }

  return paginate(filtered, page, limit)
}

/**
 * Fetches a single video by ID
 */
export async function getVideoById(id, { simulateError = false } = {}) {
  await simulateNetwork({ forceError: simulateError })
  const video = videos.find((v) => v.id === id)
  if (!video) {
    return null
  }
  return { ...video }
}

/**
 * Searches videos by query, category, duration, uploadDate, and sorting
 */
export async function searchVideos({
  q = '',
  page = 1,
  limit = 12,
  category = 'All',
  sort = 'relevance',
  duration = 'all', // 'all' | 'short' (<4m) | 'medium' (4-20m) | 'long' (>20m)
  uploadDate = 'all', // 'all' | 'hour' | 'today' | 'week' | 'month' | 'year'
  simulateError = false,
} = {}) {
  await simulateNetwork({ forceError: simulateError })

  const query = q.trim().toLowerCase()
  let filtered = [...videos]

  if (query) {
    filtered = filtered.filter((v) => {
      const matchTitle = v.title.toLowerCase().includes(query)
      const matchDesc = v.description.toLowerCase().includes(query)
      const matchTag = v.tags.some((tag) => tag.toLowerCase().includes(query))
      return matchTitle || matchDesc || matchTag
    })
  }

  if (category && category !== 'All') {
    filtered = filtered.filter(
      (v) => v.category.toLowerCase() === category.toLowerCase()
    )
  }

  if (duration === 'short') {
    filtered = filtered.filter((v) => v.duration < 240)
  } else if (duration === 'medium') {
    filtered = filtered.filter((v) => v.duration >= 240 && v.duration <= 1200)
  } else if (duration === 'long') {
    filtered = filtered.filter((v) => v.duration > 1200)
  }

  if (uploadDate !== 'all') {
    const now = Date.now()
    const msInHour = 3600 * 1000
    const msInDay = msInHour * 24

    filtered = filtered.filter((v) => {
      const videoTime = new Date(v.publishedAt).getTime()
      const diff = now - videoTime
      if (uploadDate === 'hour') return diff <= msInHour
      if (uploadDate === 'today') return diff <= msInDay
      if (uploadDate === 'week') return diff <= msInDay * 7
      if (uploadDate === 'month') return diff <= msInDay * 30
      if (uploadDate === 'year') return diff <= msInDay * 365
      return true
    })
  }

  if (sort === 'views') {
    filtered.sort((a, b) => b.views - a.views)
  } else if (sort === 'date') {
    filtered.sort(
      (a, b) =>
        new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
    )
  }

  return paginate(filtered, page, limit)
}

/**
 * Gets recommended videos for a given video ID
 */
export async function getRecommended(
  videoId,
  { page = 1, limit = 10, simulateError = false } = {}
) {
  await simulateNetwork({ forceError: simulateError })

  const currentVideo = videos.find((v) => v.id === videoId)
  let recommendations = videos.filter((v) => v.id !== videoId)

  if (currentVideo) {
    recommendations.sort((a, b) => {
      const aSameCategory = a.category === currentVideo.category ? 2 : 0
      const bSameCategory = b.category === currentVideo.category ? 2 : 0

      const aSharedTags = a.tags.filter((t) =>
        currentVideo.tags.includes(t)
      ).length
      const bSharedTags = b.tags.filter((t) =>
        currentVideo.tags.includes(t)
      ).length

      const aScore = aSameCategory + aSharedTags
      const bScore = bSameCategory + bSharedTags

      return bScore - aScore
    })
  }

  return paginate(recommendations, page, limit)
}

/**
 * Fetches category list
 */
export async function getCategories() {
  await simulateNetwork({ minMs: 50, maxMs: 150 })
  return [...categories]
}

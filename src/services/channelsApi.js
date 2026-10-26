import { channels, videos } from '@/data'
import { simulateNetwork, paginate } from './apiClient'

/**
 * Fetches all channels
 */
export async function getChannels({ simulateError = false } = {}) {
  await simulateNetwork({ forceError: simulateError })
  return [...channels]
}

/**
 * Fetches a single channel by ID
 */
export async function getChannelById(
  channelId,
  { simulateError = false } = {}
) {
  await simulateNetwork({ forceError: simulateError })
  const channel = channels.find((c) => c.id === channelId)
  if (!channel) return null
  return { ...channel }
}

/**
 * Fetches videos published by a specific channel
 */
export async function getChannelVideos(
  channelId,
  { page = 1, limit = 12, simulateError = false } = {}
) {
  await simulateNetwork({ forceError: simulateError })
  const channelVideos = videos.filter((v) => v.channelId === channelId)
  return paginate(channelVideos, page, limit)
}

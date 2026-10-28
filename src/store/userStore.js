import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { mockUser } from '@/data'

export const useUserStore = create(
  persist(
    (set, get) => ({
      user: mockUser,
      subscriptions: ['ch-1', 'ch-2', 'ch-9'], // Initial subscribed channels
      likedVideoIds: ['vid-1', 'vid-12', 'vid-17'], // Initial liked videos
      dislikedVideoIds: [],
      autoplayDefault: true,
      defaultPlaybackSpeed: 1,
      defaultQuality: 'auto',

      subscribe: (channelId) => {
        set((state) => {
          if (state.subscriptions.includes(channelId)) return state
          return { subscriptions: [...state.subscriptions, channelId] }
        })
      },

      unsubscribe: (channelId) => {
        set((state) => ({
          subscriptions: state.subscriptions.filter((id) => id !== channelId),
        }))
      },

      toggleSubscribe: (channelId) => {
        const isSubscribed = get().subscriptions.includes(channelId)
        if (isSubscribed) {
          get().unsubscribe(channelId)
        } else {
          get().subscribe(channelId)
        }
        return !isSubscribed
      },

      isSubscribed: (channelId) => get().subscriptions.includes(channelId),

      likeVideo: (videoId) => {
        set((state) => {
          const isLiked = state.likedVideoIds.includes(videoId)
          const newLiked = isLiked
            ? state.likedVideoIds.filter((id) => id !== videoId)
            : [videoId, ...state.likedVideoIds]
          const newDisliked = state.dislikedVideoIds.filter(
            (id) => id !== videoId
          )

          return {
            likedVideoIds: newLiked,
            dislikedVideoIds: newDisliked,
          }
        })
      },

      dislikeVideo: (videoId) => {
        set((state) => {
          const isDisliked = state.dislikedVideoIds.includes(videoId)
          const newDisliked = isDisliked
            ? state.dislikedVideoIds.filter((id) => id !== videoId)
            : [videoId, ...state.dislikedVideoIds]
          const newLiked = state.likedVideoIds.filter((id) => id !== videoId)

          return {
            likedVideoIds: newLiked,
            dislikedVideoIds: newDisliked,
          }
        })
      },

      removeLike: (videoId) => {
        set((state) => ({
          likedVideoIds: state.likedVideoIds.filter((id) => id !== videoId),
        }))
      },

      removeDislike: (videoId) => {
        set((state) => ({
          dislikedVideoIds: state.dislikedVideoIds.filter(
            (id) => id !== videoId
          ),
        }))
      },

      getVideoReaction: (videoId) => {
        if (get().likedVideoIds.includes(videoId)) return 'like'
        if (get().dislikedVideoIds.includes(videoId)) return 'dislike'
        return null
      },

      updateProfile: (profileUpdates) => {
        set((state) => ({
          user: { ...state.user, ...profileUpdates },
        }))
      },

      toggleAutoplay: () => {
        set((state) => ({ autoplayDefault: !state.autoplayDefault }))
      },

      setPlaybackSpeed: (speed) => {
        set({ defaultPlaybackSpeed: speed })
      },

      setDefaultQuality: (quality) => {
        set({ defaultQuality: quality })
      },
    }),
    {
      name: 'ourtube-user-storage',
    }
  )
)

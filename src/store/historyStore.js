import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const calculatePercentage = (progress, duration) => {
  if (!duration || !progress || progress <= 0) return 0
  return Math.min(100, Math.round((progress / duration) * 100))
}

export const useHistoryStore = create(
  persist(
    (set, get) => ({
      entries: [
        {
          videoId: 'vid-1',
          watchedAt: '2026-09-20T15:00:00Z',
          progressSeconds: 420,
          durationSeconds: 1425,
          percentage: 29,
        },
        {
          videoId: 'vid-12',
          watchedAt: '2026-09-19T22:00:00Z',
          progressSeconds: 1200,
          durationSeconds: 3600,
          percentage: 33,
        },
      ],
      isPaused: false,

      addEntry: ({ videoId, progressSeconds = 0, durationSeconds = 0 }) => {
        if (get().isPaused) return

        const watchedAt = new Date().toISOString()
        const percentage = calculatePercentage(progressSeconds, durationSeconds)

        set((state) => {
          const filtered = state.entries.filter((e) => e.videoId !== videoId)
          return {
            entries: [
              {
                videoId,
                watchedAt,
                progressSeconds,
                durationSeconds,
                percentage,
              },
              ...filtered,
            ],
          }
        })
      },

      updateProgress: (videoId, progressSeconds, durationSeconds) => {
        if (get().isPaused) return

        // If watched over 95%, reset progress (completed)
        const isCompleted =
          durationSeconds > 0 && progressSeconds / durationSeconds >= 0.95
        const effectiveProgress = isCompleted ? 0 : progressSeconds
        const percentage = calculatePercentage(
          effectiveProgress,
          durationSeconds
        )

        set((state) => {
          const existingIndex = state.entries.findIndex(
            (e) => e.videoId === videoId
          )
          const updatedEntry = {
            videoId,
            watchedAt: new Date().toISOString(),
            progressSeconds: effectiveProgress,
            durationSeconds: durationSeconds || 0,
            percentage,
          }

          if (existingIndex >= 0) {
            const nextEntries = [...state.entries]
            nextEntries[existingIndex] = updatedEntry
            return { entries: nextEntries }
          }

          return { entries: [updatedEntry, ...state.entries] }
        })
      },

      removeEntry: (videoId) => {
        set((state) => ({
          entries: state.entries.filter((e) => e.videoId !== videoId),
        }))
      },

      clearHistory: () => {
        set({ entries: [] })
      },

      togglePauseHistory: () => {
        set((state) => ({ isPaused: !state.isPaused }))
      },

      getProgress: (videoId) => {
        const entry = get().entries.find((e) => e.videoId === videoId)
        if (!entry || !entry.percentage || entry.percentage <= 0) {
          return null
        }
        return entry
      },
    }),
    {
      name: 'ourtube-history-storage',
    }
  )
)

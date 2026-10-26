import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const useHistoryStore = create(
  persist(
    (set, get) => ({
      entries: [
        {
          videoId: 'vid-1',
          watchedAt: '2026-09-20T15:00:00Z',
          progressSeconds: 420,
          durationSeconds: 1425,
        },
        {
          videoId: 'vid-12',
          watchedAt: '2026-09-19T22:00:00Z',
          progressSeconds: 1200,
          durationSeconds: 3600,
        },
      ],
      isPaused: false,

      addEntry: ({ videoId, progressSeconds = 0, durationSeconds = 0 }) => {
        if (get().isPaused) return

        const watchedAt = new Date().toISOString()
        set((state) => {
          const filtered = state.entries.filter((e) => e.videoId !== videoId)
          return {
            entries: [
              {
                videoId,
                watchedAt,
                progressSeconds,
                durationSeconds,
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

        set((state) => {
          const existingIndex = state.entries.findIndex(
            (e) => e.videoId === videoId
          )
          const updatedEntry = {
            videoId,
            watchedAt: new Date().toISOString(),
            progressSeconds: effectiveProgress,
            durationSeconds: durationSeconds || 0,
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
        if (!entry || !entry.durationSeconds || entry.progressSeconds <= 0) {
          return null
        }
        const percentage = Math.min(
          100,
          Math.round((entry.progressSeconds / entry.durationSeconds) * 100)
        )
        return {
          progressSeconds: entry.progressSeconds,
          durationSeconds: entry.durationSeconds,
          percentage,
        }
      },
    }),
    {
      name: 'ourtube-history-storage',
    }
  )
)

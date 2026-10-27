import { useCallback } from 'react'
import { useLocalStorage } from './useLocalStorage'

const MAX_RECENT = 10
const STORAGE_KEY = 'ourtube-recent-searches'

/**
 * Manages recent search queries persisted to localStorage.
 * Provides add (dedup, most-recent-first, capped), remove, and clear.
 * @returns {{ searches: string[], add: (query: string) => void, remove: (query: string) => void, clear: () => void }}
 */
export function useRecentSearches() {
  const [searches, setSearches] = useLocalStorage(STORAGE_KEY, [])

  const add = useCallback(
    (query) => {
      const trimmed = query.trim()
      if (!trimmed) return
      setSearches((prev) => {
        const filtered = prev.filter(
          (s) => s.toLowerCase() !== trimmed.toLowerCase()
        )
        return [trimmed, ...filtered].slice(0, MAX_RECENT)
      })
    },
    [setSearches]
  )

  const remove = useCallback(
    (query) => {
      setSearches((prev) =>
        prev.filter((s) => s.toLowerCase() !== query.toLowerCase())
      )
    },
    [setSearches]
  )

  const clear = useCallback(() => {
    setSearches([])
  }, [setSearches])

  return { searches, add, remove, clear }
}

export default useRecentSearches

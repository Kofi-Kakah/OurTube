import { useState, useEffect, useRef, useCallback } from 'react'

/**
 * Generic infinite scroll hook powered by IntersectionObserver
 * @template T
 * @param {Object} options
 * @param {(page: number, signal: AbortSignal) => Promise<{ items: T[], hasMore: boolean, total?: number }>} options.fetchFn
 * @param {Array<any>} [options.dependencies] Reset triggers (e.g. [category, query])
 * @param {number} [options.initialPage=1]
 * @param {string} [options.rootMargin='300px'] Pre-fetch margin before sentinel reaches viewport
 * @param {boolean} [options.enabled=true]
 * @param {(item: T) => string|number} [options.keyExtractor] Deduplication key extractor
 */
export function useInfiniteScroll({
  fetchFn,
  dependencies = [],
  initialPage = 1,
  rootMargin = '300px',
  enabled = true,
  keyExtractor = (item) => item?.id ?? item?.videoId,
}) {
  const [items, setItems] = useState([])
  const [page, setPage] = useState(initialPage)
  const [hasMore, setHasMore] = useState(true)
  const [isLoading, setIsLoading] = useState(true)
  const [isLoadingMore, setIsLoadingMore] = useState(false)
  const [error, setError] = useState(null)
  const [errorMore, setErrorMore] = useState(null)

  const sentinelRef = useRef(null)
  const activeRequestIdRef = useRef(0)
  const abortControllerRef = useRef(null)
  const isFetchingRef = useRef(false)

  // Deduplicate items based on keyExtractor
  const mergeUniqueItems = useCallback(
    (existingItems, newItems) => {
      const existingKeys = new Set(existingItems.map(keyExtractor))
      const uniqueNewItems = newItems.filter(
        (item) => !existingKeys.has(keyExtractor(item))
      )
      return [...existingItems, ...uniqueNewItems]
    },
    [keyExtractor]
  )

  // Fetch next page (page > 1)
  const fetchNextPage = useCallback(
    async (nextPage) => {
      if (isFetchingRef.current) return
      isFetchingRef.current = true

      const currentRequestId = activeRequestIdRef.current
      setIsLoadingMore(true)
      setErrorMore(null)

      try {
        const result = await fetchFn(nextPage)
        if (currentRequestId !== activeRequestIdRef.current) return

        const fetchedItems = Array.isArray(result?.items) ? result.items : []
        const fetchedHasMore = Boolean(result?.hasMore)

        setItems((prev) => mergeUniqueItems(prev, fetchedItems))
        setPage(nextPage)
        setHasMore(fetchedHasMore)
      } catch (err) {
        if (currentRequestId !== activeRequestIdRef.current) return
        setErrorMore(err?.message || 'Failed to load more content.')
      } finally {
        if (currentRequestId === activeRequestIdRef.current) {
          setIsLoadingMore(false)
          isFetchingRef.current = false
        }
      }
    },
    [fetchFn, mergeUniqueItems]
  )

  // Reset & fetch initial page when dependencies change
  useEffect(() => {
    let ignore = false
    const controller = new AbortController()
    abortControllerRef.current = controller
    const currentRequestId = ++activeRequestIdRef.current
    isFetchingRef.current = false

    Promise.resolve().then(async () => {
      if (ignore) return
      setIsLoading(true)
      setError(null)
      setErrorMore(null)

      try {
        const result = await fetchFn(initialPage, controller.signal)
        if (ignore || currentRequestId !== activeRequestIdRef.current) return

        const fetchedItems = Array.isArray(result?.items) ? result.items : []
        setItems(fetchedItems)
        setPage(initialPage)
        setHasMore(Boolean(result?.hasMore))
      } catch (err) {
        if (ignore || err.name === 'AbortError') return
        if (currentRequestId !== activeRequestIdRef.current) return

        setError(err?.message || 'Failed to load content. Please try again.')
      } finally {
        if (!ignore && currentRequestId === activeRequestIdRef.current) {
          setIsLoading(false)
        }
      }
    })

    return () => {
      ignore = true
      controller.abort()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, dependencies)

  // Setup IntersectionObserver on sentinel
  useEffect(() => {
    if (!enabled) return

    const sentinel = sentinelRef.current
    if (!sentinel) return

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries
        if (
          entry.isIntersecting &&
          hasMore &&
          !isLoading &&
          !isLoadingMore &&
          !errorMore &&
          !isFetchingRef.current
        ) {
          fetchNextPage(page + 1)
        }
      },
      {
        root: null,
        rootMargin,
        threshold: 0,
      }
    )

    observer.observe(sentinel)

    return () => {
      observer.disconnect()
    }
  }, [
    enabled,
    hasMore,
    isLoading,
    isLoadingMore,
    errorMore,
    page,
    rootMargin,
    fetchNextPage,
  ])

  // Retry action for initial failure or pagination failure
  const retry = useCallback(() => {
    if (error) {
      setIsLoading(true)
      setError(null)
      fetchFn(initialPage)
        .then((result) => {
          setItems(Array.isArray(result?.items) ? result.items : [])
          setPage(initialPage)
          setHasMore(Boolean(result?.hasMore))
        })
        .catch((err) => {
          setError(err?.message || 'Failed to load content. Please try again.')
        })
        .finally(() => {
          setIsLoading(false)
        })
    } else if (errorMore) {
      fetchNextPage(page + 1)
    }
  }, [error, errorMore, fetchFn, fetchNextPage, initialPage, page])

  const reset = useCallback(() => {
    setIsLoading(true)
    setError(null)
    fetchFn(initialPage)
      .then((result) => {
        setItems(Array.isArray(result?.items) ? result.items : [])
        setPage(initialPage)
        setHasMore(Boolean(result?.hasMore))
      })
      .catch((err) => {
        setError(err?.message || 'Failed to load content. Please try again.')
      })
      .finally(() => {
        setIsLoading(false)
      })
  }, [fetchFn, initialPage])

  return {
    items,
    setItems,
    page,
    hasMore,
    isLoading,
    isLoadingMore,
    error,
    errorMore,
    sentinelRef,
    retry,
    reset,
  }
}

export default useInfiniteScroll

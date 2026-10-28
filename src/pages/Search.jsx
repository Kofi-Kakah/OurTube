import { useCallback } from 'react'
import { useSearchParams } from 'react-router-dom'
import { searchVideos } from '@/services'
import { VideoListItem, VideoCardSkeleton } from '@/components/video'
import { EmptyState, Button, Spinner } from '@/components/common'
import { useInfiniteScroll, useScrollRestoration, usePageTitle } from '@/hooks'
import { AlertCircle, List } from 'lucide-react'

const DURATION_OPTIONS = [
  { value: 'all', label: 'Any duration' },
  { value: 'short', label: 'Under 4 min' },
  { value: 'medium', label: '4–20 min' },
  { value: 'long', label: 'Over 20 min' },
]

const UPLOAD_DATE_OPTIONS = [
  { value: 'all', label: 'Any time' },
  { value: 'hour', label: 'Past hour' },
  { value: 'today', label: 'Today' },
  { value: 'week', label: 'This week' },
  { value: 'month', label: 'This month' },
  { value: 'year', label: 'This year' },
]

const SORT_OPTIONS = [
  { value: 'relevance', label: 'Relevance' },
  { value: 'date', label: 'Upload date' },
  { value: 'views', label: 'View count' },
]

export default function Search() {
  const [searchParams, setSearchParams] = useSearchParams()

  const q = searchParams.get('q') || ''
  const sort = searchParams.get('sort') || 'relevance'
  const duration = searchParams.get('duration') || 'all'
  const uploadDate = searchParams.get('uploadDate') || 'all'

  usePageTitle(q ? `${q} — Search — OurTube` : 'Search — OurTube')

  const updateFilter = useCallback(
    (key, value) => {
      setSearchParams((prev) => {
        const next = new URLSearchParams(prev)
        next.set(key, value)
        next.delete('page')
        return next
      })
    },
    [setSearchParams]
  )

  const fetchSearchPage = useCallback(
    async (page) => {
      return searchVideos({
        q,
        page,
        limit: 10,
        sort,
        duration,
        uploadDate,
      })
    },
    [q, sort, duration, uploadDate]
  )

  const {
    items: videos,
    hasMore,
    isLoading,
    isLoadingMore,
    error,
    errorMore,
    sentinelRef,
    retry,
    reset,
  } = useInfiniteScroll({
    fetchFn: fetchSearchPage,
    dependencies: [q, sort, duration, uploadDate],
  })

  useScrollRestoration(!isLoading && videos.length > 0)

  const handleSortChange = (e) => updateFilter('sort', e.target.value)
  const handleDurationChange = (e) => updateFilter('duration', e.target.value)
  const handleUploadDateChange = (e) => updateFilter('uploadDate', e.target.value)

  const hasResults = videos.length > 0

  if (isLoading) {
    return (
      <div className="py-16 flex flex-col items-center justify-center gap-4">
        <Spinner size="lg" aria-label="Loading search results" />
        <p className="text-sm text-[var(--text-secondary)]">Loading results…</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="py-16">
        <EmptyState
          icon={<AlertCircle className="w-8 h-8 text-[var(--danger)]" />}
          title="Failed to load search results"
          description={error}
          action={
            <Button onClick={reset} variant="primary">
              Try again
            </Button>
          }
        />
      </div>
    )
  }

  if (!q) {
    return (
      <div className="py-16">
        <EmptyState
          icon={<List className="w-8 h-8 text-[var(--text-secondary)]" />}
          title="Search for videos"
          description="Enter a keyword in the search bar to get started."
        />
      </div>
    )
  }

  if (!hasResults && !isLoadingMore && !errorMore) {
    return (
      <div className="py-16">
        <EmptyState
          icon={<AlertCircle className="w-8 h-8 text-[var(--text-secondary)]" />}
          title="No results found"
          description={`No videos match "&quot;${q}&quot;". Try a different keyword or filter.`}
          action={
            <Button
              onClick={() => {
                setSearchParams((prev) => {
                  const next = new URLSearchParams(prev)
                  next.set('q', '')
                  return next
                })
              }}
              variant="outline"
            >
              Clear search
            </Button>
          }
        />
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6 w-full pb-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-2">
          <List className="w-5 h-5 text-[var(--text-secondary)] shrink-0" />
          <h1 className="font-semibold text-[var(--text-primary)]">
            Search results for &ldquo;{q}&rdquo;
          </h1>
        </div>
        {q && (
          <span className="text-xs text-[var(--text-secondary)]">
            {videos.length} results
          </span>
        )}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3 border-b border-[var(--border-color)] pb-4">
        <div className="flex items-center gap-2 text-xs">
          <span className="text-[var(--text-secondary)]">Sort:</span>
          <select
            value={sort}
            onChange={handleSortChange}
            className="rounded border border-[var(--border-color)] bg-[var(--bg-surface)] px-2 py-1 text-sm text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
          >
            {SORT_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </div>
        <div className="flex items-center gap-2 text-xs">
          <span className="text-[var(--text-secondary)]">Duration:</span>
          <select
            value={duration}
            onChange={handleDurationChange}
            className="rounded border border-[var(--border-color)] bg-[var(--bg-surface)] px-2 py-1 text-sm text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
          >
            {DURATION_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </div>
        <div className="flex items-center gap-2 text-xs">
          <span className="text-[var(--text-secondary)]">Uploaded:</span>
          <select
            value={uploadDate}
            onChange={handleUploadDateChange}
            className="rounded border border-[var(--border-color)] bg-[var(--bg-surface)] px-2 py-1 text-sm text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
          >
            {UPLOAD_DATE_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </div>
        <button
          type="button"
          onClick={() => {
            setSearchParams((prev) => {
              const next = new URLSearchParams(prev)
              next.set('q', '')
              next.delete('sort')
              next.delete('duration')
              next.delete('uploadDate')
              return next
            })
          }}
          className="text-xs text-[var(--accent)] hover:underline"
        >
          Clear filters
        </button>
      </div>

      {/* Results list */}
      <div role="feed" aria-busy={isLoadingMore} className="flex flex-col gap-2">
        {videos.map((video) => (
          <VideoListItem key={video.id} video={video} />
        ))}

        {/* Loading More Indicator (Inline Skeleton Row) */}
        {isLoadingMore && (
          <div className="h-20 flex items-center justify-center">
            <VideoCardSkeleton />
          </div>
        )}

        {/* Error More State with Inline Retry */}
        {errorMore && (
          <div className="flex flex-col items-center justify-center gap-3 p-4 rounded-2xl bg-[var(--bg-surface-elevated)] border border-[var(--border-color)] max-w-lg mx-auto text-center">
            <span className="text-sm text-[var(--text-secondary)]">
              {errorMore}
            </span>
            <Button
              size="sm"
              variant="outline"
              onClick={retry}
              startIcon={<AlertCircle className="w-3.5 h-3.5" />}
            >
              Retry
            </Button>
          </div>
        )}

        {/* End of Feed Message */}
        {!hasMore && (
          <div className="flex flex-col items-center justify-center py-8 text-center border-t border-[var(--border-color)] mt-4">
            <p className="text-sm font-medium text-[var(--text-secondary)]">
              You&apos;ve reached the end of the results
            </p>
          </div>
        )}

        {/* Infinite Scroll Intersection Sentinel */}
        <div
          ref={sentinelRef}
          className="h-4 w-full pointer-events-none"
          aria-hidden="true"
        />
      </div>
    </div>
  )
}

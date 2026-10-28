import { useState, useEffect, useCallback } from 'react'
import { useSearchParams } from 'react-router-dom'
import { getVideos, getCategories } from '@/services'
import { CategoryChips, VideoGrid, VideoCardSkeleton } from '@/components/video'
import { EmptyState, Button } from '@/components/common'
import { useInfiniteScroll, useScrollRestoration, usePageTitle } from '@/hooks'
import { AlertCircle, Film, RefreshCw } from 'lucide-react'

export default function Home() {
  const [searchParams] = useSearchParams()
  const urlCategory = searchParams.get('category') || 'All'
  const [categories, setCategories] = useState(['All'])
  const [selectedCategory, setSelectedCategory] = useState(urlCategory)

  // Fetch categories once on mount
  useEffect(() => {
    let isMounted = true
    getCategories()
      .then((cats) => {
        if (isMounted && Array.isArray(cats)) {
          setCategories(cats)
        }
      })
      .catch(() => {
        // Fallback to default
      })
    return () => {
      isMounted = false
    }
  }, [])

  usePageTitle('Home — OurTube')

  // Infinite scroll data fetcher
  const fetchVideosPage = useCallback(
    async (page) => {
      return getVideos({
        page,
        limit: 12,
        category: selectedCategory,
      })
    },
    [selectedCategory]
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
  } = useInfiniteScroll({
    fetchFn: fetchVideosPage,
    dependencies: [selectedCategory],
  })

  useScrollRestoration(!isLoading && videos.length > 0)

  const handleCategorySelect = (category) => {
    if (category !== selectedCategory) {
      setSelectedCategory(category)
    }
  }

  return (
    <div className="flex flex-col gap-6 w-full pb-8">
      <h1 className="sr-only">Home</h1>

      {/* Category Chips Bar */}
      <CategoryChips
        categories={categories}
        selectedCategory={selectedCategory}
        onSelectCategory={handleCategorySelect}
      />

      {/* UX State: Initial Loading */}
      {isLoading ? (
        <VideoGrid loading={true} skeletonCount={12} />
      ) : error ? (
        /* UX State: Initial Error */
        <div className="py-16">
          <EmptyState
            icon={<AlertCircle className="w-8 h-8 text-[var(--danger)]" />}
            title="Failed to load videos"
            description={error}
            action={
              <Button onClick={retry} variant="primary">
                Try again
              </Button>
            }
          />
        </div>
      ) : videos.length === 0 ? (
        /* UX State: Empty */
        <div className="py-16">
          <EmptyState
            icon={<Film className="w-8 h-8 text-[var(--text-secondary)]" />}
            title="No videos found"
            description={`There are currently no videos available in "${selectedCategory}".`}
            action={
              selectedCategory !== 'All' ? (
                <Button
                  onClick={() => setSelectedCategory('All')}
                  variant="outline"
                >
                  View All Videos
                </Button>
              ) : null
            }
          />
        </div>
      ) : (
        /* UX State: Success Video Feed */
        <div className="flex flex-col gap-8">
          <VideoGrid videos={videos} />

          {/* Loading More Indicator (Inline Skeleton Row) */}
          {isLoadingMore && (
            <div
              aria-label="Loading more videos"
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-x-4 gap-y-6"
            >
              {Array.from({ length: 4 }).map((_, i) => (
                <VideoCardSkeleton key={`loading-more-${i}`} />
              ))}
            </div>
          )}

          {/* Error More State with Inline Retry */}
          {errorMore && (
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 p-4 rounded-2xl bg-[var(--bg-surface-elevated)] border border-[var(--border-color)] max-w-lg mx-auto text-center">
              <span className="text-sm text-[var(--text-secondary)]">
                {errorMore}
              </span>
              <Button
                size="sm"
                variant="outline"
                onClick={retry}
                startIcon={<RefreshCw className="w-3.5 h-3.5" />}
              >
                Retry
              </Button>
            </div>
          )}

          {/* End of Feed Message */}
          {!hasMore && (
            <div className="flex flex-col items-center justify-center py-8 text-center border-t border-[var(--border-color)] mt-4">
              <p className="text-sm font-medium text-[var(--text-secondary)]">
                You&apos;ve reached the end of the feed
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
      )}
    </div>
  )
}

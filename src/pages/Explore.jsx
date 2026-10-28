import { useState, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import {
  getVideos,
  getCategories,
} from '@/services'
import { VideoCard, VideoCardSkeleton, VideoGrid } from '@/components/video'
import { EmptyState } from '@/components/common'
import { useInfiniteScroll, usePageTitle } from '@/hooks'
import { TrendingUp, Clock } from 'lucide-react'

const EXPLORE_CATEGORY_LIMIT = 6
const POPULAR_LIMIT = 12

export default function Explore() {
  const [trending, setTrending] = useState([])
  const [categorySections, setCategorySections] = useState([])
  const [sectionsLoading, setSectionsLoading] = useState(true)
  const [sectionsError, setSectionsError] = useState(null)

  usePageTitle('Explore — OurTube')

  useEffect(() => {
    let mounted = true

    const load = async () => {
      try {
        // Trending: most-viewed videos
        const trendingRes = await getVideos({
          page: 1,
          limit: 8,
          sort: 'popular',
        })
        if (mounted) setTrending(trendingRes.items || [])

        // Category sections: a row per category
        const allCategories = await getCategories()
        if (mounted) {
          const categoryList = allCategories.filter(
            (c) => c.toLowerCase() !== 'all'
          )
          const sectionLoads = categoryList.slice(
            0,
            EXPLORE_CATEGORY_LIMIT
          ).map((category) =>
            getVideos({ page: 1, limit: 6, category }).then((res) => ({
              category,
              videos: res.items || [],
            }))
          )
          const sections = await Promise.all(sectionLoads)
          if (mounted) setCategorySections(sections)
          if (mounted) setSectionsLoading(false)
        }
      } catch (err) {
        if (mounted) {
          setSectionsError(err?.message || 'Failed to load explore content.')
          setSectionsLoading(false)
        }
      }
    }

    load()
    return () => {
      mounted = false
    }
  }, [])

  const fetchPopularPage = useCallback(
    async (page) => {
      return getVideos({ page, limit: POPULAR_LIMIT, sort: 'popular' })
    },
    []
  )

  const {
    items: popular,
    hasMore,
    isLoading,
    isLoadingMore,
    errorMore,
    sentinelRef,
    retry,
  } = useInfiniteScroll({
    fetchFn: fetchPopularPage,
  })

  if (sectionsLoading) {
    return (
      <div className="py-8 flex flex-col gap-6">
        <h2 className="font-semibold text-[var(--text-primary)]">Trending</h2>
        <div className="flex gap-4 overflow-x-auto no-scrollbar">
          {Array.from({ length: 6 }).map((_, i) => (
            <VideoCardSkeleton key={`trend-${i}`} />
          ))}
        </div>
        <div className="space-y-8">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={`cat-${i}`} className="flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <h3 className="font-medium text-[var(--text-primary)]">Category</h3>
              </div>
              <div className="flex gap-4 overflow-x-auto no-scrollbar">
                {Array.from({ length: 6 }).map((_, j) => (
                  <VideoCardSkeleton key={`cat-${i}-${j}`} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (sectionsError && !trending.length && !categorySections.length) {
    return (
      <div className="py-16">
        <EmptyState
          icon={<Clock className="w-8 h-8 text-[var(--danger)]" />}
          title="Failed to load Explore"
          description={sectionsError}
        />
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-8 w-full pb-8">
      {/* Trending */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-[var(--text-primary)] flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-[var(--accent)]" />
            Trending
          </h2>
        </div>
        <div className="flex gap-4 overflow-x-auto no-scrollbar scrollbar-hide w-full">
          {trending.length ? (
            trending.map((video) => (
              <div key={video.id} className="shrink-0 w-[220px]">
                <VideoCard video={video} />
              </div>
            ))
          ) : (
            Array.from({ length: 4 }).map((_, i) => (
              <div
                key={`trend-skel-${i}`}
                className="shrink-0 w-[220px]"
              >
                <VideoCardSkeleton />
              </div>
            ))
          )}
        </div>
      </section>

      {/* Category sections */}
      {categorySections.length > 0 && (
        <section className="space-y-6">
          {categorySections.map(({ category, videos: sectionVideos }) => (
            <div key={category} className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <h3 className="font-medium text-[var(--text-primary)]">
                  {category}
                </h3>
                <Link
                  to={`/?category=${encodeURIComponent(category)}`}
                  className="text-sm text-[var(--accent)] hover:underline font-medium"
                >
                  View all
                </Link>
              </div>
              <div className="flex gap-4 overflow-x-auto no-scrollbar scrollbar-hide w-full">
                {sectionVideos.length ? (
                  sectionVideos.map((video) => (
                    <div
                      key={video.id}
                      className="shrink-0 w-[200px]"
                    >
                      <VideoCard video={video} />
                    </div>
                  ))
                ) : (
                  Array.from({ length: 4 }).map((_, j) => (
                    <div key={j} className="shrink-0 w-[200px]">
                      <VideoCardSkeleton />
                    </div>
                  ))
                )}
              </div>
            </div>
          ))}
        </section>
      )}

      {/* Popular now — infinite grid */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-[var(--text-primary)] flex items-center gap-2">
            <Clock className="w-4 h-4 text-[var(--accent)]" />
            Popular now
          </h2>
        </div>
        {isLoading && !popular.length ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-x-4 gap-y-6">
            {Array.from({ length: 12 }).map((_, i) => (
              <VideoCardSkeleton key={`pop-skel-${i}`} />
            ))}
          </div>
        ) : (
          <>
            <VideoGrid videos={popular} />
            {isLoadingMore && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-x-4 gap-y-6">
                {Array.from({ length: 4 }).map((_, i) => (
                  <VideoCardSkeleton key={`pop-more-${i}`} />
                ))}
              </div>
            )}
            {errorMore && (
              <div className="flex flex-col items-center justify-center gap-3 p-4 rounded-2xl bg-[var(--bg-surface-elevated)] border border-[var(--border-color)] max-w-lg mx-auto text-center">
                <span className="text-sm text-[var(--text-secondary)]">
                  {errorMore}
                </span>
                <button
                  type="button"
                  onClick={retry}
                  className="text-sm text-[var(--accent)] hover:underline"
                >
                  Retry
                </button>
              </div>
            )}
            {!hasMore && (
              <div className="flex flex-col items-center justify-center py-8 text-center border-t border-[var(--border-color)] mt-4">
                <p className="text-sm font-medium text-[var(--text-secondary)]">
                  You&apos;ve reached the end of popular videos
                </p>
              </div>
            )}
            <div
              ref={sentinelRef}
              className="h-4 w-full pointer-events-none"
              aria-hidden="true"
            />
          </>
        )}
      </section>
    </div>
  )
}

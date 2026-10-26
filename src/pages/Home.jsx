import { useState, useEffect } from 'react'
import { getVideos, getCategories } from '@/services'
import { CategoryChips, VideoGrid } from '@/components/video'
import { EmptyState, Button } from '@/components/common'
import { AlertCircle, Film } from 'lucide-react'

export default function Home() {
  const [categories, setCategories] = useState(['All'])
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [videos, setVideos] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [refreshKey, setRefreshKey] = useState(0)

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

  // Fetch Page 1 videos when category or refreshKey changes
  useEffect(() => {
    let ignore = false

    async function fetchVideos() {
      try {
        const response = await getVideos({
          page: 1,
          limit: 16,
          category: selectedCategory,
        })
        if (!ignore) {
          setVideos(response.items || [])
          setLoading(false)
        }
      } catch (err) {
        if (!ignore) {
          setError(err?.message || 'Failed to load videos. Please try again.')
          setLoading(false)
        }
      }
    }

    fetchVideos()

    return () => {
      ignore = true
    }
  }, [selectedCategory, refreshKey])

  const handleCategorySelect = (category) => {
    if (category !== selectedCategory) {
      setLoading(true)
      setError(null)
      setSelectedCategory(category)
    }
  }

  const handleRetry = () => {
    setLoading(true)
    setError(null)
    setRefreshKey((k) => k + 1)
  }

  return (
    <div className="flex flex-col gap-6 w-full">
      <h1 className="sr-only">Home</h1>

      {/* Category Chips Bar */}
      <CategoryChips
        categories={categories}
        selectedCategory={selectedCategory}
        onSelectCategory={handleCategorySelect}
      />

      {/* Main Content UX States */}
      {loading ? (
        <VideoGrid loading={true} skeletonCount={16} />
      ) : error ? (
        <div className="py-16">
          <EmptyState
            icon={<AlertCircle className="w-8 h-8 text-[var(--danger)]" />}
            title="Something went wrong"
            description={error}
            action={
              <Button onClick={handleRetry} variant="primary">
                Try again
              </Button>
            }
          />
        </div>
      ) : videos.length === 0 ? (
        <div className="py-16">
          <EmptyState
            icon={<Film className="w-8 h-8 text-[var(--text-secondary)]" />}
            title="No videos found"
            description={`There are currently no videos available under the "${selectedCategory}" category.`}
            action={
              selectedCategory !== 'All' ? (
                <Button
                  onClick={() => handleCategorySelect('All')}
                  variant="outline"
                >
                  View All Videos
                </Button>
              ) : null
            }
          />
        </div>
      ) : (
        <VideoGrid videos={videos} />
      )}
    </div>
  )
}

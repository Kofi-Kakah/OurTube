import { useState, useEffect, useCallback } from 'react'
import { getVideoById } from '@/services'
import { EmptyState, Button } from '@/components/common'
import { useUserStore } from '@/store'
import { usePageTitle } from '@/hooks'
import { useToast } from '@/components/common'
import { formatDuration } from '@/utils/formatters'
import { ThumbsDown } from 'lucide-react'

/**
 * Liked Videos page: list of liked videos (newest like first), remove-like
 * with undo toast, and an empty state.
 */
export default function LikedVideos() {
  const { showToast } = useToast()
  const {
    likedVideoIds,
    getVideoReaction,
    removeLike,
    likeVideo,
  } = useUserStore()

  usePageTitle('Liked Videos — OurTube')

  const [videos, setVideos] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [removing, setRemoving] = useState(new Set())

  useEffect(() => {
    let mounted = true
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsLoading(true)
    Promise.all(
      likedVideoIds.map((id) => getVideoById(id).then((v) => v))
    ).then((results) => {
      if (mounted) {
        setVideos(results.filter(Boolean))
        setIsLoading(false)
      }
    })
    return () => {
      mounted = false
    }
  }, [likedVideoIds])

  const handleRemoveLike = useCallback(
    async (videoId) => {
      setRemoving((prev) => new Set([...prev, videoId]))
      removeLike(videoId)
      showToast({
        message: 'Removed from liked videos',
        type: 'info',
        duration: 5000,
        action: {
          label: 'Undo',
          onClick: () => {
            likeVideo(videoId)
          },
        },
      })
    },
    [removeLike, likeVideo, showToast]
  )

  if (isLoading) {
    return (
      <div className="py-16 flex flex-col items-center justify-center gap-3">
        <div className="w-8 h-8 border-2 border-[var(--border-color)] border-t-[var(--accent)] rounded-full animate-spin" />
        <p className="text-sm text-[var(--text-secondary)]">Loading liked videos…</p>
      </div>
    )
  }

  if (videos.length === 0) {
    return (
      <div className="py-16">
        <EmptyState
          icon={<ThumbsDown className="w-8 h-8 text-[var(--text-secondary)]" />}
          title="No liked videos"
          description="Liked videos will appear here. Like a video to add it to your collection."
          action={
            <Button
              onClick={() => {
                window.location.href = '/'
              }}
              variant="outline"
            >
              Browse videos
            </Button>
          }
        />
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6 w-full pb-8">
      <h1 className="font-bold text-[var(--text-primary)] text-xl">
        Liked Videos ({videos.length})
      </h1>
      <div role="feed" aria-label="Liked videos">
        {videos.map((video) => (
          <div
            key={video.id}
            className="flex gap-3 items-center p-3 rounded-xl border border-[var(--border-color)] bg-[var(--bg-surface)] hover:bg-[var(--bg-surface-elevated)] transition-colors group"
          >
            <div className="relative shrink-0 w-[160px] h-[90px] rounded-lg overflow-hidden bg-[var(--bg-surface-elevated)] flex-shrink-0">
              <img
                src={video.thumbnail}
                alt={video.title}
                loading="lazy"
                decoding="async"
                className="w-full h-full object-cover"
              />
              <span
                className="absolute bottom-1 right-1 px-1.5 py-0.5 rounded-md text-xs font-semibold bg-black/85 text-white"
              >
                {formatDuration(video.duration)}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-sm leading-snug text-[var(--text-primary)] line-clamp-2">
                {video.title}
              </h3>
              <p className="text-xs text-[var(--text-secondary)] mt-1 truncate">
                {video.views ? Math.floor(video.views / 1000) + 'K views' : '0 views'}
              </p>
            </div>
            <div className="shrink-0 flex flex-col gap-1.5">
              <button
                type="button"
                onClick={() => handleRemoveLike(video.id)}
                disabled={removing.has(video.id)}
                aria-pressed={getVideoReaction(video.id) === 'like'}
                aria-label="Remove like"
                className={`p-2 rounded-lg text-xs font-medium transition-colors ${
                  removing.has(video.id)
                    ? 'opacity-50 cursor-not-allowed'
                    : 'text-[var(--text-secondary)] hover:text-[var(--danger)] hover:bg-[var(--danger)]/10'
                }`}
              >
                <ThumbsDown className="w-4 h-4" />
                <span className="hidden sm:inline">Unlike</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

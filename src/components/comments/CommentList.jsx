import { useCallback } from 'react'
import PropTypes from 'prop-types'
import { useInfiniteScroll } from '@/hooks'
import { getComments } from '@/services'
import CommentItem from './CommentItem'
import { Spinner } from '@/components/common'

/**
 * Infinite-scroll comment list for a video.
 * Supports Top/Newest sorting via `sortBy`. Replies (parentId set) render
 * indented one level below their position in the sorted feed.
 */
export default function CommentList({ videoId, sortBy = 'top' }) {
  const fetchCommentsPage = useCallback(
    async (page) => {
      return getComments(videoId, { page, limit: 10, sortBy })
    },
    [videoId, sortBy]
  )

  const {
    items: comments,
    isLoading,
    isLoadingMore,
    error,
    errorMore,
    sentinelRef,
    retry,
  } = useInfiniteScroll({
    fetchFn: fetchCommentsPage,
    dependencies: [videoId, sortBy],
  })

  if (isLoading && !comments.length) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <Spinner size="lg" aria-label="Loading comments" />
        <p className="mt-3 text-sm text-[var(--text-secondary)]">
          Loading comments…
        </p>
      </div>
    )
  }

  if (error && !comments.length) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <p className="text-sm text-[var(--text-secondary)] mb-3">{error}</p>
        <button
          type="button"
          onClick={retry}
          className="text-sm text-[var(--accent)] hover:underline"
        >
          Retry
        </button>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-0">
      {comments.map((comment) => (
        <CommentItem
          key={comment.id}
          comment={comment}
          videoId={videoId}
          depth={comment.parentId ? 1 : 0}
        />
      ))}
      {isLoadingMore && (
        <div className="flex items-center justify-center py-4">
          <Spinner size="sm" aria-label="Loading more comments" />
        </div>
      )}
      {errorMore && (
        <div className="flex flex-col items-center justify-center gap-2 p-3 text-center">
          <p className="text-xs text-[var(--text-secondary)]">{errorMore}</p>
          <button
            type="button"
            onClick={retry}
            className="text-xs text-[var(--accent)] hover:underline"
          >
            Retry
          </button>
        </div>
      )}
      {!comments.length && !isLoading && !error && (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <p className="text-sm text-[var(--text-secondary)]">
            No comments yet. Be the first to share your thoughts!
          </p>
        </div>
      )}
      <div ref={sentinelRef} className="h-4 w-full" aria-hidden="true" />
    </div>
  )
}

CommentList.propTypes = {
  videoId: PropTypes.string.isRequired,
  sortBy: PropTypes.oneOf(['top', 'newest']),
}

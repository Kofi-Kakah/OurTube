import { useState, useCallback } from 'react'
import PropTypes from 'prop-types'
import { ThumbsUp, ThumbsDown } from 'lucide-react'
import { useUserStore } from '@/store'
import { useToast } from '@/components/common'

/**
 * Like / Dislike toggle buttons for a video. Mutually exclusive with
 * `aria-pressed` state and optimistic like-count updates. Each action
 * surfaces a toast with an Undo option.
 */
export default function LikeDislikeButtons({ videoId, likesCount }) {
  const { showToast } = useToast()
  const {
    getVideoReaction,
    likeVideo,
    dislikeVideo,
    removeLike,
    removeDislike,
  } = useUserStore()

  const [localLikes, setLocalLikes] = useState(likesCount)
  const [undoData, setUndoData] = useState(null)

  const reaction = getVideoReaction(videoId)

  const clearUndo = useCallback(() => setUndoData(null), [])

  const showUndoToast = useCallback(
    ({ message, type, onUndo }) => {
      setUndoData({ onUndo })
      showToast({
        message,
        type,
        duration: 5000,
        action: { label: 'Undo', onClick: () => { onUndo(); clearUndo() } },
      })
    },
    [showToast, clearUndo]
  )

  const handleLike = useCallback(() => {
    const prevReaction = reaction
    const prevLikes = localLikes

    if (prevReaction === 'like') {
      removeLike(videoId)
      setLocalLikes(prevLikes - 1)
      showUndoToast({
        message: 'Removed like',
        type: 'info',
        onUndo: () => {
          likeVideo(videoId)
          setLocalLikes(prevLikes)
        },
      })
    } else {
      likeVideo(videoId)
      setLocalLikes(prevLikes + 1)
      showUndoToast({
        message: 'Liked video',
        type: 'success',
        onUndo: () => {
          if (prevReaction === 'dislike') dislikeVideo(videoId)
          else removeLike(videoId)
          setLocalLikes(prevLikes)
        },
      })
    }
  }, [videoId, reaction, localLikes, removeLike, likeVideo, dislikeVideo, showUndoToast])

  const handleDislike = useCallback(() => {
    const prevReaction = reaction
    const prevLikes = localLikes

    if (prevReaction === 'dislike') {
      removeDislike(videoId)
      showUndoToast({
        message: 'Removed dislike',
        type: 'info',
        onUndo: () => {
          dislikeVideo(videoId)
        },
      })
    } else {
      dislikeVideo(videoId)
      const nextLikes = prevReaction === 'like' ? prevLikes - 1 : prevLikes
      setLocalLikes(nextLikes)
      showUndoToast({
        message: 'Disliked video',
        type: 'info',
        onUndo: () => {
          if (prevReaction === 'like') likeVideo(videoId)
          else if (prevReaction === 'dislike') removeDislike(videoId)
          else removeLike(videoId)
          setLocalLikes(prevLikes)
        },
      })
    }
  }, [
    videoId,
    reaction,
    localLikes,
    removeDislike,
    dislikeVideo,
    likeVideo,
    removeLike,
    showUndoToast,
  ])

  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        onClick={handleLike}
        aria-pressed={reaction === 'like'}
        aria-label={reaction === 'like' ? 'Unlike video' : 'Like video'}
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
          reaction === 'like'
            ? 'text-[var(--accent)] bg-[var(--accent)]/10'
            : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface-elevated)]'
        }`}
      >
        <ThumbsUp className={`w-3.5 h-3.5 ${reaction === 'like' ? 'fill-current' : ''}`} />
        <span>Like</span>
        <span className="ml-1">{localLikes}</span>
      </button>

      <button
        type="button"
        onClick={handleDislike}
        aria-pressed={reaction === 'dislike'}
        aria-label={reaction === 'dislike' ? 'Remove dislike' : 'Dislike video'}
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
          reaction === 'dislike'
            ? 'text-[var(--text-secondary)] bg-[var(--bg-surface-elevated)]'
            : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface-elevated)]'
        }`}
      >
        <ThumbsDown className={`w-3.5 h-3.5 ${reaction === 'dislike' ? 'fill-current' : ''}`} />
        <span>Dislike</span>
      </button>

      {undoData && (
        <button
          type="button"
          onClick={() => {
            undoData.onUndo()
            clearUndo()
          }}
          className="px-1 text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
          aria-label="Undo"
        >
          ↩
        </button>
      )}
    </div>
  )
}

LikeDislikeButtons.propTypes = {
  videoId: PropTypes.string.isRequired,
  likesCount: PropTypes.number.isRequired,
}

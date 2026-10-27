import { useState, useCallback } from 'react'
import PropTypes from 'prop-types'
import { formatRelativeTime } from '@/utils/formatters'
import { useUserStore } from '@/store'
import { likeComment, deleteComment, addComment } from '@/services'
import { useToast } from '@/components/common'
import { ThumbsUp, Reply, EllipsisVertical } from 'lucide-react'

/**
 * Individual comment with like, delete (owner only), and reply (one level).
 * Optimistic UI for like/delete with rollback on error.
 */
export default function CommentItem({
  comment,
  videoId,
  depth = 0,
  userId,
  onReply,
}) {
  const { showToast } = useToast()
  const { user } = useUserStore()
  const currentUserId = userId || user.id
  const isOwner = comment.userId === currentUserId

  const [likes, setLikes] = useState(comment.likesCount)
  const [liked, setLiked] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [showReplyForm, setShowReplyForm] = useState(false)
  const [replyText, setReplyText] = useState('')

  const handleLike = useCallback(async () => {
    const nextLiked = !liked
    const nextLikes = nextLiked ? likes + 1 : Math.max(0, likes - 1)
    setLiked(nextLiked)
    setLikes(nextLikes)
    try {
      await likeComment(comment.id, nextLiked)
    } catch {
      setLiked(!nextLiked)
      setLikes(comment.likesCount)
      showToast({
        message: 'Failed to update like. Please try again.',
        type: 'danger',
      })
    }
  }, [comment.id, comment.likesCount, liked, likes, showToast])

  const handleDelete = useCallback(async () => {
    setIsDeleting(true)
    try {
      await deleteComment(comment.id)
    } catch {
      setIsDeleting(false)
      showToast({
        message: 'Failed to delete comment. Please try again.',
        type: 'danger',
      })
    }
  }, [comment.id, showToast])

  const handleSubmitReply = async (e) => {
    e.preventDefault()
    const trimmed = replyText.trim()
    if (!trimmed) return
    try {
      await addComment({
        videoId,
        userId: user.id,
        userName: user.name,
        userAvatar: user.avatar,
        text: trimmed,
        parentId: comment.id,
      })
      setShowReplyForm(false)
      setReplyText('')
      onReply?.()
    } catch {
      showToast({
        message: 'Failed to post reply. Please try again.',
        type: 'danger',
      })
    }
  }

  return (
    <div
      className="flex gap-3 pt-3 pb-1"
      style={{ marginLeft: depth * 18 }}
      aria-labelledby={`comment-${comment.id}`}
    >
      <div className="shrink-0 mt-0.5">
        <div className="w-7 h-7 rounded-full flex items-center justify-center bg-[var(--bg-surface-elevated)] border border-[var(--border-color)]">
          {comment.userAvatar ? (
            <img
              src={comment.userAvatar}
              alt=""
              className="w-full h-full rounded-full object-cover"
              decoding="async"
            />
          ) : (
            <span className="text-[10px] font-medium text-[var(--text-secondary)]">
              {comment.userName.charAt(0).toUpperCase()}
            </span>
          )}
        </div>
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-baseline gap-1.5 mb-0.5">
          <span
            className="text-sm font-medium text-[var(--text-primary)] truncate"
            id={`comment-${comment.id}`}
          >
            {comment.userName}
          </span>
          <span className="text-xs text-[var(--text-secondary)]">
            {formatRelativeTime(comment.createdAt)}
          </span>
          {isOwner && (
            <button
              type="button"
              onClick={handleDelete}
              disabled={isDeleting}
              className="ml-auto p-1 text-[var(--text-secondary)] hover:text-[var(--danger)] rounded hover:bg-[var(--bg-surface-elevated)] transition-colors disabled:opacity-50"
              aria-label="Delete comment"
            >
              <EllipsisVertical className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
        <p className="text-sm text-[var(--text-primary)] leading-relaxed">
          {comment.text}
        </p>
        <div className="flex items-center gap-3 mt-2">
          <button
            type="button"
            onClick={handleLike}
            aria-pressed={liked}
            className="flex items-center gap-1 text-xs font-medium transition-colors ${
              liked
                ? 'text-[var(--accent)]'
                : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
            }"
          >
            <ThumbsUp className={`w-3.5 h-3.5 ${liked ? 'fill-current' : ''}`} />
            <span>{likes}</span>
          </button>
          <button
            type="button"
            onClick={() => setShowReplyForm((prev) => !prev)}
            className="text-xs font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:underline"
            aria-label="Reply"
          >
            <Reply className="w-3.5 h-3.5 shrink-0" />
            Reply
          </button>
          <div className="h-3.5 w-px bg-[var(--border-color)] mx-1" />
          <button
            type="button"
            className="text-xs font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:underline"
            disabled
            aria-disabled="true"
          >
            Dislike
          </button>
        </div>

        {showReplyForm && (
          <form onSubmit={handleSubmitReply} className="mt-2">
            <textarea
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              placeholder="Write a reply…"
              rows={2}
              className="w-full resize-none rounded-lg border border-[var(--border-color)] bg-[var(--bg-base)] px-3 py-2 text-sm text-[var(--text-primary)] placeholder-[var(--text-secondary)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
            />
            <div className="flex justify-end mt-1.5 gap-2">
              <button
                type="button"
                onClick={() => setShowReplyForm(false)}
                className="text-xs text-[var(--text-secondary)] hover:text-[var(--accent)]"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!replyText.trim()}
                className="text-xs font-medium rounded px-2.5 py-1 text-white bg-[var(--accent)] disabled:opacity-50"
              >
                Reply
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}

CommentItem.propTypes = {
  comment: PropTypes.shape({
    id: PropTypes.string.isRequired,
    videoId: PropTypes.string.isRequired,
    userId: PropTypes.string.isRequired,
    userName: PropTypes.string.isRequired,
    userAvatar: PropTypes.string,
    text: PropTypes.string.isRequired,
    createdAt: PropTypes.string.isRequired,
    likesCount: PropTypes.number.isRequired,
    parentId: PropTypes.string,
  }).isRequired,
  videoId: PropTypes.string.isRequired,
  depth: PropTypes.number,
  userId: PropTypes.string,
  onReply: PropTypes.func,
}

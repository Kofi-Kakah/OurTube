import { useState } from 'react'
import PropTypes from 'prop-types'
import CommentList from './CommentList'
import CommentForm from './CommentForm'
import { useToast } from '@/components/common'

/**
 * Comments section: sort toggle (Top/Newest), comment list, and add-comment
 * reply form with one-level reply context.
 */
export default function CommentSection({ videoId }) {
  const { showToast } = useToast()
  const [sortBy, setSortBy] = useState('top')
  const [replying, setReplying] = useState(false)
  const [replyTo, setReplyTo] = useState(null)
  const [replyParentId, setReplyParentId] = useState(null)

  const handleCommentAdded = (created) => {
    showToast({
      message: created.parentId ? 'Reply posted' : 'Comment posted',
      type: 'success',
    })
    setReplying(false)
    setReplyTo(null)
    setReplyParentId(null)
  }

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-[var(--border-color)] pb-3">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-[var(--text-secondary)]">
            Comments
          </span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="rounded border border-[var(--border-color)] bg-[var(--bg-surface)] px-2 py-1 text-xs text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
          >
            <option value="top">Top comments</option>
            <option value="newest">Newest first</option>
          </select>
        </div>
        <button
          type="button"
          onClick={() => {
            setReplying(true)
            setReplyTo(null)
            setReplyParentId(null)
          }}
          className="text-sm font-medium text-[var(--accent)] hover:underline"
        >
          Add a comment
        </button>
      </div>

      <CommentList videoId={videoId} sortBy={sortBy} />

      <div className="border-t border-[var(--border-color)] pt-4">
        {replying ? (
          <CommentForm
            videoId={videoId}
            parentId={replyParentId}
            replyTo={replyTo}
            onCancel={() => {
              setReplying(false)
              setReplyTo(null)
              setReplyParentId(null)
            }}
            onCommentAdded={handleCommentAdded}
          />
        ) : (
          <button
            type="button"
            onClick={() => {
              setReplying(true)
              setReplyTo(null)
              setReplyParentId(null)
            }}
            className="flex items-center gap-2 text-sm font-medium text-[var(--accent)] hover:underline py-2"
          >
            <span className="text-[var(--text-secondary)]">Add a comment</span>
          </button>
        )}
      </div>
    </div>
  )
}

CommentSection.propTypes = {
  videoId: PropTypes.string.isRequired,
}

import { useState, useRef, useEffect } from 'react'
import PropTypes from 'prop-types'
import { useUserStore } from '@/store'
import { addComment } from '@/services'
import { useToast } from '@/components/common'
import { MessageCircle, User, X } from 'lucide-react'

const MAX_LENGTH = 500

/**
 * Comment form: add a top-level comment or a reply (one level).
 * Shows the mock user's avatar/name, a character counter, and a reply context.
 */
export default function CommentForm({
  videoId,
  parentId = null,
  replyTo = null,
  onCancel,
  onCommentAdded,
}) {
  const { showToast } = useToast()
  const { user } = useUserStore()
  const [text, setText] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const textareaRef = useRef(null)

  useEffect(() => {
    textareaRef.current?.focus()
  }, [])

  const remaining = MAX_LENGTH - text.length

  const handleChange = (e) => {
    setText(e.target.value)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const trimmed = text.trim()
    if (!trimmed || submitting) return

    setSubmitting(true)
    try {
      const created = await addComment({
        videoId,
        userId: user.id,
        userName: user.name,
        userAvatar: user.avatar,
        text: trimmed,
        parentId,
      })
      onCommentAdded?.(created)
      setText('')
      if (onCancel) onCancel()
    } catch {
      showToast({
        message: 'Failed to post comment. Please try again.',
        type: 'danger',
      })
    } finally {
      setSubmitting(false)
    }
  }

  const handleCancel = () => {
    setText('')
    if (onCancel) onCancel()
  }

  return (
    <div className="flex gap-3">
      <div className="shrink-0">
        <AvatarFallback src={user.avatar} name={user.name} size="sm" />
      </div>
      <div className="flex-1 min-w-0">
        {replyTo && (
          <div className="flex items-center gap-1.5 mb-1.5">
            <MessageCircle className="w-3 h-3 text-[var(--text-secondary)]" />
            <span className="text-xs text-[var(--text-secondary)] italic">
              Replying to <b>{replyTo}</b>
            </span>
            <button
              type="button"
              onClick={handleCancel}
              className="ml-auto text-xs text-[var(--text-secondary)] hover:text-[var(--accent)] underline"
              aria-label="Cancel reply"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        )}
        <form onSubmit={handleSubmit} className="w-full">
          <textarea
            ref={textareaRef}
            value={text}
            onChange={handleChange}
            placeholder={replyTo ? 'Write a reply…' : 'Add a comment…'}
            maxLength={MAX_LENGTH}
            rows={replyTo ? 2 : 3}
            className="w-full resize-none rounded-lg border border-[var(--border-color)] bg-[var(--bg-base)] px-3 py-2.5 text-sm text-[var(--text-primary)] placeholder-[var(--text-secondary)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
          />
          <div className="flex items-center justify-between mt-1.5">
            <span className="text-xs text-[var(--text-secondary)]">
              {remaining < 0 ? `${Math.abs(remaining)} over limit` : `${remaining} left`}
            </span>
            <button
              type="submit"
              disabled={submitting || text.trim().length === 0 || remaining < 0}
              className={`px-3 py-1.5 text-xs rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-colors ${
                remaining < 0 || submitting || text.trim().length === 0
                  ? 'text-[var(--text-secondary)] bg-[var(--bg-surface-elevated)] border border-[var(--border-color)]'
                  : 'text-white bg-[var(--accent)] hover:bg-[var(--accent-hover)]'
              }`}
            >
              {submitting ? 'Posting…' : replyTo ? 'Reply' : 'Comment'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

CommentForm.propTypes = {
  videoId: PropTypes.string.isRequired,
  parentId: PropTypes.string,
  replyTo: PropTypes.string,
  onCancel: PropTypes.func,
  onCommentAdded: PropTypes.func,
}

function AvatarFallback({ src, name, size = 'md' }) {
  const sizeMap = { sm: 'w-8 h-8', md: 'w-10 h-10' }
  return (
    <div
      className={`${sizeMap[size] || sizeMap.md} rounded-full flex items-center justify-center shrink-0 bg-[var(--bg-surface-elevated)] border border-[var(--border-color)]`}
      aria-label={name}
    >
      {src ? (
        <img
          src={src}
          alt=""
          className="w-full h-full rounded-full object-cover"
          decoding="async"
        />
      ) : (
        <User className="w-4 h-4 text-[var(--text-secondary)]" />
      )}
    </div>
  )
}

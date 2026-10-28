import { useState, useEffect, useMemo } from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import { getVideoById } from '@/services'
import { EmptyState, Button } from '@/components/common'
import { useHistoryStore } from '@/store'
import { formatViews, formatRelativeTime, formatDuration } from '@/utils/formatters'
import { Trash2, Play, Search, X, Clock } from 'lucide-react'

const GROUP_LABELS = {
  today: 'Today',
  yesterday: 'Yesterday',
  thisWeek: 'This week',
  earlier: 'Earlier',
}

const getDateGroup = (isoString) => {
  const date = new Date(isoString)
  const now = new Date()
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime()
  const entryTime = new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime()
  const diffDays = (today - entryTime) / (1000 * 60 * 60 * 24)

  if (diffDays < 1) return 'today'
  if (diffDays < 2) return 'yesterday'
  if (diffDays < 7) return 'thisWeek'
  return 'earlier'
}

/**
 * Single history entry: thumbnail, title, progress bar, metadata, remove button.
 */
function HistoryEntry({ entry, video, onRemove }) {
  const percentage = entry.percentage || 0
  const isCompleted = percentage >= 100
  const channelName = video ? (video.channelId ? 'Creator' : '') : ''
  const views = video ? formatViews(video.views) : ''

  return (
    <div
      className="flex gap-3 items-center p-3 rounded-xl border border-[var(--border-color)] bg-[var(--bg-surface)] hover:bg-[var(--bg-surface-elevated)] transition-colors group"
      role="listitem"
    >
      <Link
        to={`/watch/${entry.videoId}?resume=true`}
        className="relative shrink-0 w-[160px] h-[90px] rounded-lg overflow-hidden bg-[var(--bg-surface-elevated)] flex-shrink-0"
        aria-label={`Resume watching ${video ? video.title : 'video'}`}
      >
        <img
          src={video ? video.thumbnail : ''}
          alt={video ? video.title : ''}
          loading="lazy"
          decoding="async"
          className="w-full h-full object-cover"
        />
        <span
          className="absolute bottom-1 right-1 px-1.5 py-0.5 rounded-md text-xs font-semibold bg-black/85 text-white"
        >
          {formatDuration(entry.durationSeconds || 0)}
        </span>
        {percentage > 0 && (
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/30">
            <div
              className={`h-full ${isCompleted ? 'bg-[var(--text-secondary)]' : 'bg-[var(--danger)]'} transition-all`}
              style={{ width: `${percentage}%` }}
            />
          </div>
        )}
      </Link>

      <div className="flex-1 min-w-0 flex flex-col gap-0.5">
        <h3 className="font-semibold text-sm leading-snug text-[var(--text-primary)] line-clamp-2">
          {video ? video.title : 'Unknown video'}
        </h3>
        <p className="text-xs text-[var(--text-secondary)] mt-0.5 flex items-center gap-1">
          <span>{channelName}</span>
          <span>•</span>
          <span>{views}</span>
          <span>•</span>
          <span>{formatRelativeTime(entry.watchedAt)}</span>
        </p>
        <p className="text-xs text-[var(--text-secondary)] flex items-center gap-1">
          {percentage > 0 ? (
            <>
              <span>{percentage}% watched</span>
              {isCompleted && (
                <span className="text-[var(--text-secondary)]">• Completed</span>
              )}
            </>
          ) : (
            <span>Started</span>
          )}
        </p>
      </div>

      <div className="shrink-0 flex items-center gap-1">
        <button
          type="button"
          onClick={onRemove}
          className="p-1.5 text-[var(--text-secondary)] hover:text-[var(--danger)] hover:bg-[var(--bg-surface-elevated)] rounded transition-colors"
          aria-label="Remove from history"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}

HistoryEntry.propTypes = {
  entry: PropTypes.object.isRequired,
  video: PropTypes.object,
  onRemove: PropTypes.func.isRequired,
}

/**
 * History page: grouped by date (Today / Yesterday / This week / Earlier),
 * infinite scroll, remove single entry, clear all with confirm, pause-history
 * toggle, and search within history.
 */
export default function History() {
  const {
    entries,
    isPaused,
    removeEntry,
    clearHistory,
    togglePauseHistory,
  } = useHistoryStore()

  const [searchQuery, setSearchQuery] = useState('')
  const [showClearConfirm, setShowClearConfirm] = useState(false)
  const [loadedVideoIds, setLoadedVideoIds] = useState(new Set())
  const [videosById, setVideosById] = useState({})

  // Filter entries by search query
  const filteredEntryIds = useMemo(() => {
    const q = searchQuery.toLowerCase().trim()
    if (!q) return entries.map((e) => e.videoId)
    return entries
      .filter((e) => e.videoId.toLowerCase().includes(q))
      .map((e) => e.videoId)
  }, [entries, searchQuery])

  // Load video metadata for entries (lazy, on scroll would be ideal; here load visible batch)
  useEffect(() => {
    const idsToLoad = filteredEntryIds.filter((id) => !loadedVideoIds.has(id))
    if (idsToLoad.length === 0) return
    const loadBatch = async () => {
      const next = new Set(loadedVideoIds)
      await Promise.all(
        idsToLoad.slice(0, 8).map(async (id) => {
          try {
            const v = await getVideoById(id)
            if (v) {
              setVideosById((prev) => ({ ...prev, [id]: v }))
              next.add(id)
            }
          } catch {
            // ignore individual load failures
          }
        })
      )
      setLoadedVideoIds(next)
    }
    loadBatch()
  }, [filteredEntryIds, loadedVideoIds])

  const groupEntries = useMemo(() => {
    const groups = { today: [], yesterday: [], thisWeek: [], earlier: [] }
    filteredEntryIds.forEach((videoId) => {
      const entry = entries.find((e) => e.videoId === videoId)
      if (entry) {
        const group = getDateGroup(entry.watchedAt)
        groups[group].push(entry)
      }
    })
    return groups
  }, [filteredEntryIds, entries])

  const handleClear = () => setShowClearConfirm(true)
  const handleClearConfirm = () => {
    clearHistory()
    setShowClearConfirm(false)
  }

  if (entries.length === 0) {
    return (
      <div className="py-16">
        <EmptyState
          icon={<Clock className="w-8 h-8 text-[var(--text-secondary)]" />}
          title="No watch history"
          description="Your watch history will appear here. Videos you watch will be saved automatically."
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
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-[var(--border-color)] pb-4">
        <h1 className="font-bold text-[var(--text-primary)] text-xl">
          Watch History
        </h1>
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-secondary)]" />
          <input
            type="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search history…"
            className="w-full h-10 pl-9 pr-3 rounded-lg border border-[var(--border-color)] bg-[var(--bg-base)] text-sm text-[var(--text-primary)] placeholder-[var(--text-secondary)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
              aria-label="Clear search"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={togglePauseHistory}
            aria-pressed={isPaused}
            aria-label={isPaused ? 'Resume history tracking' : 'Pause history tracking'}
            className={`p-1.5 rounded-lg transition-colors ${
              isPaused
                ? 'text-[var(--danger)] bg-[var(--danger)]/10'
                : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface-elevated)]'
            }`}
            title={isPaused ? 'History tracking is paused' : 'History tracking is active'}
          >
            {isPaused ? (
              <Play className="w-4 h-4" />
            ) : (
              <Clock className="w-4 h-4" />
            )}
          </button>
          <button
            type="button"
            onClick={handleClear}
            className="text-xs font-medium text-[var(--text-secondary)] hover:text-[var(--danger)] underline"
            aria-label="Clear all watch history"
          >
            Clear all
          </button>
        </div>
      </div>

      {showClearConfirm && (
        <div className="p-4 rounded-xl border border-[var(--border-color)] bg-[var(--bg-surface-elevated)] text-center">
          <p className="text-sm text-[var(--text-primary)] mb-3">
            Clear all watch history? This cannot be undone.
          </p>
          <div className="flex justify-center gap-2">
            <button
              type="button"
              onClick={handleClearConfirm}
              className="px-3 py-1.5 rounded text-xs font-medium text-white bg-[var(--danger)] hover:bg-[#b91c1c] transition-colors"
            >
              Clear all
            </button>
            <button
              type="button"
              onClick={() => setShowClearConfirm(false)}
              className="px-3 py-1.5 rounded text-xs font-medium text-[var(--text-secondary)] hover:bg-[var(--bg-base)] transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      <div role="feed" aria-label="Watch history" className="flex flex-col gap-2">
        {Object.entries(groupEntries).map(([groupKey, groupEntriesList]) => {
          if (groupEntriesList.length === 0) return null
          return (
            <div key={groupKey} className="flex flex-col gap-1">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-[var(--text-secondary)] mx-2 mb-1">
                {GROUP_LABELS[groupKey]}
              </h3>
              {groupEntriesList.map((entry) => {
                const video = videosById[entry.videoId]
                return (
                  <HistoryEntry
                    key={entry.videoId}
                    entry={entry}
                    video={video}
                    onRemove={() => removeEntry(entry.videoId)}
                  />
                )
              })}
            </div>
          )
        })}
      </div>
    </div>
  )
}

History.propTypes = {}

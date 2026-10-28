import { useState, useEffect, useCallback, useMemo } from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import {
  getChannels,
  getVideos,
} from '@/services'
import { useInfiniteScroll } from '@/hooks'
import { EmptyState, Button, Avatar, useToast } from '@/components/common'
import { useUserStore } from '@/store'
import { formatViews, formatRelativeTime, formatDuration } from '@/utils/formatters'
import { UserPlus } from 'lucide-react'

/**
 * Subscriptions page: a horizontal strip of subscribed channels plus a feed
 * of their latest videos (infinite scroll), with an empty state prompting
 * discovery when not subscribed to anything.
 */
export default function Subscriptions() {
  const { showToast } = useToast()
  const {
    subscriptions,
    subscribe,
    unsubscribe,
  } = useUserStore()

  const [channels, setChannels] = useState([])
  const [channelsLoading, setChannelsLoading] = useState(true)

  useEffect(() => {
    let mounted = true
    getChannels()
      .then((channelList) => {
        if (mounted && Array.isArray(channelList)) {
          setChannels(channelList.filter((c) => subscriptions.includes(c.id)))
        }
      })
      .catch(() => {})
      .finally(() => {
        if (mounted) setChannelsLoading(false)
      })
    return () => {
      mounted = false
    }
  }, [subscriptions])

  const subscribedChannelIds = useMemo(
    () => new Set(subscriptions),
    [subscriptions]
  )

  const fetchSubscriptionsFeed = useCallback(
    async (page) => {
      return getVideos({ page, limit: 12, sort: 'newest' })
    },
    []
  )

  const {
    items: allVideos,
    hasMore,
    isLoading,
    isLoadingMore,
    error,
    errorMore,
    sentinelRef,
    retry,
  } = useInfiniteScroll({
    fetchFn: fetchSubscriptionsFeed,
  })

  // Latest videos from subscribed channels only, newest first
  const feedVideos = useMemo(() => {
    return [...allVideos]
      .filter((v) => subscribedChannelIds.has(v.channelId))
      .sort(
        (a, b) =>
          new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
      )
  }, [allVideos, subscribedChannelIds])

  const handleUnsubscribeChannel = useCallback(
    (id) => {
      if (!subscribedChannelIds.has(id)) return
      unsubscribe(id)
      const channel = channels.find((c) => c.id === id)
      showToast({
        message: `Unsubscribed from ${channel?.name || 'channel'}`,
        type: 'info',
        duration: 5000,
        action: {
          label: 'Undo',
          onClick: () => subscribe(id),
        },
      })
    },
    [subscribedChannelIds, unsubscribe, channels, showToast, subscribe]
  )

  if (channelsLoading) {
    return (
      <div className="py-16 flex flex-col items-center justify-center gap-3">
        <div className="w-8 h-8 border-2 border-[var(--border-color)] border-t-[var(--accent)] rounded-full animate-spin" />
        <p className="text-sm text-[var(--text-secondary)]">Loading subscriptions…</p>
      </div>
    )
  }

  if (subscriptions.length === 0) {
    return (
      <div className="py-16">
        <EmptyState
          icon={<UserPlus className="w-8 h-8 text-[var(--text-secondary)]" />}
          title="No subscriptions yet"
          description="Subscribe to channels to see their latest videos here."
          action={
            <Button
              onClick={() => {
                window.location.href = '/'
              }}
              variant="primary"
            >
              Browse channels
            </Button>
          }
        />
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6 w-full pb-8">
      <h1 className="font-bold text-[var(--text-primary)] text-xl">
        Subscriptions
      </h1>

      {/* Subscribed channels strip */}
      <section className="flex flex-col gap-3">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-[var(--text-secondary)]">
            Subscribed channels ({subscriptions.length})
          </span>
        </div>
        <div className="flex gap-3 overflow-x-auto no-scrollbar scrollbar-hide pb-1">
          {channels.map((channel) => (
            <div
              key={channel.id}
              className="flex flex-col items-center gap-1.5 shrink-0"
            >
              <LinkPlaceholder
                channel={channel}
              />
              <span className="text-xs text-[var(--text-primary)] truncate w-[100px] text-center">
                {channel.name}
              </span>
              <button
                type="button"
                onClick={() => handleUnsubscribeChannel(channel.id)}
                className="text-[var(--text-secondary)] hover:text-[var(--danger)] text-[10px] font-medium py-0.5"
                aria-label={`Unsubscribe from ${channel.name}`}
              >
                Unsubscribe
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Latest videos feed */}
      <section className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <h2 className="font-medium text-[var(--text-primary)]">
            Latest from your subscriptions
          </h2>
        </div>

        {isLoading && !feedVideos.length ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-4 gap-y-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="flex flex-col gap-2">
                <div className="aspect-video rounded-xl bg-[var(--skeleton)] animate-pulse" />
                <div className="h-4 w-3/4 bg-[var(--skeleton)] animate-pulse rounded" />
                <div className="h-3 w-1/2 bg-[var(--skeleton)] animate-pulse rounded" />
              </div>
            ))}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-4 gap-y-6">
              {feedVideos.map((video) => (
                <Link
                  key={video.id}
                  to={`/watch/${video.id}`}
                  className="flex flex-col gap-2"
                  aria-label={`Watch ${video.title}`}
                >
                  <div className="relative aspect-video rounded-xl overflow-hidden bg-[var(--bg-surface-elevated)]">
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
                  <h3 className="font-semibold text-sm leading-snug text-[var(--text-primary)] line-clamp-2">
                    {video.title}
                  </h3>
                  <p className="text-xs text-[var(--text-secondary)] mt-1 flex items-center gap-1">
                    <span>{formatViews(video.views)}</span>
                    <span>•</span>
                    <span>{formatRelativeTime(video.publishedAt)}</span>
                  </p>
                </Link>
              ))}
              {isLoadingMore && (
                <div className="flex flex-col gap-2">
                  <div className="aspect-video rounded-xl bg-[var(--skeleton)] animate-pulse" />
                  <div className="h-4 w-3/4 bg-[var(--skeleton)] animate-pulse rounded" />
                  <div className="h-3 w-1/2 bg-[var(--skeleton)] animate-pulse rounded" />
                </div>
              )}
              {errorMore && (
                <div className="flex flex-col items-center justify-center gap-2 p-3 text-center">
                  <p className="text-xs text-[var(--text-secondary)]">
                    {errorMore}
                  </p>
                  <button
                    type="button"
                    onClick={retry}
                    className="text-xs text-[var(--accent)] hover:underline"
                  >
                    Retry
                  </button>
                </div>
              )}
            </div>
            {!hasMore && feedVideos.length > 0 && (
              <p className="text-xs text-[var(--text-secondary)] text-center">
                No more videos from your subscriptions
              </p>
            )}
            <div ref={sentinelRef} className="h-4 w-full" aria-hidden="true" />
          </>
        )}

        {error && !feedVideos.length && (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <p className="text-sm text-[var(--text-secondary)] mb-3">{error}</p>
            <button
              type="button"
              onClick={retry}
              className="text-sm text-[var(--accent)] hover:underline"
            >
              Retry
            </button>
          </div>
        )}
      </section>
    </div>
  )
}

Subscriptions.propTypes = {}

function LinkPlaceholder({ channel }) {
  return (
    <div
      className="relative group"
      aria-label={channel.name}
      onClick={() => {
        window.location.href = `/channel/${channel.id}`
      }}
      role="link"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          window.location.href = `/channel/${channel.id}`
        }
      }}
    >
      <Avatar src={channel.avatar} name={channel.name} size="xs" />
      <span
        className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-[var(--accent)] text-[var(--bg-base)] text-[10px] px-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap"
      >
        Subscribed
      </span>
    </div>
  )
}

LinkPlaceholder.propTypes = {
  channel: PropTypes.object.isRequired,
}

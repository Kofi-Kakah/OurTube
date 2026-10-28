import { useState, useCallback } from 'react'
import PropTypes from 'prop-types'
import { Bell, BellOff, Check } from 'lucide-react'
import { useUserStore } from '@/store'
import { useToast } from '@/components/common'

/**
 * Subscribe / Unsubscribe toggle for a channel, with a bell/notification
 * toggle (UI only) and an inline unsubscribe confirmation. Subscriber count
 * updates optimistically and an undo toast is shown on unsubscribe.
 */
export default function SubscribeButton({ channelId, channelName, subscriberCount }) {
  const { showToast } = useToast()
  const { isSubscribed, subscribe, unsubscribe } = useUserStore()

  const subscribed = isSubscribed(channelId)
  const [notificationsOn, setNotificationsOn] = useState(false)
  const [confirmUnsubscribe, setConfirmUnsubscribe] = useState(false)

  const handleSubscribe = useCallback(() => {
    subscribe(channelId)
  }, [channelId, subscribe])

  const handleUnsubscribe = useCallback(() => {
    setConfirmUnsubscribe(false)
    unsubscribe(channelId)
    showToast({
      message: `Unsubscribed from ${channelName}`,
      type: 'info',
      duration: 5000,
      action: {
        label: 'Undo',
        onClick: () => {
          subscribe(channelId)
        },
      },
    })
  }, [channelId, channelName, unsubscribe, subscribe, showToast])

  const handleNotifyToggle = useCallback(() => {
    setNotificationsOn((prev) => !prev)
  }, [])

  if (confirmUnsubscribe) {
    return (
      <div className="flex items-center gap-2">
        <span className="text-xs text-[var(--text-secondary)]">
          Unsubscribe from {channelName}?
        </span>
        <button
          type="button"
          onClick={handleUnsubscribe}
          className="px-2.5 py-1 rounded text-xs font-medium text-[var(--danger)] bg-[var(--danger)]/10 hover:bg-[var(--danger)]/20 transition-colors"
        >
          Confirm
        </button>
        <button
          type="button"
          onClick={() => setConfirmUnsubscribe(false)}
          className="px-2.5 py-1 rounded text-xs font-medium text-[var(--text-secondary)] hover:bg-[var(--bg-surface-elevated)] transition-colors"
        >
          Cancel
        </button>
      </div>
    )
  }

  return (
    <div className="flex items-center gap-2">
      {subscribed ? (
        <>
          <button
            type="button"
            onClick={() => setConfirmUnsubscribe(true)}
            aria-pressed={true}
            aria-label="Subscribed. Click to unsubscribe."
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-[var(--accent)] bg-[var(--accent)]/10 border border-[var(--accent)]/20 hover:bg-[var(--accent)]/20 transition-colors"
          >
            <Check className="w-3.5 h-3.5 fill-current" />
            <span>Subscribed</span>
          </button>
          <button
            type="button"
            onClick={handleNotifyToggle}
            aria-pressed={notificationsOn}
            aria-label={notificationsOn ? 'Notifications on' : 'Notifications off'}
            className={`p-1.5 rounded-lg transition-colors ${
              notificationsOn
                ? 'text-yellow-500 bg-[var(--bg-surface-elevated)]'
                : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface-elevated)]'
            }`}
          >
            {notificationsOn ? (
              <Bell className="w-4 h-4 fill-current" />
            ) : (
              <BellOff className="w-4 h-4" />
            )}
          </button>
        </>
      ) : (
        <button
          type="button"
          onClick={handleSubscribe}
          aria-pressed={false}
          aria-label={`Subscribe to ${channelName}`}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-white bg-[var(--accent)] hover:bg-[var(--accent-hover)] transition-colors"
        >
          <span>Subscribe</span>
        </button>
      )}

      <span className="text-xs text-[var(--text-secondary)]">
        {subscriberCount.toLocaleString()} subscribers
      </span>
    </div>
  )
}

SubscribeButton.propTypes = {
  channelId: PropTypes.string.isRequired,
  channelName: PropTypes.string.isRequired,
  subscriberCount: PropTypes.number.isRequired,
}

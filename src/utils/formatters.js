/**
 * Formats duration in seconds into standard video timestamp format (MM:SS or HH:MM:SS)
 * @param {number} seconds
 * @returns {string}
 */
export function formatDuration(seconds) {
  if (seconds == null || isNaN(seconds) || seconds < 0) {
    return '0:00'
  }

  const totalSeconds = Math.floor(seconds)
  const hrs = Math.floor(totalSeconds / 3600)
  const mins = Math.floor((totalSeconds % 3600) / 60)
  const secs = totalSeconds % 60

  const paddedSecs = secs.toString().padStart(2, '0')

  if (hrs > 0) {
    const paddedMins = mins.toString().padStart(2, '0')
    return `${hrs}:${paddedMins}:${paddedSecs}`
  }

  return `${mins}:${paddedSecs}`
}

/**
 * Formats view count into compact human readable format (e.g. 1.2K, 3.4M)
 * @param {number} views
 * @returns {string}
 */
export function formatViews(views) {
  if (views == null || isNaN(views) || views < 0) {
    return '0 views'
  }

  const num = Number(views)

  if (num < 1000) {
    return `${num} ${num === 1 ? 'view' : 'views'}`
  }

  const formatWithSuffix = (value, divisor, suffix) => {
    const divided = value / divisor
    const formatted =
      divided >= 10 || divided % 1 === 0
        ? Math.floor(divided)
        : Number(divided.toFixed(1))
    return `${formatted}${suffix} views`
  }

  if (num >= 1_000_000_000) {
    return formatWithSuffix(num, 1_000_000_000, 'B')
  }
  if (num >= 1_000_000) {
    return formatWithSuffix(num, 1_000_000, 'M')
  }
  return formatWithSuffix(num, 1_000, 'K')
}

/**
 * Formats subscriber count into compact representation
 * @param {number} count
 * @returns {string}
 */
export function formatSubscribers(count) {
  if (count == null || isNaN(count) || count < 0) {
    return '0 subscribers'
  }

  const num = Number(count)
  if (num === 1) return '1 subscriber'

  const formatWithSuffix = (value, divisor, suffix) => {
    const divided = value / divisor
    const formatted =
      divided >= 10 || divided % 1 === 0
        ? Math.floor(divided)
        : Number(divided.toFixed(1))
    return `${formatted}${suffix} subscribers`
  }

  if (num >= 1_000_000) {
    return formatWithSuffix(num, 1_000_000, 'M')
  }
  if (num >= 1_000) {
    return formatWithSuffix(num, 1_000, 'K')
  }
  return `${num} subscribers`
}

/**
 * Formats an ISO date or timestamp into relative time string ("3 hours ago", "2 days ago")
 * @param {string|number|Date} dateInput
 * @returns {string}
 */
export function formatRelativeTime(dateInput) {
  if (!dateInput) return ''

  const date = new Date(dateInput)
  if (isNaN(date.getTime())) return ''

  const now = new Date()
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)

  if (diffInSeconds < 30) {
    return 'just now'
  }
  if (diffInSeconds < 60) {
    return `${diffInSeconds} seconds ago`
  }

  const diffInMinutes = Math.floor(diffInSeconds / 60)
  if (diffInMinutes < 60) {
    return `${diffInMinutes} ${diffInMinutes === 1 ? 'minute' : 'minutes'} ago`
  }

  const diffInHours = Math.floor(diffInMinutes / 60)
  if (diffInHours < 24) {
    return `${diffInHours} ${diffInHours === 1 ? 'hour' : 'hours'} ago`
  }

  const diffInDays = Math.floor(diffInHours / 24)
  if (diffInDays < 7) {
    return `${diffInDays} ${diffInDays === 1 ? 'day' : 'days'} ago`
  }

  const diffInWeeks = Math.floor(diffInDays / 7)
  if (diffInWeeks < 4) {
    return `${diffInWeeks} ${diffInWeeks === 1 ? 'week' : 'weeks'} ago`
  }

  const diffInMonths = Math.floor(diffInDays / 30)
  if (diffInMonths < 12) {
    return `${diffInMonths} ${diffInMonths === 1 ? 'month' : 'months'} ago`
  }

  const diffInYears = Math.floor(diffInDays / 365)
  return `${diffInYears} ${diffInYears === 1 ? 'year' : 'years'} ago`
}

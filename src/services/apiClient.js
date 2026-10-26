/**
 * Simulates network latency and optional failure injection for testing error UI
 * @param {number} minMs
 * @param {number} maxMs
 * @param {boolean} forceError
 */
export async function simulateNetwork({
  minMs = 200,
  maxMs = 500,
  forceError = false,
} = {}) {
  const shouldSimulateErrors =
    typeof import.meta !== 'undefined' &&
    import.meta.env?.VITE_SIMULATE_ERRORS === 'true'

  if (forceError || shouldSimulateErrors) {
    throw new Error(
      'Simulated network error: Failed to fetch from mock server.'
    )
  }

  const duration = Math.floor(Math.random() * (maxMs - minMs + 1)) + minMs
  await new Promise((resolve) => setTimeout(resolve, duration))
}

/**
 * Paginates an array and returns standard paginated response shape
 * @template T
 * @param {T[]} items
 * @param {number} page
 * @param {number} limit
 * @returns {{ items: T[], page: number, hasMore: boolean, total: number }}
 */
export function paginate(items, page = 1, limit = 12) {
  const currentPage = Math.max(1, Number(page) || 1)
  const currentLimit = Math.max(1, Number(limit) || 12)

  const startIndex = (currentPage - 1) * currentLimit
  const endIndex = startIndex + currentLimit
  const paginatedItems = items.slice(startIndex, endIndex)
  const total = items.length
  const hasMore = endIndex < total

  return {
    items: paginatedItems,
    page: currentPage,
    hasMore,
    total,
  }
}

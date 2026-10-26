import { describe, it, expect } from 'vitest'
import {
  formatDuration,
  formatViews,
  formatSubscribers,
  formatRelativeTime,
} from '@/utils/formatters'

describe('Formatters', () => {
  describe('formatDuration', () => {
    it('formats seconds into MM:SS correctly', () => {
      expect(formatDuration(0)).toBe('0:00')
      expect(formatDuration(45)).toBe('0:45')
      expect(formatDuration(75)).toBe('1:15')
      expect(formatDuration(599)).toBe('9:59')
    })

    it('formats long durations into HH:MM:SS', () => {
      expect(formatDuration(3600)).toBe('1:00:00')
      expect(formatDuration(3665)).toBe('1:01:05')
      expect(formatDuration(7325)).toBe('2:02:05')
    })

    it('handles negative or invalid input safely', () => {
      expect(formatDuration(-10)).toBe('0:00')
      expect(formatDuration(null)).toBe('0:00')
      expect(formatDuration(undefined)).toBe('0:00')
      expect(formatDuration(NaN)).toBe('0:00')
    })
  })

  describe('formatViews', () => {
    it('formats small view counts with singular and plural', () => {
      expect(formatViews(0)).toBe('0 views')
      expect(formatViews(1)).toBe('1 view')
      expect(formatViews(450)).toBe('450 views')
    })

    it('formats thousands with K suffix', () => {
      expect(formatViews(1200)).toBe('1.2K views')
      expect(formatViews(10500)).toBe('10K views')
      expect(formatViews(850000)).toBe('850K views')
    })

    it('formats millions and billions with M and B suffix', () => {
      expect(formatViews(1500000)).toBe('1.5M views')
      expect(formatViews(24000000)).toBe('24M views')
      expect(formatViews(1200000000)).toBe('1.2B views')
    })

    it('handles invalid numbers', () => {
      expect(formatViews(null)).toBe('0 views')
      expect(formatViews(undefined)).toBe('0 views')
    })
  })

  describe('formatSubscribers', () => {
    it('formats subscribers correctly', () => {
      expect(formatSubscribers(1)).toBe('1 subscriber')
      expect(formatSubscribers(500)).toBe('500 subscribers')
      expect(formatSubscribers(1500)).toBe('1.5K subscribers')
      expect(formatSubscribers(2400000)).toBe('2.4M subscribers')
    })
  })

  describe('formatRelativeTime', () => {
    it('formats relative time for various intervals', () => {
      const now = Date.now()
      const justNow = new Date(now - 10 * 1000).toISOString()
      const fiveMinsAgo = new Date(now - 5 * 60 * 1000).toISOString()
      const twoHoursAgo = new Date(now - 2 * 3600 * 1000).toISOString()
      const threeDaysAgo = new Date(now - 3 * 24 * 3600 * 1000).toISOString()
      const twoWeeksAgo = new Date(now - 14 * 24 * 3600 * 1000).toISOString()
      const fourMonthsAgo = new Date(now - 120 * 24 * 3600 * 1000).toISOString()
      const twoYearsAgo = new Date(now - 730 * 24 * 3600 * 1000).toISOString()

      expect(formatRelativeTime(justNow)).toBe('just now')
      expect(formatRelativeTime(fiveMinsAgo)).toBe('5 minutes ago')
      expect(formatRelativeTime(twoHoursAgo)).toBe('2 hours ago')
      expect(formatRelativeTime(threeDaysAgo)).toBe('3 days ago')
      expect(formatRelativeTime(twoWeeksAgo)).toBe('2 weeks ago')
      expect(formatRelativeTime(fourMonthsAgo)).toBe('4 months ago')
      expect(formatRelativeTime(twoYearsAgo)).toBe('2 years ago')
    })

    it('handles invalid dates gracefully', () => {
      expect(formatRelativeTime('')).toBe('')
      expect(formatRelativeTime('invalid-date')).toBe('')
    })
  })
})

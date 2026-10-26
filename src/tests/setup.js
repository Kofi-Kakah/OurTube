import '@testing-library/jest-dom'
import { vi } from 'vitest'

// Mock IntersectionObserver
class MockIntersectionObserver {
  observe = vi.fn()
  disconnect = vi.fn()
  unobserve = vi.fn()
}

Object.defineProperty(window, 'IntersectionObserver', {
  writable: true,
  configurable: true,
  value: MockIntersectionObserver,
})

// Mock HTMLMediaElement play/pause/load
Object.defineProperty(window.HTMLMediaElement.prototype, 'play', {
  configurable: true,
  value: vi.fn().mockImplementation(() => Promise.resolve()),
})

Object.defineProperty(window.HTMLMediaElement.prototype, 'pause', {
  configurable: true,
  value: vi.fn(),
})

Object.defineProperty(window.HTMLMediaElement.prototype, 'load', {
  configurable: true,
  value: vi.fn(),
})

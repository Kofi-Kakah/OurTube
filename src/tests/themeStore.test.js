import { describe, it, expect, beforeEach } from 'vitest'
import { useThemeStore } from '@/store/themeStore'

describe('useThemeStore', () => {
  beforeEach(() => {
    localStorage.clear()
    document.documentElement.removeAttribute('data-theme')
    document.documentElement.classList.remove('dark')
    useThemeStore.setState({ theme: 'system', resolvedTheme: 'light' })
  })

  it('initializes with default system theme', () => {
    const { theme } = useThemeStore.getState()
    expect(theme).toBe('system')
  })

  it('updates theme to dark and sets data-theme and dark class', () => {
    useThemeStore.getState().setTheme('dark')
    expect(useThemeStore.getState().theme).toBe('dark')
    expect(useThemeStore.getState().resolvedTheme).toBe('dark')
    expect(document.documentElement.getAttribute('data-theme')).toBe('dark')
    expect(document.documentElement.classList.contains('dark')).toBe(true)
  })

  it('updates theme to light and removes dark class', () => {
    useThemeStore.getState().setTheme('dark')
    useThemeStore.getState().setTheme('light')
    expect(useThemeStore.getState().theme).toBe('light')
    expect(useThemeStore.getState().resolvedTheme).toBe('light')
    expect(document.documentElement.getAttribute('data-theme')).toBe('light')
    expect(document.documentElement.classList.contains('dark')).toBe(false)
  })
})

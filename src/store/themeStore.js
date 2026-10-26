import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const getSystemTheme = () => {
  if (typeof window === 'undefined') return 'light'
  return window.matchMedia &&
    window.matchMedia('(prefers-color-scheme: dark)').matches
    ? 'dark'
    : 'light'
}

const applyThemeToDOM = (resolvedTheme) => {
  if (typeof document === 'undefined') return
  document.documentElement.setAttribute('data-theme', resolvedTheme)
  if (resolvedTheme === 'dark') {
    document.documentElement.classList.add('dark')
  } else {
    document.documentElement.classList.remove('dark')
  }
}

export const useThemeStore = create(
  persist(
    (set, get) => ({
      theme: 'system', // 'light' | 'dark' | 'system'
      resolvedTheme: getSystemTheme(),

      setTheme: (newTheme) => {
        const resolved = newTheme === 'system' ? getSystemTheme() : newTheme
        applyThemeToDOM(resolved)
        set({ theme: newTheme, resolvedTheme: resolved })
      },

      initTheme: () => {
        const currentTheme = get().theme
        const resolved =
          currentTheme === 'system' ? getSystemTheme() : currentTheme
        applyThemeToDOM(resolved)
        set({ resolvedTheme: resolved })

        if (typeof window !== 'undefined' && window.matchMedia) {
          const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
          const handleChange = (e) => {
            if (get().theme === 'system') {
              const updatedResolved = e.matches ? 'dark' : 'light'
              applyThemeToDOM(updatedResolved)
              set({ resolvedTheme: updatedResolved })
            }
          }
          mediaQuery.addEventListener?.('change', handleChange)
          return () => mediaQuery.removeEventListener?.('change', handleChange)
        }
      },
    }),
    {
      name: 'ourtube-theme-storage',
      partialize: (state) => ({ theme: state.theme }),
    }
  )
)

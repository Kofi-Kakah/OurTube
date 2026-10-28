import { useState, useEffect } from 'react'
import { Outlet } from 'react-router-dom'
import { useThemeStore } from '@/store'
import { ErrorBoundary } from '@/components/common'
import Navbar from './Navbar'
import Sidebar from './Sidebar'
import MobileDrawer from './MobileDrawer'
import MobileBottomNav from './MobileBottomNav'

export default function AppShell() {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false)
  const initTheme = useThemeStore((state) => state.initTheme)

  // Initialize theme listeners and sync
  useEffect(() => {
    const cleanup = initTheme()
    return () => cleanup?.()
  }, [initTheme])

  const handleToggleSidebar = () => {
    // If mobile width (< 768px), open drawer
    if (window.innerWidth < 768) {
      setIsMobileDrawerOpen(true)
    } else {
      setIsSidebarCollapsed((prev) => !prev)
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-[var(--bg-base)] text-[var(--text-primary)]">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:text-white focus:bg-[var(--accent)] focus:rounded focus:outline-none"
      >
        Skip to content
      </a>
      <Navbar onToggleSidebar={handleToggleSidebar} />

      <div className="flex-1 flex w-full">
        <Sidebar isCollapsed={isSidebarCollapsed} />

        <MobileDrawer
          isOpen={isMobileDrawerOpen}
          onClose={() => setIsMobileDrawerOpen(false)}
        />

        <main
          id="main-content"
          tabIndex={-1}
          className="flex-1 overflow-x-hidden p-4 md:p-6 pb-20 md:pb-8 focus:outline-none"
        >
          <ErrorBoundary>
            <Outlet />
          </ErrorBoundary>
        </main>
      </div>

      <MobileBottomNav />
    </div>
  )
}

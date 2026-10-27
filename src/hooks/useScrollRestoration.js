import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

const scrollPositions = new Map()

export function useScrollRestoration(isReady = true) {
  const { pathname } = useLocation()

  // Restore scroll position once data is ready
  useEffect(() => {
    if (!isReady) return

    const savedPosition = scrollPositions.get(pathname)
    if (typeof savedPosition === 'number' && savedPosition > 0) {
      window.scrollTo({
        top: savedPosition,
        behavior: 'instant',
      })
    }
  }, [pathname, isReady])

  // Save scroll position on unmount or before navigating away
  useEffect(() => {
    const handleScroll = () => {
      scrollPositions.set(pathname, window.scrollY)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [pathname])
}

export default useScrollRestoration


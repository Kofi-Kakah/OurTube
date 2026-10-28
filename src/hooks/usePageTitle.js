import { useEffect } from 'react'

/**
 * usePageTitle — sets the document <title> when the component mounts and
 * restores the previous title on unmount. Call once per page with the
 * desired title string.
 */
export default function usePageTitle(title) {
  const previousTitle = document.title

  useEffect(() => {
    document.title = title
    return () => {
      document.title = previousTitle
    }
  }, [title, previousTitle])
}

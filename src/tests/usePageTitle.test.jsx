import { render } from '@testing-library/react'
import { describe, it, expect, afterEach } from 'vitest'
import usePageTitle from '@/hooks/usePageTitle'

function TitleTester({ title }) {
  usePageTitle(title)
  return <div data-testid="content">{title}</div>
}

TitleTester.propTypes = {}

describe('usePageTitle', () => {
  const baseTitle = document.title

  afterEach(() => {
    document.title = baseTitle
  })

  it('sets document.title on mount', () => {
    render(<TitleTester title="Watch — OurTube" />)
    expect(document.title).toBe('Watch — OurTube')
  })

  it('updates document.title when title changes', () => {
    const { rerender } = render(<TitleTester title="Home — OurTube" />)
    rerender(<TitleTester title="Profile — OurTube" />)
    expect(document.title).toBe('Profile — OurTube')
  })

  it('restores previous title on unmount', () => {
    const titleBeforeMount = document.title
    const { unmount } = render(<TitleTester title="Search — OurTube" />)
    expect(document.title).toBe('Search — OurTube')
    unmount()
    expect(document.title).toBe(titleBeforeMount)
  })
})

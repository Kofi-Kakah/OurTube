import { render, screen, fireEvent, act } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts'

function ShortcutTester({
  enabled = true,
  currentPlaybackRate = 1,
  ...callbacks
}) {
  const { indicator } = useKeyboardShortcuts({
    enabled,
    currentPlaybackRate,
    ...callbacks,
  })
  return (
    <div data-testid="root">
      {indicator && <span data-testid="indicator">{indicator.text}</span>}
    </div>
  )
}

ShortcutTester.propTypes = {}

describe('useKeyboardShortcuts', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('calls onPlayPause on Space', () => {
    const onPlayPause = vi.fn()
    render(<ShortcutTester onPlayPause={onPlayPause} />)
    fireEvent.keyDown(document, { key: ' ' })
    expect(onPlayPause).toHaveBeenCalledTimes(1)
  })

  it('calls onPlayPause on k', () => {
    const onPlayPause = vi.fn()
    render(<ShortcutTester onPlayPause={onPlayPause} />)
    fireEvent.keyDown(document, { key: 'k' })
    expect(onPlayPause).toHaveBeenCalledTimes(1)
  })

  it('calls onToggleMute on m', () => {
    const onToggleMute = vi.fn()
    render(<ShortcutTester onToggleMute={onToggleMute} />)
    fireEvent.keyDown(document, { key: 'm' })
    expect(onToggleMute).toHaveBeenCalledTimes(1)
  })

  it('calls onToggleHelp on ?', () => {
    const onToggleHelp = vi.fn()
    render(<ShortcutTester onToggleHelp={onToggleHelp} />)
    fireEvent.keyDown(document, { key: '?' })
    expect(onToggleHelp).toHaveBeenCalledTimes(1)
  })

  it('calls onSeekForward10 on l', () => {
    const onSeekForward10 = vi.fn()
    render(<ShortcutTester onSeekForward10={onSeekForward10} />)
    fireEvent.keyDown(document, { key: 'l' })
    expect(onSeekForward10).toHaveBeenCalledTimes(1)
  })

  it('calls onSetPlaybackRate with increased rate on >', () => {
    const onSetPlaybackRate = vi.fn()
    render(<ShortcutTester currentPlaybackRate={1} onSetPlaybackRate={onSetPlaybackRate} />)
    fireEvent.keyDown(document, { key: '>' })
    expect(onSetPlaybackRate).toHaveBeenCalledWith(1.25)
  })

  it('calls onJumpToPercent on digit keys', () => {
    const onJumpToPercent = vi.fn()
    render(<ShortcutTester onJumpToPercent={onJumpToPercent} />)
    fireEvent.keyDown(document, { key: '5' })
    expect(onJumpToPercent).toHaveBeenCalledWith(50)
  })

  it('calls onNextVideo on Shift+N', () => {
    const onNextVideo = vi.fn()
    render(<ShortcutTester onNextVideo={onNextVideo} />)
    fireEvent.keyDown(document, { key: 'n', shiftKey: true })
    expect(onNextVideo).toHaveBeenCalledTimes(1)
  })

  it('does not fire shortcuts when typing in an input', () => {
    const onPlayPause = vi.fn()
    const { container } = render(<ShortcutTester onPlayPause={onPlayPause} />)
    const input = document.createElement('input')
    container.appendChild(input)
    input.focus()
    fireEvent.keyDown(input, { key: ' ' })
    expect(onPlayPause).not.toHaveBeenCalled()
  })

  it('does not fire when disabled', () => {
    const onPlayPause = vi.fn()
    render(<ShortcutTester enabled={false} onPlayPause={onPlayPause} />)
    fireEvent.keyDown(document, { key: ' ' })
    expect(onPlayPause).not.toHaveBeenCalled()
  })

  it('shows an indicator briefly when a shortcut fires', () => {
    const onPlayPause = vi.fn()
    render(<ShortcutTester onPlayPause={onPlayPause} />)
    fireEvent.keyDown(document, { key: ' ' })
    expect(screen.getByTestId('indicator')).toHaveTextContent('Play / pause')
    act(() => {
      vi.advanceTimersByTime(1300)
    })
    expect(screen.queryByTestId('indicator')).not.toBeInTheDocument()
  })
})

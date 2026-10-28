import { useState, useEffect, useRef, useCallback } from 'react'

/**
 * useKeyboardShortcuts — global keyboard shortcuts for the video player.
 * Only fires when the user is NOT typing in an input/textarea/contenteditable.
 * Returns an on-screen indicator ({ text }) that the parent can render
 * briefly when a shortcut fires.
 *
 * Keys:
 *   Space / K      Play / pause
 *   ← / →          Seek −5s / +5s
 *   J / L          Seek −10s / +10s
 *   ↑ / ↓          Volume +/− 5%
 *   M              Mute / unmute
 *   F              Fullscreen
 *   T              Theater mode
 *   I              Picture-in-picture
 *   < / >          Decrease / increase speed
 *   0 – 9          Jump to 0% – 90%
 *   Home / End     Jump to start / end
 *   Shift + N      Next video
 *   ?              Toggle shortcuts help
 */
export function useKeyboardShortcuts({
  enabled = true,
  currentPlaybackRate = 1,
  onPlayPause,
  onSeekBackward5,
  onSeekForward5,
  onSeekBackward10,
  onSeekForward10,
  onVolumeUp,
  onVolumeDown,
  onToggleMute,
  onToggleFullscreen,
  onToggleTheater,
  onTogglePiP,
  onSetPlaybackRate,   // (rate) => void, absolute
  onJumpToPercent,     // (percent 0-100) => void
  onGoToStart,
  onGoToEnd,
  onNextVideo,
  onToggleHelp,
}) {
  const indicatorRef = useRef(null)
  const [indicator, setIndicator] = useState(null)

  const showIndicator = useCallback((text) => {
    setIndicator({ text })
    if (indicatorRef.current) clearTimeout(indicatorRef.current)
    indicatorRef.current = setTimeout(() => setIndicator(null), 1200)
  }, [])

  const isTyping = useCallback((target) => {
    return (
      target.tagName === 'INPUT' ||
      target.tagName === 'TEXTAREA' ||
      target.isContentEditable
    )
  }, [])

  useEffect(() => {
    if (!enabled) return

    const handleKeyDown = (event) => {
      if (isTyping(event.target)) return

      const key = event.key

      switch (key) {
        case ' ':
        case 'k':
        case 'K':
          event.preventDefault()
          onPlayPause?.()
          showIndicator('Play / pause')
          return
        case 'ArrowLeft':
          event.preventDefault()
          onSeekBackward5?.()
          showIndicator('−5s')
          return
        case 'ArrowRight':
          event.preventDefault()
          onSeekForward5?.()
          showIndicator('+5s')
          return
        case 'j':
        case 'J':
          event.preventDefault()
          onSeekBackward10?.()
          showIndicator('−10s')
          return
        case 'l':
        case 'L':
          event.preventDefault()
          onSeekForward10?.()
          showIndicator('+10s')
          return
        case 'ArrowUp':
          event.preventDefault()
          onVolumeUp?.()
          showIndicator('Volume up')
          return
        case 'ArrowDown':
          event.preventDefault()
          onVolumeDown?.()
          showIndicator('Volume down')
          return
        case 'm':
        case 'M':
          event.preventDefault()
          onToggleMute?.()
          showIndicator('Mute toggle')
          return
        case 'f':
        case 'F':
          event.preventDefault()
          onToggleFullscreen?.()
          showIndicator('Fullscreen')
          return
        case 't':
        case 'T':
          event.preventDefault()
          onToggleTheater?.()
          showIndicator('Theater mode')
          return
        case 'i':
        case 'I':
          event.preventDefault()
          onTogglePiP?.()
          showIndicator('Picture-in-picture')
          return
        case '<':
          event.preventDefault()
          onSetPlaybackRate?.(Math.max(0.25, currentPlaybackRate - 0.25))
          showIndicator(`${Math.max(0.25, currentPlaybackRate - 0.25)}x`)
          return
        case '>':
          event.preventDefault()
          onSetPlaybackRate?.(Math.min(2, currentPlaybackRate + 0.25))
          showIndicator(`${Math.min(2, currentPlaybackRate + 0.25)}x`)
          return
        case 'Home':
          event.preventDefault()
          onGoToStart?.()
          showIndicator('Start')
          return
        case 'End':
          event.preventDefault()
          onGoToEnd?.()
          showIndicator('End')
          return
        case '?':
          event.preventDefault()
          onToggleHelp?.()
          return
      }

      // Number keys 0-9 -> jump to 0%-90%
      const digit = Number(key)
      if (!isNaN(digit) && digit >= 0 && digit <= 9) {
        event.preventDefault()
        onJumpToPercent?.(digit * 10)
        showIndicator(`${digit * 10}%`)
        return
      }

      // Shift + N -> next video
      if (event.shiftKey && (key === 'n' || key === 'N')) {
        event.preventDefault()
        onNextVideo?.()
        showIndicator('Next video')
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [
    enabled,
    currentPlaybackRate,
    showIndicator,
    isTyping,
    onPlayPause,
    onSeekBackward5,
    onSeekForward5,
    onSeekBackward10,
    onSeekForward10,
    onVolumeUp,
    onVolumeDown,
    onToggleMute,
    onToggleFullscreen,
    onToggleTheater,
    onTogglePiP,
    onSetPlaybackRate,
    onJumpToPercent,
    onGoToStart,
    onGoToEnd,
    onNextVideo,
    onToggleHelp,
  ])

  return { indicator }
}

import { useState, useRef, useEffect, useCallback } from 'react'

const CONTROLS_HIDE_DELAY = 3000
const TIME_UPDATE_THROTTLE_MS = 100
const DOUBLE_TAP_WINDOW_MS = 400
const SKIP_SECONDS = 10

/**
 * useVideoPlayer — owns the <video> element and all playback state/actions.
 * Exposes a ref callback to attach to <video>, plus presentational state and
 * imperative play/pause/seek/volume/fullscreen/theater controls.
 *
 * All high-frequency values (currentTime) live in local component state, never
 * in global stores. Media event listeners are cleaned up on unmount.
 */
export function useVideoPlayer({
  video,
  autoPlay = false,
  videoRef,
  onPlay,
  onPause,
  onTimeUpdate,
  onEnded,
  onSeeked,
  onWaiting,
  onError,
}) {
  const elRef = useRef(null)
  const containerRef = useRef(null)
  const hideTimerRef = useRef(null)
  const lastSaveRef = useRef(0)
  const isDraggingRef = useRef(false)
  const rememberVolumeRef = useRef(1)
  const lastTapRef = useRef(0)
  const isPlayingRef = useRef(false)
  const isHoveredRef = useRef(false)

  const [state, setState] = useState({
    isPlaying: false,
    isWaiting: true,
    currentTime: 0,
    duration: 0,
    buffered: 0,
    volume: 1,
    muted: false,
    error: null,
    controlsVisible: true,
    isHovered: false,
    showBigPlay: true,
    isFullscreen: false,
    isTheater: false,
    playbackRate: 1,
    quality: 'auto',
  })

  const set = useCallback((next) => setState((prev) => ({ ...prev, ...next })), [])
  const el = useCallback(() => elRef.current, [])

  const exposeRef = useCallback(
    (node) => {
      elRef.current = node
      if (videoRef && typeof videoRef === 'function') videoRef(node)
    },
    [videoRef]
  )

  const play = useCallback(() => {
    const e = el()
    if (!e) return
    e.play().catch(() => {})
  }, [el])

  const pause = useCallback(() => {
    const e = el()
    if (!e) return
    e.pause()
  }, [el])

  const togglePlay = useCallback(() => {
    const e = el()
    if (!e) return
    if (e.paused) e.play().catch(() => {})
    else e.pause()
  }, [el])

  const seek = useCallback(
    (seconds) => {
      const e = el()
      if (!e || !e.duration) return
      e.currentTime = Math.max(0, Math.min(seconds, e.duration))
    },
    [el]
  )

  const setVolume = useCallback(
    (nextVolume) => {
      const e = el()
      if (!e) return
      const vol = Math.max(0, Math.min(1, nextVolume))
      rememberVolumeRef.current = vol
      e.muted = false
      e.volume = vol
      set({ muted: false, volume: vol })
    },
    [el, set]
  )

  const toggleMute = useCallback(() => {
    const e = el()
    if (!e) return
    const next = !state.muted
    e.muted = next
    if (!next) {
      e.volume = rememberVolumeRef.current
      set({ muted: false, volume: rememberVolumeRef.current })
    } else {
      set({ muted: true, volume: 0 })
    }
  }, [el, state.muted, set])

  const toggleFullscreen = useCallback(() => {
    const c = containerRef.current
    if (!c) return
    if (!document.fullscreenElement) {
      c.requestFullscreen().catch(() => {})
    } else {
      document.exitFullscreen().catch(() => {})
    }
  }, [])

  const toggleTheater = useCallback(() => setState((prev) => ({ ...prev, isTheater: !prev.isTheater })), [])

  const setPlaybackRate = useCallback(
    (rate) => {
      const e = el()
      if (!e) return
      e.playbackRate = rate
      setState((prev) => ({ ...prev, playbackRate: rate }))
    },
    [el]
  )

  const setQuality = useCallback((q) => setState((prev) => ({ ...prev, quality: q })), [])

  const retry = useCallback(() => {
    setState((prev) => ({ ...prev, error: null, isWaiting: true }))
    const e = el()
    if (!e) return
    e.load()
    e.play().catch(() => {})
  }, [el])

  const scheduleHide = useCallback(() => {
    clearTimeout(hideTimerRef.current)
    if (isPlayingRef.current) {
      hideTimerRef.current = setTimeout(() => {
        if (!isHoveredRef.current && !isDraggingRef.current) {
          setState((prev) => ({ ...prev, controlsVisible: false }))
        }
      }, CONTROLS_HIDE_DELAY)
    }
  }, [])

  const showControls = useCallback(() => {
    setState((prev) => ({ ...prev, controlsVisible: true }))
    scheduleHide()
  }, [scheduleHide])

  // ---------- media event handlers ----------

  const handlePlay = useCallback(() => {
    isPlayingRef.current = true
    setState((prev) => ({ ...prev, isPlaying: true, isWaiting: false, showBigPlay: false }))
    scheduleHide()
    onPlay?.()
  }, [scheduleHide, onPlay])

  const handlePause = useCallback(() => {
    isPlayingRef.current = false
    setState((prev) => ({ ...prev, isPlaying: false, controlsVisible: true, showBigPlay: true }))
    onPause?.()
  }, [onPause])

  const handleWaiting = useCallback(() => {
    setState((prev) => ({ ...prev, isWaiting: true }))
    onWaiting?.()
  }, [onWaiting])

  const handlePlaying = useCallback(() => {
    setState((prev) => ({ ...prev, isWaiting: false, isPlaying: true }))
    scheduleHide()
  }, [scheduleHide])

  const handleTimeUpdate = useCallback(() => {
    const e = el()
    if (!e || isDraggingRef.current) return
    const now = Date.now()
    if (now - lastSaveRef.current < TIME_UPDATE_THROTTLE_MS) return
    lastSaveRef.current = now
    setState((prev) => ({ ...prev, currentTime: e.currentTime }))
    onTimeUpdate?.()
  }, [el, onTimeUpdate])

  const handleDurationChange = useCallback(() => {
    const e = el()
    if (!e) return
    setState((prev) => ({ ...prev, duration: e.duration || 0 }))
  }, [el])

  const handleProgress = useCallback(() => {
    const e = el()
    if (!e || !e.duration) return
    const ranges = e.buffered
    let pct = 0
    for (let i = 0; i < ranges.length; i++) {
      if (e.currentTime >= ranges.start(i) && e.currentTime <= ranges.end(i)) {
        pct = ranges.end(i) / e.duration
        break
      }
    }
    setState((prev) => ({ ...prev, buffered: pct }))
  }, [el])

  const handleEnded = useCallback(() => {
    isPlayingRef.current = false
    setState((prev) => ({ ...prev, isPlaying: false, controlsVisible: true, showBigPlay: true }))
    onEnded?.()
  }, [onEnded])

  const handleError = useCallback(() => {
    setState((prev) => ({ ...prev, isWaiting: false, error: 'Unable to play this video. Please try again later.' }))
    onError?.()
  }, [onError])

  const handleSeeked = useCallback(() => {
    onSeeked?.()
  }, [onSeeked])

  // ---------- container interaction (controls show/hide) ----------

  useEffect(() => {
    const c = containerRef.current
    if (!c) return
    const onMove = () => showControls()
    const onLeave = () => {
      if (isPlayingRef.current) scheduleHide()
    }
    c.addEventListener('mousemove', onMove)
    c.addEventListener('mouseenter', onMove)
    c.addEventListener('mouseleave', onLeave)
    c.addEventListener('touchstart', onMove, { passive: true })
    c.addEventListener('keydown', onMove)
    return () => {
      c.removeEventListener('mousemove', onMove)
      c.removeEventListener('mouseenter', onMove)
      c.removeEventListener('mouseleave', onLeave)
      c.removeEventListener('touchstart', onMove)
      c.removeEventListener('keydown', onMove)
    }
  }, [showControls, scheduleHide])

  // ---------- double-tap skip on mobile ----------

  useEffect(() => {
    const c = containerRef.current
    if (!c) return
    const onTouchStart = (event) => {
      const now = Date.now()
      const diff = now - lastTapRef.current
      const touch = event.touches[0]
      const rect = c.getBoundingClientRect()
      const half = rect.width / 2
      if (diff > 0 && diff < DOUBLE_TAP_WINDOW_MS) {
        event.preventDefault()
        const e = el()
        const cur = e ? e.currentTime : 0
        const dur = e ? e.duration : 0
        if (touch.clientX < rect.left + half) seek(Math.max(0, cur - SKIP_SECONDS))
        else seek(Math.min(dur, cur + SKIP_SECONDS))
      }
      lastTapRef.current = now
    }
    c.addEventListener('touchstart', onTouchStart, { passive: false })
    return () => c.removeEventListener('touchstart', onTouchStart)
  }, [seek, el])

  // ---------- fullscreen change ----------

  useEffect(() => {
    const onChange = () => setState((prev) => ({ ...prev, isFullscreen: !!document.fullscreenElement }))
    document.addEventListener('fullscreenchange', onChange)
    return () => document.removeEventListener('fullscreenchange', onChange)
  }, [])

  // ---------- sources / src ----------

  useEffect(() => {
    const e = el()
    if (!e || !video) return
    const source = video.sources?.[0]
    if (source && e.src !== source.url) {
      e.src = source.url
    }
    e.load()
    if (autoPlay) e.play().catch(() => {})
    return () => {
      e.pause()
      e.src = ''
      e.load()
    }
  }, [video, autoPlay, el])

  // ---------- wire media event listeners ----------

  useEffect(() => {
    const e = el()
    if (!e) return
    e.volume = rememberVolumeRef.current
    e.muted = state.muted
    e.playbackRate = state.playbackRate

    e.addEventListener('play', handlePlay)
    e.addEventListener('pause', handlePause)
    e.addEventListener('waiting', handleWaiting)
    e.addEventListener('playing', handlePlaying)
    e.addEventListener('timeupdate', handleTimeUpdate)
    e.addEventListener('durationchange', handleDurationChange)
    e.addEventListener('progress', handleProgress)
    e.addEventListener('ended', handleEnded)
    e.addEventListener('error', handleError)
    e.addEventListener('seeked', handleSeeked)

    return () => {
      e.removeEventListener('play', handlePlay)
      e.removeEventListener('pause', handlePause)
      e.removeEventListener('waiting', handleWaiting)
      e.removeEventListener('playing', handlePlaying)
      e.removeEventListener('timeupdate', handleTimeUpdate)
      e.removeEventListener('durationchange', handleDurationChange)
      e.removeEventListener('progress', handleProgress)
      e.removeEventListener('ended', handleEnded)
      e.removeEventListener('error', handleError)
      e.removeEventListener('seeked', handleSeeked)
    }
  }, [
    el,
    state.muted,
    state.playbackRate,
    handlePlay,
    handlePause,
    handleWaiting,
    handlePlaying,
    handleTimeUpdate,
    handleDurationChange,
    handleProgress,
    handleEnded,
    handleError,
    handleSeeked,
  ])

  // ---------- hover tracking for auto-hide ----------

  const setHover = useCallback((hovered) => {
    isHoveredRef.current = hovered
    setState((prev) => ({ ...prev, isHovered: hovered }))
    if (hovered) showControls()
    else if (isPlayingRef.current) scheduleHide()
  }, [showControls, scheduleHide])

  return {
    elRef: exposeRef,
    containerRef,
    state,
    setHover,
    play,
    pause,
    togglePlay,
    seek,
    setVolume,
    toggleMute,
    toggleFullscreen,
    toggleTheater,
    setPlaybackRate,
    setQuality,
    retry,
    showControls,
  }
}

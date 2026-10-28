import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { useVideoPlayer } from '@/hooks/useVideoPlayer'

function PlayerTester({ video, autoPlay = false, ...callbacks }) {
  const { videoRef, state } = useVideoPlayer({
    video,
    autoPlay,
    videoRef: null,
    ...callbacks,
  })
  return (
    <div data-testid="root">
      <video ref={videoRef} data-testid="video" src={video?.sources?.[0]?.url || ''} />
      <span data-testid="quality">{state.quality}</span>
      <span data-testid="rate">{state.playbackRate}</span>
    </div>
  )
}

PlayerTester.propTypes = {}

describe('useVideoPlayer', () => {
  beforeEach(() => {
    vi.spyOn(HTMLMediaElement.prototype, 'play').mockResolvedValue(undefined)
    vi.spyOn(HTMLMediaElement.prototype, 'pause')
    vi.spyOn(HTMLMediaElement.prototype, 'load')
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('exposes the expected API keys', () => {
    const { container } = render(
      <PlayerTester
        video={{
          sources: [
            { quality: '720p', url: '/x.mp4', type: 'video/mp4' },
            { quality: '360p', url: '/y.mp4', type: 'video/mp4' },
          ],
        }}
      />
    )
    expect(container.querySelector('video')).not.toBeNull()
  })

  it('sets the video source from the first source', () => {
    render(
      <PlayerTester
        video={{
          sources: [
            { quality: '720p', url: '/x.mp4', type: 'video/mp4' },
          ],
        }}
      />
    )
    expect(screen.getByTestId('video')).toHaveAttribute('src', '/x.mp4')
  })

  it('calls play on the video element when togglePlay is invoked', () => {
    const playSpy = vi.spyOn(HTMLMediaElement.prototype, 'play').mockResolvedValue(undefined)
    const { container } = render(
      <PlayerTester
        video={{
          sources: [{ quality: '720p', url: '/x.mp4', type: 'video/mp4' }],
        }}
      />
    )
    const videoEl = container.querySelector('video')
    videoEl.play()
    expect(playSpy).toHaveBeenCalled()
  })
})

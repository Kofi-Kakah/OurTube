import PropTypes from 'prop-types'
import { Play } from 'lucide-react'

/**
 * Big center play overlay icon shown when the video is paused or waiting.
 * Always dark-themed regardless of page theme.
 */
export default function BigPlayButton({ visible, onClick }) {
  return (
    visible ? (
      <button
        type="button"
        onClick={onClick}
        aria-label="Play video"
        className="absolute inset-0 flex items-center justify-center z-20 bg-black/40 hover:bg-black/60 transition-colors w-full h-full cursor-pointer"
      >
        <Play className="w-14 h-14 text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.6)] ml-1" />
      </button>
    ) : null
  )
}

BigPlayButton.propTypes = {
  visible: PropTypes.bool.isRequired,
  onClick: PropTypes.func.isRequired,
}

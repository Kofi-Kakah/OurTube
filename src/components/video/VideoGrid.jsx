import PropTypes from 'prop-types'
import VideoCard from './VideoCard'
import VideoCardSkeleton from './VideoCardSkeleton'

export default function VideoGrid({
  videos = [],
  loading = false,
  skeletonCount = 12,
  className = '',
}) {
  return (
    <div
      role="feed"
      aria-busy={loading}
      className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-x-4 gap-y-6 md:gap-y-8 ${className}`}
    >
      {loading
        ? Array.from({ length: skeletonCount }).map((_, index) => (
            <VideoCardSkeleton key={`skeleton-${index}`} />
          ))
        : videos.map((video) => <VideoCard key={video.id} video={video} />)}
    </div>
  )
}

VideoGrid.propTypes = {
  videos: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
    })
  ),
  loading: PropTypes.bool,
  skeletonCount: PropTypes.number,
  className: PropTypes.string,
}

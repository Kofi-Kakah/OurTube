import { Skeleton } from '@/components/common'

export default function VideoCardSkeleton() {
  return (
    <div
      aria-hidden="true"
      className="flex flex-col gap-3 w-full animate-pulse select-none"
    >
      {/* 16:9 Thumbnail Skeleton */}
      <div className="relative aspect-video w-full rounded-2xl overflow-hidden bg-[var(--skeleton)]">
        <Skeleton variant="rectangular" className="w-full h-full" />
      </div>

      {/* Details Row Skeleton */}
      <div className="flex gap-3 px-0.5">
        {/* Channel Avatar Skeleton */}
        <div className="shrink-0 mt-0.5">
          <Skeleton variant="circular" width={36} height={36} />
        </div>

        {/* Text Details Skeleton */}
        <div className="flex-1 flex flex-col gap-1.5 min-w-0">
          <Skeleton variant="text" className="w-11/12 h-4 rounded" />
          <Skeleton variant="text" className="w-3/4 h-3.5 rounded" />
          <div className="flex items-center gap-2 mt-0.5">
            <Skeleton variant="text" className="w-24 h-3 rounded" />
            <Skeleton variant="text" className="w-16 h-3 rounded" />
          </div>
        </div>
      </div>
    </div>
  )
}

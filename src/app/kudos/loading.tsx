import { Skeleton } from '@/components/ui/Skeleton'

export default function KudosLoading() {
  return (
    <div className="min-h-screen bg-[var(--color-bg-page)]">
      {/* Hero skeleton */}
      <Skeleton variant="custom" className="h-[512px] w-full rounded-none" />

      {/* Content skeletons */}
      <div className="mt-10 px-[var(--spacing-page-x-mobile)] md:px-[var(--spacing-page-x-tablet)] lg:px-[var(--spacing-page-x)]">
        {/* Section header skeleton */}
        <Skeleton variant="text" className="mb-2 h-4 w-48" />
        <Skeleton variant="text" className="mb-8 h-10 w-72" />

        <div className="flex flex-col gap-6 lg:flex-row">
          {/* Feed skeletons */}
          <div className="flex flex-1 flex-col gap-6">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} variant="card" className="h-64 w-full" />
            ))}
          </div>

          {/* Sidebar skeleton */}
          <div className="w-full shrink-0 lg:w-80">
            <Skeleton variant="card" className="h-80 w-full" />
          </div>
        </div>
      </div>
    </div>
  )
}

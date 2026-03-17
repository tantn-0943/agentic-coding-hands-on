'use client'

import { Suspense, lazy } from 'react'
import { useKudosFilters } from '@/hooks/useKudosFilters'
import { HighlightCarousel } from './HighlightCarousel'
import { KudosFeed } from './KudosFeed'
import { FilterButtons } from './FilterButtons'
import { StatsCard } from './StatsCard'
import { LeaderboardCard } from './LeaderboardCard'

// T091: Lazy load SpotlightBoard for performance (heavy component)
const SpotlightBoard = lazy(() =>
  import('./SpotlightBoard').then((m) => ({ default: m.SpotlightBoard }))
)
import { SectionHeader } from '@/components/ui/SectionHeader'
import { Skeleton } from '@/components/ui/Skeleton'
import type { KudoWithDetails, UserStats, LeaderboardEntry } from '@/types/kudos'

interface KudosPageContentProps {
  initialKudos: KudoWithDetails[]
  initialCursor: string | null
  highlights: KudoWithDetails[]
  stats: UserStats | null
  leaderboard: LeaderboardEntry[]
}

export function KudosPageContent({
  initialKudos,
  initialCursor,
  highlights,
  stats,
  leaderboard,
}: KudosPageContentProps) {
  const { activeHashtag, activeDepartment, filters, setHashtag, setDepartment } = useKudosFilters()

  const handleHashtagClick = (name: string) => {
    setHashtag(activeHashtag === name ? null : name)
  }

  return (
    <>
      {/* Highlight Section */}
      <section className="px-4 md:px-10 lg:px-[var(--spacing-page-x)]">
        <SectionHeader subtitle="Sun* Annual Awards 2025" title="HIGHLIGHT KUDOS">
          <Suspense fallback={<Skeleton variant="text" className="h-10 w-60" />}>
            <FilterButtons
              activeHashtag={activeHashtag}
              activeDepartment={activeDepartment}
              onHashtagChange={setHashtag}
              onDepartmentChange={setDepartment}
            />
          </Suspense>
        </SectionHeader>
        <div className="mt-8">
          <HighlightCarousel highlights={highlights} onHashtagClick={handleHashtagClick} />
        </div>
      </section>

      {/* Spotlight Section — lazy loaded */}
      <section className="mt-10 px-4 md:px-10 lg:px-[var(--spacing-page-x)]">
        <SectionHeader subtitle="Sun* Annual Awards 2025" title="SPOTLIGHT BOARD" />
        <div className="mt-8">
          <Suspense fallback={<Skeleton variant="card" className="h-64 w-full" />}>
            <SpotlightBoard />
          </Suspense>
        </div>
      </section>

      {/* All Kudos Section */}
      <section className="mt-10 px-4 md:px-10 lg:px-[var(--spacing-page-x)]">
        <SectionHeader subtitle="Sun* Annual Awards 2025" title="ALL KUDOS" />

        <div className="mt-8 flex flex-col gap-6 lg:flex-row">
          <div className="flex-1">
            <KudosFeed
              initialData={initialKudos}
              initialCursor={initialCursor}
              filters={filters}
              onHashtagClick={handleHashtagClick}
            />
          </div>

          <aside className="flex w-full shrink-0 flex-col gap-6 lg:sticky lg:top-24 lg:w-80 lg:self-start">
            <StatsCard stats={stats} />
            <LeaderboardCard entries={leaderboard} />
          </aside>
        </div>
      </section>
    </>
  )
}

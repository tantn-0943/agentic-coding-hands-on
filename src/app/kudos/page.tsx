import { Suspense } from 'react'
import { getKudosFeed, getKudosHighlights, getUserStats, getLeaderboard } from '@/lib/kudos/queries'
import { createClient } from '@/libs/supabase/server'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { HeroBanner } from '@/components/kudos/HeroBanner'
import { KudosPageContent } from '@/components/kudos/KudosPageContent'
import { Skeleton } from '@/components/ui/Skeleton'
import { WriteKudoWrapper } from '@/components/kudos/write/WriteKudoWrapper'

export const metadata = {
  title: 'Sun* Kudos - Live Board | SAA 2025',
  description: 'Browse and send kudos to your colleagues at Sun*',
}

export default async function KudosPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const [feedResult, highlights, stats, leaderboard] = await Promise.all([
    getKudosFeed(undefined, 10),
    getKudosHighlights(),
    user ? getUserStats(user.id) : Promise.resolve(null),
    getLeaderboard(),
  ])

  return (
    <WriteKudoWrapper>
      <div className="min-h-screen bg-[var(--color-bg-page)]">
        <Header />
        <HeroBanner />

        <Suspense fallback={<Skeleton variant="card" className="mx-4 mt-10 h-96 lg:mx-36" />}>
          <KudosPageContent
            initialKudos={feedResult.data}
            initialCursor={feedResult.nextCursor}
            highlights={highlights}
            stats={stats}
            leaderboard={leaderboard}
          />
        </Suspense>

        <Footer />
      </div>
    </WriteKudoWrapper>
  )
}

import { Avatar } from '@/components/ui/Avatar'
import { EmptyState } from '@/components/ui/EmptyState'
import { RankIndicator } from './RankIndicator'
import type { LeaderboardEntry } from '@/types/kudos'

interface LeaderboardCardProps {
  entries: LeaderboardEntry[]
}

export function LeaderboardCard({ entries }: LeaderboardCardProps) {
  return (
    <div className="flex flex-col gap-4 rounded-lg border border-[var(--color-border-gold)] bg-[var(--color-card-bg)] p-6">
      <h3
        className="text-sm font-bold uppercase text-[var(--color-primary-gold)]"
        style={{ fontFamily: 'var(--font-gotham)' }}
      >
        10 SUNNER NHAN QUA MOI NHAT
      </h3>

      {entries.length === 0 ? (
        <EmptyState message="Chua co du lieu" />
      ) : (
        <div className="flex flex-col">
          {entries.map((entry) => (
            <div key={entry.rank} className="flex items-center gap-2.5 py-2">
              <RankIndicator rank={entry.rank} />
              <Avatar src={entry.user.avatar_url} alt={entry.user.name} size={40} />
              <div className="flex min-w-0 flex-col gap-0.5">
                <span
                  className="cursor-pointer truncate text-sm font-medium text-[var(--color-primary-gold)]"
                  style={{ fontFamily: 'var(--font-gotham)' }}
                >
                  {entry.user.name}
                </span>
                <span
                  className="truncate text-sm text-[var(--color-text-muted)]"
                  style={{ fontFamily: 'var(--font-gotham)' }}
                >
                  {entry.gift_description}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

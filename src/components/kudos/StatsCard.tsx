import { SecretBoxButton } from './SecretBoxButton'
import type { UserStats } from '@/types/kudos'

interface StatsCardProps {
  stats: UserStats | null
}

function StatRow({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex items-center justify-between">
      <span
        className="text-base text-white"
        style={{ fontFamily: 'var(--font-gotham)' }}
      >
        {label}
      </span>
      <span
        className="text-[22px] font-bold text-[var(--color-primary-gold)]"
        style={{ fontFamily: 'var(--font-gotham)' }}
      >
        {value}
      </span>
    </div>
  )
}

export function StatsCard({ stats }: StatsCardProps) {
  const data = stats ?? {
    kudos_received_count: 0,
    kudos_sent_count: 0,
    hearts_received_count: 0,
    secret_boxes_opened: 0,
    secret_boxes_unopened: 0,
  }

  return (
    <div className="flex flex-col gap-[13px] rounded-lg border border-[var(--color-border-gold)] bg-[var(--color-card-bg)] p-6">
      <StatRow label="So Kudos ban nhan duoc:" value={data.kudos_received_count} />
      <StatRow label="So Kudos ban da gui:" value={data.kudos_sent_count} />
      <StatRow label="So tim ban nhan duoc:" value={data.hearts_received_count} />

      <div className="border-t border-[var(--color-divider)]" />

      <StatRow label="So Secret Box ban da mo:" value={data.secret_boxes_opened} />
      <StatRow label="So Secret Box chua mo:" value={data.secret_boxes_unopened} />

      <SecretBoxButton unopenedCount={data.secret_boxes_unopened} />
    </div>
  )
}

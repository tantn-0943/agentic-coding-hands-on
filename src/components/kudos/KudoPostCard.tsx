import { UserRow } from './UserRow'
import { CategoryTagBadge } from './CategoryTagBadge'
import { ImageGallery } from './ImageGallery'
import { HashtagBadge } from './HashtagBadge'
import { HeartButton } from './HeartButton'
import { CopyLinkButton } from './CopyLinkButton'
import { formatTimestamp } from '@/lib/utils/format-timestamp'
import type { KudoWithDetails } from '@/types/kudos'

interface KudoPostCardProps {
  kudo: KudoWithDetails
  onHashtagClick?: (name: string) => void
}

export function KudoPostCard({ kudo, onHashtagClick }: KudoPostCardProps) {
  return (
    <article className="flex flex-col gap-4 rounded-lg border border-[var(--color-border-gold)] bg-[var(--color-card-bg)] p-6 pr-4">
      <UserRow sender={kudo.sender} receiver={kudo.receiver} />

      <div className="flex flex-col gap-3">
        <span
          className="text-sm text-[var(--color-text-muted)]"
          style={{ fontFamily: 'var(--font-gotham)' }}
        >
          {formatTimestamp(kudo.created_at)}
        </span>

        {kudo.category_tag && <CategoryTagBadge tag={kudo.category_tag} />}

        <p
          className="line-clamp-5 text-base text-white"
          style={{ fontFamily: 'var(--font-gotham)' }}
        >
          {kudo.content}
        </p>

        <ImageGallery media={kudo.media} />

        {kudo.hashtags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {kudo.hashtags.slice(0, 5).map((h) => (
              <HashtagBadge key={h.id} name={h.name} onClick={onHashtagClick} />
            ))}
          </div>
        )}
      </div>

      <div className="flex items-center justify-between border-t border-[var(--color-divider)] pt-3">
        <HeartButton
          kudosId={kudo.id}
          initialHearted={kudo.has_hearted}
          initialCount={kudo.heart_count}
          isOwnKudos={kudo.is_own_kudos}
        />
        <CopyLinkButton kudosId={kudo.id} />
      </div>
    </article>
  )
}

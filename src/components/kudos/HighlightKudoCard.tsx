import Image from 'next/image'
import { UserRow } from './UserRow'
import { CategoryTagBadge } from './CategoryTagBadge'
import { HashtagBadge } from './HashtagBadge'
import { HeartButton } from './HeartButton'
import { CopyLinkButton } from './CopyLinkButton'
import { ViewDetailLink } from './ViewDetailLink'
import { VideoOverlay } from './VideoOverlay'
import { formatTimestamp } from '@/lib/utils/format-timestamp'
import type { KudoWithDetails } from '@/types/kudos'

interface HighlightKudoCardProps {
  kudo: KudoWithDetails
  isActive: boolean
  onHashtagClick?: (name: string) => void
}

export function HighlightKudoCard({ kudo, isActive, onHashtagClick }: HighlightKudoCardProps) {
  const heroMedia = kudo.media[0]

  return (
    <article
      className="flex w-[340px] shrink-0 flex-col overflow-hidden rounded-lg border border-[var(--color-border-gold)] bg-[var(--color-card-bg)] transition-all duration-300 ease-out md:w-[400px]"
      style={{
        opacity: isActive ? 1 : 0.5,
        transform: isActive ? 'scale(1)' : 'scale(0.9)',
      }}
    >
      {/* Image/Video Area */}
      {heroMedia && (
        <div className="relative aspect-video w-full overflow-hidden">
          <Image
            src={heroMedia.url}
            alt=""
            fill
            className="object-cover"
            sizes="400px"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
          {heroMedia.media_type === 'video' && <VideoOverlay />}
        </div>
      )}

      {/* Card Content */}
      <div className="flex flex-col gap-3 p-6">
        <UserRow sender={kudo.sender} receiver={kudo.receiver} />

        <span
          className="text-sm text-[var(--color-text-muted)]"
          style={{ fontFamily: 'var(--font-gotham)' }}
        >
          {formatTimestamp(kudo.created_at)}
        </span>

        {kudo.category_tag && <CategoryTagBadge tag={kudo.category_tag} />}

        <p
          className="line-clamp-3 text-base text-white"
          style={{ fontFamily: 'var(--font-gotham)' }}
        >
          {kudo.content}
        </p>

        {kudo.hashtags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {kudo.hashtags.slice(0, 5).map((h) => (
              <HashtagBadge key={h.id} name={h.name} onClick={onHashtagClick} />
            ))}
          </div>
        )}

        {/* Action Bar */}
        <div className="flex items-center justify-between pt-2">
          <HeartButton
            kudosId={kudo.id}
            initialHearted={kudo.has_hearted}
            initialCount={kudo.heart_count}
            isOwnKudos={kudo.is_own_kudos}
          />
          <div className="flex items-center gap-4">
            <CopyLinkButton kudosId={kudo.id} />
            <ViewDetailLink href={`/kudos/${kudo.id}`} />
          </div>
        </div>
      </div>
    </article>
  )
}

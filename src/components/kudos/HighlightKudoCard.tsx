import { Avatar } from '@/components/ui/Avatar'
import { Icon } from '@/components/ui/Icon'
import { UserInfo } from './UserInfo'
import { CategoryTagBadge } from './CategoryTagBadge'
import { HashtagBadge } from './HashtagBadge'
import { HeartButton } from './HeartButton'
import { CopyLinkButton } from './CopyLinkButton'
import { ViewDetailLink } from './ViewDetailLink'
import { formatTimestamp } from '@/lib/utils/format-timestamp'
import type { KudoWithDetails } from '@/types/kudos'

interface HighlightKudoCardProps {
  kudo: KudoWithDetails
  isActive: boolean
  onHashtagClick?: (name: string) => void
}

function HighlightUserBlock({ user }: { user: KudoWithDetails['sender'] }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3">
      <Avatar src={user.avatar_url} alt={user.name} size={48} />
      <UserInfo
        name={user.name}
        departmentName={user.department_name}
        kudosReceivedCount={user.kudos_received_count}
        align="center"
      />
    </div>
  )
}

export function HighlightKudoCard({ kudo, isActive, onHashtagClick }: HighlightKudoCardProps) {
  return (
    <article
      className="flex w-[380px] shrink-0 flex-col overflow-hidden rounded-2xl border-4 border-[var(--color-primary-gold)] bg-[#FFF8E1] transition-all duration-300 ease-out md:w-[528px]"
      style={{
        opacity: isActive ? 1 : 0.5,
        transform: isActive ? 'scale(1)' : 'scale(0.9)',
      }}
    >
      {/* Sender → Receiver row (vertical blocks, centered) */}
      <div className="flex items-start justify-between gap-6 px-6 pt-6">
        <div className="flex-1">
          <HighlightUserBlock user={kudo.sender} />
        </div>
        <div className="flex h-full items-center pt-6">
          <Icon name="arrow-sent" size={24} className="shrink-0 text-[#999]" />
        </div>
        <div className="flex-1">
          <HighlightUserBlock user={kudo.receiver} />
        </div>
      </div>

      {/* Separator */}
      <div className="mx-6 mt-4 h-px bg-[var(--color-primary-gold)]" />

      {/* Content section */}
      <div className="flex flex-col items-end gap-4 px-6 py-4">
        <div className="flex w-full flex-col gap-3">
          <span
            className="text-base font-bold text-[#999]"
            style={{ fontFamily: 'var(--font-gotham)' }}
          >
            {formatTimestamp(kudo.created_at)}
          </span>

          {kudo.category_tag && <CategoryTagBadge tag={kudo.category_tag} variant="highlight" />}

          <div
            className="prose-kudos line-clamp-3 text-base text-[#00101A]"
            style={{ fontFamily: 'var(--font-gotham)' }}
            dangerouslySetInnerHTML={{ __html: kudo.content }}
          />

          {kudo.hashtags.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {kudo.hashtags.slice(0, 5).map((h) => (
                <HashtagBadge key={h.id} name={h.name} onClick={onHashtagClick} variant="highlight" />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Separator */}
      <div className="mx-6 h-px bg-[var(--color-primary-gold)]" />

      {/* Action Bar */}
      <div className="flex items-center justify-between px-6 py-4">
        <HeartButton
          kudosId={kudo.id}
          initialHearted={kudo.has_hearted}
          initialCount={kudo.heart_count}
          isOwnKudos={kudo.is_own_kudos}
        />
        <div className="flex items-center gap-6">
          <CopyLinkButton kudosId={kudo.id} />
          <ViewDetailLink href={`/kudos/${kudo.id}`} />
        </div>
      </div>
    </article>
  )
}

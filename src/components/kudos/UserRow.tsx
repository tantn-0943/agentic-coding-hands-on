'use client'

import { useCallback, useRef } from 'react'
import { Avatar } from '@/components/ui/Avatar'
import { Icon } from '@/components/ui/Icon'
import { UserInfo } from './UserInfo'
import type { UserProfile } from '@/types/kudos'

interface UserRowProps {
  sender: UserProfile
  receiver: UserProfile
  onUserHover?: (userId: string, rect: DOMRect) => void
  onUserLeave?: () => void
}

function UserAnchor({
  user,
  onHover,
  onLeave,
}: {
  user: UserProfile
  onHover?: (userId: string, rect: DOMRect) => void
  onLeave?: () => void
}) {
  const ref = useRef<HTMLDivElement>(null)

  const handleMouseEnter = useCallback(() => {
    if (onHover && ref.current) {
      onHover(user.id, ref.current.getBoundingClientRect())
    }
  }, [onHover, user.id])

  return (
    <div
      ref={ref}
      className="flex items-center gap-2"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={onLeave}
    >
      <Avatar src={user.avatar_url} alt={user.name} />
      <UserInfo
        name={user.name}
        departmentName={user.department_name}
        kudosReceivedCount={user.kudos_received_count}
      />
    </div>
  )
}

export function UserRow({ sender, receiver, onUserHover, onUserLeave }: UserRowProps) {
  return (
    <div className="flex items-center gap-3">
      <UserAnchor user={sender} onHover={onUserHover} onLeave={onUserLeave} />
      <Icon name="arrow-sent" size={16} className="shrink-0 text-[var(--color-text-muted)]" />
      <UserAnchor user={receiver} onHover={onUserHover} onLeave={onUserLeave} />
    </div>
  )
}

'use client'

import { Icon } from '@/components/ui/Icon'

interface KudosSearchInputProps {
  onOpenDialog?: () => void
}

export function KudosSearchInput({ onOpenDialog }: KudosSearchInputProps) {
  return (
    <button
      type="button"
      onClick={onOpenDialog}
      className="flex w-full cursor-pointer items-center gap-3 rounded-full border-[0.5px] border-[var(--color-primary-gold)] bg-[var(--color-secondary-btn)] px-6 py-2.5 text-left transition-colors hover:bg-[var(--color-secondary-btn-hover)]"
    >
      <Icon name="pen" size={20} className="shrink-0 text-[var(--color-text-muted)]" />
      <span
        className="text-base text-[var(--color-text-muted)]"
        style={{ fontFamily: 'var(--font-gotham)' }}
      >
        Hom nay, ban muon gui loi cam on va ghi nhan den ai?
      </span>
    </button>
  )
}

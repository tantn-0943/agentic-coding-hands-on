'use client'

import { useCallback, useEffect, useState } from 'react'
import { Icon } from '@/components/ui/Icon'
import type { Hashtag } from '@/types/kudos'

interface HashtagSectionProps {
  selectedHashtags: Hashtag[]
  error?: string
  onAdd: (hashtag: Hashtag) => void
  onRemove: (id: string) => void
}

export function HashtagSection({ selectedHashtags, error, onAdd, onRemove }: HashtagSectionProps) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [allHashtags, setAllHashtags] = useState<Hashtag[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const fetchHashtags = useCallback(async () => {
    if (allHashtags.length > 0) {
      setIsDropdownOpen(true)
      return
    }
    setIsLoading(true)
    try {
      const res = await fetch('/api/hashtags')
      const data = await res.json() as { data: Hashtag[] }
      setAllHashtags(data.data ?? [])
      setIsDropdownOpen(true)
    } catch {
      // Silently fail
    } finally {
      setIsLoading(false)
    }
  }, [allHashtags.length])

  // Close dropdown on outside click
  useEffect(() => {
    if (!isDropdownOpen) return
    const handleClick = () => setIsDropdownOpen(false)
    document.addEventListener('click', handleClick)
    return () => document.removeEventListener('click', handleClick)
  }, [isDropdownOpen])

  const availableHashtags = allHashtags.filter(
    h => !selectedHashtags.some(s => s.id === h.id)
  )

  return (
    <div className="flex flex-wrap items-center gap-4">
      {/* Label */}
      <span className="text-[22px] font-bold text-[#00101A] leading-[28px]" style={{ fontFamily: 'var(--font-sans)' }}>
        Hashtag
        <span className="ml-0.5 text-base font-bold text-[var(--color-required-red)]" style={{ fontFamily: "'Noto Sans JP'" }}>*</span>
      </span>

      {/* Add button */}
      {selectedHashtags.length < 5 && (
        <div className="relative">
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); fetchHashtags() }}
            className="h-12 px-2 rounded-lg border border-[var(--color-border-gold)] bg-white text-[11px] font-bold text-[var(--color-text-muted)] flex items-center gap-1 hover:bg-[rgba(255,234,158,0.10)] transition-colors"
            style={{ fontFamily: 'var(--font-sans)', letterSpacing: '0.5px' }}
          >
            <Icon name="plus" size={16} className="text-[var(--color-text-muted)]" />
            Hashtag
            <span className="block text-[11px]">Tối đa 5</span>
          </button>

          {isDropdownOpen && (
            <ul
              className="absolute top-full left-0 z-10 mt-1 max-h-48 overflow-y-auto rounded-lg border border-[var(--color-border-gold)] bg-white shadow-lg min-w-[180px]"
              onClick={(e) => e.stopPropagation()}
            >
              {isLoading ? (
                <li className="px-4 py-3 text-sm text-[var(--color-text-muted)]">Đang tải...</li>
              ) : availableHashtags.length === 0 ? (
                <li className="px-4 py-3 text-sm text-[var(--color-text-muted)]">Không có hashtag</li>
              ) : (
                availableHashtags.map(h => (
                  <li key={h.id}>
                    <button
                      type="button"
                      onClick={() => { onAdd(h); setIsDropdownOpen(false) }}
                      className="w-full px-4 py-2 text-left text-sm font-bold text-[#00101A] hover:bg-[rgba(255,234,158,0.10)] transition-colors"
                    >
                      #{h.name}
                    </button>
                  </li>
                ))
              )}
            </ul>
          )}
        </div>
      )}

      {/* Selected chips */}
      {selectedHashtags.map(h => (
        <div
          key={h.id}
          className="h-12 px-2 rounded-lg border border-[var(--color-border-gold)] bg-white text-[11px] font-bold text-[var(--color-text-muted)] flex items-center gap-1"
          style={{ fontFamily: 'var(--font-sans)', letterSpacing: '0.5px' }}
        >
          #{h.name}
          <button type="button" onClick={() => onRemove(h.id)} className="ml-1 text-[var(--color-text-muted)] hover:text-[#00101A]">
            <Icon name="close-x" size={12} />
          </button>
        </div>
      ))}

      {error && <p className="w-full text-sm text-[var(--color-required-red)]">{error}</p>}
    </div>
  )
}

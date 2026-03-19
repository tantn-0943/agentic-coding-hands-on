'use client'

import { useCallback, useRef, useEffect } from 'react'
import { useProfileSearch } from '@/hooks/useProfileSearch'
import { Avatar } from '@/components/ui/Avatar'
import { Icon } from '@/components/ui/Icon'

interface RecipientFieldProps {
  selectedId: string | null
  selectedName: string | null
  error?: string
  onSelect: (id: string, name: string) => void
  onClear: () => void
}

export function RecipientField({ selectedId, selectedName, error, onSelect, onClear }: RecipientFieldProps) {
  const { query, setQuery, results, isLoading, isOpen, close } = useProfileSearch()
  const wrapperRef = useRef<HTMLDivElement>(null)

  // Close dropdown on outside click
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        close()
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [close])

  const handleSelect = useCallback((id: string, name: string) => {
    onSelect(id, name)
    setQuery('')
    close()
  }, [onSelect, setQuery, close])

  const borderClass = error
    ? 'border-[var(--color-required-red)]'
    : 'border-[var(--color-border-gold)] focus-within:border-[var(--color-primary-gold)] focus-within:border-2'

  return (
    <div className="flex items-center gap-4 max-md:flex-col max-md:items-start">
      {/* Label */}
      <label className="shrink-0 text-[22px] font-bold text-[#00101A] leading-[28px]" style={{ fontFamily: 'var(--font-sans)' }}>
        Người nhận
        <span className="ml-0.5 text-base font-bold text-[var(--color-required-red)]" style={{ fontFamily: "'Noto Sans JP'" }}>*</span>
      </label>

      {/* Input */}
      <div ref={wrapperRef} className="relative flex-1 max-md:w-full">
        {selectedId ? (
          <div className={`flex items-center h-14 px-6 rounded-lg border ${borderClass} bg-white`}>
            <span className="flex-1 text-base font-bold text-[#00101A]" style={{ fontFamily: 'var(--font-sans)' }}>
              {selectedName}
            </span>
            <button type="button" onClick={onClear} className="ml-2 text-[var(--color-text-muted)]">
              <Icon name="close-x" size={16} />
            </button>
          </div>
        ) : (
          <div className={`flex items-center h-14 px-6 rounded-lg border ${borderClass} bg-white`}>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Tìm kiếm"
              className="flex-1 bg-transparent text-base font-bold text-[#00101A] placeholder:text-[var(--color-text-muted)] outline-none"
              style={{ fontFamily: 'var(--font-sans)', letterSpacing: '0.15px' }}
            />
            <Icon name="chevron-down" size={24} className="text-[var(--color-border-gold)]" />
          </div>
        )}

        {/* Dropdown */}
        {isOpen && results.length > 0 && (
          <ul className="absolute top-full left-0 right-0 z-10 mt-1 max-h-60 overflow-y-auto rounded-lg border border-[var(--color-border-gold)] bg-white shadow-lg">
            {results.map((r) => (
              <li key={r.id}>
                <button
                  type="button"
                  onClick={() => handleSelect(r.id, r.name)}
                  className="flex w-full items-center gap-3 px-4 py-3 text-left hover:bg-[var(--color-primary-gold)]/10 transition-colors"
                >
                  <Avatar src={r.avatar_url} alt={r.name} size={32} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-[#00101A] truncate">{r.name}</p>
                    {r.department && (
                      <p className="text-xs text-[var(--color-text-muted)] truncate">{r.department.name}</p>
                    )}
                  </div>
                </button>
              </li>
            ))}
          </ul>
        )}

        {isOpen && isLoading && (
          <div className="absolute top-full left-0 right-0 z-10 mt-1 rounded-lg border border-[var(--color-border-gold)] bg-white p-4 text-center text-sm text-[var(--color-text-muted)]">
            Đang tìm kiếm...
          </div>
        )}

        {isOpen && !isLoading && results.length === 0 && query.trim() && (
          <div className="absolute top-full left-0 right-0 z-10 mt-1 rounded-lg border border-[var(--color-border-gold)] bg-white p-4 text-center text-sm text-[var(--color-text-muted)]">
            Không tìm thấy kết quả
          </div>
        )}

        {error && <p className="mt-1 text-sm text-[var(--color-required-red)]">{error}</p>}
      </div>
    </div>
  )
}

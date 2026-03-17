'use client'

import { useEffect, useRef } from 'react'
import { Icon } from '@/components/ui/Icon'
import { Avatar } from '@/components/ui/Avatar'
import { useProfileSearch } from '@/hooks/useProfileSearch'

export function ProfileSearchBar() {
  const { query, setQuery, results, isLoading, isOpen, close } = useProfileSearch()
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) close()
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [close])

  return (
    <div className="relative w-full lg:w-[300px]" ref={ref}>
      <div className="flex items-center gap-2 rounded-full border-[0.5px] border-[var(--color-primary-gold)] bg-[var(--color-secondary-btn)] px-4 py-2.5 transition-colors hover:bg-[var(--color-secondary-btn-hover)] focus-within:border focus-within:border-[var(--color-primary-gold)]">
        <Icon name="search" size={20} className="shrink-0 text-[var(--color-text-muted)]" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Tim kiem profile Sunner"
          className="w-full bg-transparent text-sm text-white placeholder:text-[var(--color-text-muted)] focus:outline-none"
          style={{ fontFamily: 'var(--font-gotham)' }}
        />
        {isLoading && (
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-[var(--color-text-muted)] border-t-transparent" />
        )}
      </div>

      {/* Dropdown results */}
      {isOpen && (
        <div className="absolute left-0 right-0 z-20 mt-2 max-h-64 overflow-y-auto rounded-lg border border-[var(--color-border-gold)] bg-[var(--color-card-bg)] py-1 shadow-lg">
          {results.length === 0 ? (
            <p className="px-4 py-3 text-center text-sm text-[var(--color-text-muted)]" style={{ fontFamily: 'var(--font-gotham)' }}>
              Khong tim thay Sunner
            </p>
          ) : (
            results.map((user) => (
              <button
                key={user.id}
                type="button"
                onClick={() => { close(); setQuery('') }}
                className="flex w-full items-center gap-3 px-4 py-2 transition-colors hover:bg-[var(--color-secondary-btn)]"
              >
                <Avatar src={user.avatar_url} alt={user.name} size={32} />
                <div className="flex flex-col items-start">
                  <span className="text-sm font-medium text-[var(--color-primary-gold)]" style={{ fontFamily: 'var(--font-gotham)' }}>
                    {user.name}
                  </span>
                  {user.department && (
                    <span className="text-xs text-[var(--color-text-muted)]" style={{ fontFamily: 'var(--font-gotham)' }}>
                      {user.department.name}
                    </span>
                  )}
                </div>
              </button>
            ))
          )}
        </div>
      )}
    </div>
  )
}

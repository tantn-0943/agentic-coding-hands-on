'use client'

import { useEffect, useRef, useState } from 'react'
import { Icon } from '@/components/ui/Icon'
import type { Hashtag, Department } from '@/types/kudos'

interface FilterButtonsProps {
  activeHashtag: string | null
  activeDepartment: string | null
  onHashtagChange: (value: string | null) => void
  onDepartmentChange: (value: string | null) => void
}

function FilterDropdown({
  label,
  activeValue,
  options,
  onChange,
}: {
  label: string
  activeValue: string | null
  options: { id: string; name: string }[]
  onChange: (value: string | null) => void
}) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className={`flex items-center gap-2 rounded-full border px-4 py-2.5 text-sm font-medium transition-colors ${
          activeValue
            ? 'border-[var(--color-primary-gold)] bg-[var(--color-secondary-btn-hover)] text-white'
            : 'border-[var(--color-border-gold)] bg-transparent text-white hover:bg-[var(--color-secondary-btn)]'
        }`}
        style={{ fontFamily: 'var(--font-gotham)' }}
      >
        {activeValue ?? label}
        <Icon name="chevron-down" size={16} />
      </button>

      {open && (
        <div className="absolute right-0 z-20 mt-2 max-h-60 w-48 overflow-y-auto rounded-lg border border-[var(--color-border-gold)] bg-[var(--color-card-bg)] py-1 shadow-lg">
          {activeValue && (
            <button
              type="button"
              onClick={() => { onChange(null); setOpen(false) }}
              className="w-full px-4 py-2 text-left text-sm text-[var(--color-primary-gold)] hover:bg-[var(--color-secondary-btn)]"
              style={{ fontFamily: 'var(--font-gotham)' }}
            >
              Clear filter
            </button>
          )}
          {options.map((opt) => (
            <button
              key={opt.id}
              type="button"
              onClick={() => { onChange(opt.name); setOpen(false) }}
              className={`w-full px-4 py-2 text-left text-sm transition-colors hover:bg-[var(--color-secondary-btn)] ${
                activeValue === opt.name
                  ? 'text-[var(--color-primary-gold)]'
                  : 'text-white'
              }`}
              style={{ fontFamily: 'var(--font-gotham)' }}
            >
              {opt.name}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

export function FilterButtons({ activeHashtag, activeDepartment, onHashtagChange, onDepartmentChange }: FilterButtonsProps) {
  const [hashtags, setHashtags] = useState<Hashtag[]>([])
  const [departments, setDepartments] = useState<Department[]>([])

  useEffect(() => {
    fetch('/api/hashtags')
      .then((r) => r.json() as Promise<{ data: Hashtag[] }>)
      .then((d) => setHashtags(d.data ?? []))
      .catch(() => {})
    fetch('/api/departments')
      .then((r) => r.json() as Promise<{ data: Department[] }>)
      .then((d) => setDepartments(d.data ?? []))
      .catch(() => {})
  }, [])

  return (
    <div className="flex items-center gap-2">
      <FilterDropdown
        label="Hashtag"
        activeValue={activeHashtag}
        options={hashtags}
        onChange={onHashtagChange}
      />
      <FilterDropdown
        label="Phong ban"
        activeValue={activeDepartment}
        options={departments}
        onChange={onDepartmentChange}
      />
    </div>
  )
}

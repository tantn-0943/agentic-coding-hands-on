'use client'

import { useEffect, useState } from 'react'
import { Icon } from '@/components/ui/Icon'
import type { SpotlightNode } from '@/types/kudos'

interface SpotlightData {
  data: SpotlightNode[]
  totalKudos: number
}

export function SpotlightBoard() {
  const [data, setData] = useState<SpotlightData | null>(null)
  const [search, setSearch] = useState('')
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetch('/api/spotlight')
      .then((r) => r.json() as Promise<SpotlightData>)
      .then(setData)
      .catch(() => {})
      .finally(() => setIsLoading(false))
  }, [])

  const filteredNodes = data?.data.filter((n) =>
    search ? n.name.toLowerCase().includes(search.toLowerCase()) : true
  ) ?? []

  return (
    <div className="relative overflow-hidden rounded-lg border border-[var(--color-border-gold)] bg-[var(--color-bg-page)]" style={{ aspectRatio: '39/10' }}>
      {/* Header */}
      <div className="absolute left-6 top-4 z-10 flex items-center gap-4">
        <h3
          className="text-[32px] font-bold text-[var(--color-primary-gold)]"
          style={{ fontFamily: 'var(--font-gotham)' }}
        >
          {data?.totalKudos ?? 0} KUDOS
        </h3>
      </div>

      {/* Controls */}
      <div className="absolute right-6 top-4 z-10 flex items-center gap-3">
        <button
          type="button"
          className="flex h-8 w-8 items-center justify-center rounded-full border border-[var(--color-border-gold)] bg-[var(--color-secondary-btn)] text-white transition-colors hover:bg-[var(--color-secondary-btn-hover)]"
          aria-label="Pan and zoom"
        >
          <Icon name="pan-zoom" size={16} />
        </button>
        <div className="flex items-center gap-2 rounded-full border border-[var(--color-border-gold)] bg-transparent px-3 py-1.5">
          <Icon name="search" size={16} className="text-[var(--color-text-muted)]" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Tim kiem"
            className="w-24 bg-transparent text-sm text-white placeholder:text-[var(--color-text-muted)] focus:outline-none"
            style={{ fontFamily: 'var(--font-gotham)' }}
          />
        </div>
      </div>

      {/* Word Cloud (CSS-only, upgradeable to d3.js) */}
      <div className="absolute inset-0 flex items-center justify-center overflow-hidden pt-12">
        {isLoading ? (
          <p className="text-sm text-[var(--color-text-muted)]">Loading...</p>
        ) : filteredNodes.length === 0 ? (
          <p className="text-sm text-[var(--color-text-muted)]">No data</p>
        ) : (
          <div className="relative h-full w-full">
            {filteredNodes.map((node) => (
              <span
                key={node.id}
                className="absolute cursor-pointer text-white transition-all duration-200 hover:scale-110 hover:text-[var(--color-primary-gold)]"
                style={{
                  left: `${(node.x / 800) * 90 + 5}%`,
                  top: `${(node.y / 400) * 80 + 10}%`,
                  fontSize: `${node.size}px`,
                  fontFamily: 'var(--font-gotham)',
                  fontWeight: node.kudos_count > 5 ? 700 : 400,
                  opacity: search && !node.name.toLowerCase().includes(search.toLowerCase()) ? 0.2 : 1,
                  textShadow: 'var(--text-shadow-dark)',
                }}
                title={`${node.name} — ${node.kudos_count} kudos`}
              >
                {node.name}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

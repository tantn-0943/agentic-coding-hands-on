'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { useKudosFeed } from '@/hooks/useKudosFeed'
import { KudoPostCard } from './KudoPostCard'
import { EmptyState } from '@/components/ui/EmptyState'
import { Skeleton } from '@/components/ui/Skeleton'
import type { KudoWithDetails, FilterParams } from '@/types/kudos'

// T092: Virtualize feed when 50+ items — only render items near viewport
const VIRTUALIZATION_THRESHOLD = 50
const OVERSCAN = 5 // render extra items above/below viewport
const ESTIMATED_CARD_HEIGHT = 320 // px, approximate card height for placeholder

interface KudosFeedProps {
  initialData: KudoWithDetails[]
  initialCursor: string | null
  filters?: FilterParams
  onHashtagClick?: (name: string) => void
}

function useVirtualization(itemCount: number, enabled: boolean) {
  const [visibleRange, setVisibleRange] = useState({ start: 0, end: Math.min(20, itemCount) })
  const sentinelRefs = useRef<Map<number, HTMLDivElement>>(new Map())

  useEffect(() => {
    if (!enabled) {
      setVisibleRange({ start: 0, end: itemCount })
      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        let minVisible = itemCount
        let maxVisible = 0

        entries.forEach((entry) => {
          const index = Number(entry.target.getAttribute('data-index'))
          if (entry.isIntersecting) {
            minVisible = Math.min(minVisible, index)
            maxVisible = Math.max(maxVisible, index)
          }
        })

        if (minVisible <= maxVisible) {
          setVisibleRange({
            start: Math.max(0, minVisible - OVERSCAN),
            end: Math.min(itemCount, maxVisible + OVERSCAN + 1),
          })
        }
      },
      { rootMargin: '500px 0px' }
    )

    sentinelRefs.current.forEach((el) => observer.observe(el))

    return () => observer.disconnect()
  }, [itemCount, enabled])

  const setSentinelRef = useCallback((index: number, el: HTMLDivElement | null) => {
    if (el) {
      el.setAttribute('data-index', String(index))
      sentinelRefs.current.set(index, el)
    } else {
      sentinelRefs.current.delete(index)
    }
  }, [])

  return { visibleRange, setSentinelRef }
}

export function KudosFeed({ initialData, initialCursor, filters, onHashtagClick }: KudosFeedProps) {
  const { items, isLoading, error, hasMore, loadMoreRef, retry } = useKudosFeed({
    initialData,
    initialCursor,
    filters,
  })

  const shouldVirtualize = items.length >= VIRTUALIZATION_THRESHOLD
  const { visibleRange, setSentinelRef } = useVirtualization(items.length, shouldVirtualize)

  if (items.length === 0 && !isLoading) {
    return <EmptyState message="Hien tai chua co Kudos nao." />
  }

  return (
    <div className="flex flex-col gap-6" role="feed" aria-busy={isLoading}>
      {items.map((kudo, index) => {
        const isInRange = index >= visibleRange.start && index < visibleRange.end

        return (
          <div key={kudo.id} ref={(el) => setSentinelRef(index, el)}>
            {isInRange ? (
              <KudoPostCard kudo={kudo} onHashtagClick={onHashtagClick} />
            ) : (
              // Placeholder to maintain scroll position
              <div style={{ height: ESTIMATED_CARD_HEIGHT }} className="rounded-lg bg-[var(--color-card-bg)]" />
            )}
          </div>
        )
      })}

      {/* Infinite scroll trigger */}
      <div ref={loadMoreRef} className="h-1" />

      {isLoading && (
        <div className="flex flex-col gap-6">
          {[1, 2].map((i) => (
            <Skeleton key={i} variant="card" className="h-64 w-full" />
          ))}
        </div>
      )}

      {error && (
        <div className="py-4 text-center">
          <p className="mb-2 text-sm text-[var(--color-error)]">{error}</p>
          <button
            type="button"
            onClick={retry}
            className="text-sm font-medium text-[var(--color-primary-gold)] hover:underline"
          >
            Tap to retry
          </button>
        </div>
      )}

      {!hasMore && items.length > 0 && (
        <p className="py-4 text-center text-sm text-[var(--color-text-muted)]">
          You&apos;ve seen all kudos
        </p>
      )}
    </div>
  )
}

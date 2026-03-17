'use client'

import { useCallback, useEffect } from 'react'
import { useCarousel } from '@/hooks/useCarousel'
import { HighlightKudoCard } from './HighlightKudoCard'
import { Icon } from '@/components/ui/Icon'
import { EmptyState } from '@/components/ui/EmptyState'
import type { KudoWithDetails } from '@/types/kudos'

interface HighlightCarouselProps {
  highlights: KudoWithDetails[]
  onHashtagClick?: (name: string) => void
}

export function HighlightCarousel({ highlights, onHashtagClick }: HighlightCarouselProps) {
  const { currentPage, totalPages, canGoBack, canGoForward, goNext, goPrev } = useCarousel({
    totalItems: highlights.length,
  })

  // T089: Keyboard navigation — ← → arrows
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') goPrev()
      if (e.key === 'ArrowRight') goNext()
    },
    [goPrev, goNext]
  )

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [handleKeyDown])

  if (highlights.length === 0) {
    return <EmptyState message="Hien tai chua co Kudos nao." />
  }

  return (
    <div className="flex flex-col items-center gap-6">
      {/* Carousel container */}
      <div className="relative flex w-full items-center">
        {/* Left arrow */}
        <button
          type="button"
          onClick={goPrev}
          disabled={!canGoBack}
          aria-label="Previous card"
          className={`absolute left-0 z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[var(--color-border-gold)] bg-[var(--color-secondary-btn)] transition-colors ${
            canGoBack
              ? 'cursor-pointer hover:bg-[var(--color-secondary-btn-hover)]'
              : 'cursor-not-allowed opacity-30'
          }`}
        >
          <Icon name="arrow-left" size={20} className="text-white" />
        </button>

        {/* Cards track */}
        <div className="relative mx-14 w-full overflow-hidden">
          {/* Fade gradients */}
          <div className="pointer-events-none absolute left-0 top-0 z-10 h-full w-16" style={{ background: 'var(--gradient-carousel-fade-right)' }} />
          <div className="pointer-events-none absolute right-0 top-0 z-10 h-full w-16" style={{ background: 'var(--gradient-carousel-fade-left)' }} />

          <div
            className="flex gap-6 transition-transform duration-300 ease-out"
            style={{
              transform: `translateX(calc(-${currentPage * (400 + 24)}px + calc(50% - 200px)))`,
            }}
          >
            {highlights.map((kudo, index) => (
              <HighlightKudoCard
                key={kudo.id}
                kudo={kudo}
                isActive={index === currentPage}
                onHashtagClick={onHashtagClick}
              />
            ))}
          </div>
        </div>

        {/* Right arrow */}
        <button
          type="button"
          onClick={goNext}
          disabled={!canGoForward}
          aria-label="Next card"
          className={`absolute right-0 z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[var(--color-border-gold)] bg-[var(--color-secondary-btn)] transition-colors ${
            canGoForward
              ? 'cursor-pointer hover:bg-[var(--color-secondary-btn-hover)]'
              : 'cursor-not-allowed opacity-30'
          }`}
        >
          <Icon name="arrow-right" size={20} className="text-white" />
        </button>
      </div>

      {/* Pagination indicator */}
      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={goPrev}
          disabled={!canGoBack}
          aria-label="Previous page"
          className={canGoBack ? 'cursor-pointer text-white' : 'cursor-not-allowed text-white/30'}
        >
          <Icon name="arrow-left" size={20} />
        </button>
        <span
          className="text-base text-white"
          style={{ fontFamily: 'var(--font-gotham)' }}
        >
          {currentPage + 1}/{totalPages}
        </span>
        <button
          type="button"
          onClick={goNext}
          disabled={!canGoForward}
          aria-label="Next page"
          className={canGoForward ? 'cursor-pointer text-white' : 'cursor-not-allowed text-white/30'}
        >
          <Icon name="arrow-right" size={20} />
        </button>
      </div>
    </div>
  )
}

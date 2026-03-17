'use client'

import { useCallback, useState } from 'react'

interface UseCarouselProps {
  totalItems: number
}

export function useCarousel({ totalItems }: UseCarouselProps) {
  const [currentPage, setCurrentPage] = useState(0)

  const canGoBack = currentPage > 0
  const canGoForward = currentPage < totalItems - 1

  const goNext = useCallback(() => {
    if (canGoForward) setCurrentPage((p) => p + 1)
  }, [canGoForward])

  const goPrev = useCallback(() => {
    if (canGoBack) setCurrentPage((p) => p - 1)
  }, [canGoBack])

  return {
    currentPage,
    totalPages: totalItems,
    canGoBack,
    canGoForward,
    goNext,
    goPrev,
  }
}

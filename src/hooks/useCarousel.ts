'use client'

import { useCallback, useState } from 'react'

interface UseCarouselProps {
  totalItems: number
}

export function useCarousel({ totalItems }: UseCarouselProps) {
  const [currentPage, setCurrentPage] = useState(0)

  const goNext = useCallback(() => {
    setCurrentPage((p) => (p + 1) % totalItems)
  }, [totalItems])

  const goPrev = useCallback(() => {
    setCurrentPage((p) => (p - 1 + totalItems) % totalItems)
  }, [totalItems])

  return {
    currentPage,
    totalPages: totalItems,
    canGoBack: true,
    canGoForward: true,
    goNext,
    goPrev,
  }
}

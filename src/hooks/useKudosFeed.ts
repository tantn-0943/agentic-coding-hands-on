'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import type { KudoWithDetails, KudosFeedResponse, FilterParams } from '@/types/kudos'

interface UseKudosFeedProps {
  initialData: KudoWithDetails[]
  initialCursor: string | null
  filters?: FilterParams
}

export function useKudosFeed({ initialData, initialCursor, filters }: UseKudosFeedProps) {
  const [items, setItems] = useState<KudoWithDetails[]>(initialData)
  const [cursor, setCursor] = useState<string | null>(initialCursor)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const observerRef = useRef<IntersectionObserver | null>(null)
  const loadMoreRef = useRef<HTMLDivElement | null>(null)

  // Reset when filters change
  useEffect(() => {
    setItems(initialData)
    setCursor(initialCursor)
  }, [initialData, initialCursor])

  const loadMore = useCallback(async () => {
    if (!cursor || isLoading) return

    setIsLoading(true)
    setError(null)

    try {
      const params = new URLSearchParams()
      params.set('cursor', cursor)
      params.set('limit', '10')
      if (filters?.hashtag) params.set('hashtag', filters.hashtag)
      if (filters?.department) params.set('department', filters.department)

      const res = await fetch(`/api/kudos?${params.toString()}`)
      if (!res.ok) throw new Error('Failed to load more kudos')

      const data: KudosFeedResponse = await res.json()
      setItems((prev) => [...prev, ...data.data])
      setCursor(data.nextCursor)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
    } finally {
      setIsLoading(false)
    }
  }, [cursor, isLoading, filters])

  // IntersectionObserver for infinite scroll
  useEffect(() => {
    if (observerRef.current) observerRef.current.disconnect()

    observerRef.current = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting && cursor && !isLoading) {
          loadMore()
        }
      },
      { rootMargin: '200px' }
    )

    if (loadMoreRef.current) {
      observerRef.current.observe(loadMoreRef.current)
    }

    return () => observerRef.current?.disconnect()
  }, [cursor, isLoading, loadMore])

  return {
    items,
    isLoading,
    error,
    hasMore: cursor !== null,
    loadMoreRef,
    retry: loadMore,
  }
}

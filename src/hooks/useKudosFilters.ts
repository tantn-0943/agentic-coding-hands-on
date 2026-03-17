'use client'

import { useCallback } from 'react'
import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import type { FilterParams } from '@/types/kudos'

export function useKudosFilters() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const activeHashtag = searchParams.get('hashtag') ?? null
  const activeDepartment = searchParams.get('department') ?? null

  const filters: FilterParams = {
    hashtag: activeHashtag ?? undefined,
    department: activeDepartment ?? undefined,
  }

  const setFilter = useCallback(
    (key: 'hashtag' | 'department', value: string | null) => {
      const params = new URLSearchParams(searchParams.toString())
      if (value) {
        params.set(key, value)
      } else {
        params.delete(key)
      }
      router.push(`${pathname}?${params.toString()}`, { scroll: false })
    },
    [router, pathname, searchParams]
  )

  const clearFilters = useCallback(() => {
    router.push(pathname, { scroll: false })
  }, [router, pathname])

  const setHashtag = useCallback(
    (value: string | null) => setFilter('hashtag', value),
    [setFilter]
  )

  const setDepartment = useCallback(
    (value: string | null) => setFilter('department', value),
    [setFilter]
  )

  return {
    activeHashtag,
    activeDepartment,
    filters,
    setHashtag,
    setDepartment,
    clearFilters,
    hasActiveFilters: !!(activeHashtag || activeDepartment),
  }
}

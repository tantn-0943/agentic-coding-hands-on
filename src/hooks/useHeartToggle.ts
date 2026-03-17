'use client'

import { useCallback, useState, useTransition } from 'react'
import { toggleHeart } from '@/lib/kudos/actions'

interface UseHeartToggleProps {
  kudosId: string
  initialHearted: boolean
  initialCount: number
  isOwnKudos: boolean
}

export function useHeartToggle({ kudosId, initialHearted, initialCount, isOwnKudos }: UseHeartToggleProps) {
  const [hearted, setHearted] = useState(initialHearted)
  const [count, setCount] = useState(initialCount)
  const [isPending, startTransition] = useTransition()

  const toggle = useCallback(() => {
    if (isOwnKudos || isPending) return

    // Optimistic update
    const nextHearted = !hearted
    const nextCount = count + (nextHearted ? 1 : -1)
    setHearted(nextHearted)
    setCount(nextCount)

    startTransition(async () => {
      try {
        const result = await toggleHeart(kudosId)
        // Reconcile with server state
        setHearted(result.hearted)
        setCount(result.heartCount)
      } catch {
        // Revert on error
        setHearted(hearted)
        setCount(count)
      }
    })
  }, [kudosId, isOwnKudos, isPending, hearted, count, startTransition])

  return {
    hearted,
    count,
    toggle,
    isPending,
    disabled: isOwnKudos,
  }
}

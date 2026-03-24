import { describe, expect, it } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useCarousel } from '@/hooks/useCarousel'

describe('useCarousel', () => {
  it('starts at page 0', () => {
    const { result } = renderHook(() => useCarousel({ totalItems: 5 }))
    expect(result.current.currentPage).toBe(0)
    expect(result.current.totalPages).toBe(5)
  })

  it('navigates forward', () => {
    const { result } = renderHook(() => useCarousel({ totalItems: 5 }))
    act(() => result.current.goNext())
    expect(result.current.currentPage).toBe(1)
  })

  it('navigates backward', () => {
    const { result } = renderHook(() => useCarousel({ totalItems: 5 }))
    act(() => result.current.goNext())
    act(() => result.current.goNext())
    act(() => result.current.goPrev())
    expect(result.current.currentPage).toBe(1)
  })

  it('wraps from first to last on prev (infinite)', () => {
    const { result } = renderHook(() => useCarousel({ totalItems: 5 }))
    expect(result.current.canGoBack).toBe(true)
    act(() => result.current.goPrev())
    expect(result.current.currentPage).toBe(4) // wraps to last
  })

  it('wraps from last to first on next (infinite)', () => {
    const { result } = renderHook(() => useCarousel({ totalItems: 3 }))
    act(() => result.current.goNext())
    act(() => result.current.goNext())
    expect(result.current.canGoForward).toBe(true)
    act(() => result.current.goNext())
    expect(result.current.currentPage).toBe(0) // wraps to first
  })

  it('handles single item', () => {
    const { result } = renderHook(() => useCarousel({ totalItems: 1 }))
    expect(result.current.canGoBack).toBe(true)
    expect(result.current.canGoForward).toBe(true)
    act(() => result.current.goNext())
    expect(result.current.currentPage).toBe(0) // stays at 0 (wraps)
  })

  it('handles zero items', () => {
    const { result } = renderHook(() => useCarousel({ totalItems: 0 }))
    expect(result.current.currentPage).toBe(0)
  })
})

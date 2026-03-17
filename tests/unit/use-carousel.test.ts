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

  it('disables back at page 0', () => {
    const { result } = renderHook(() => useCarousel({ totalItems: 5 }))
    expect(result.current.canGoBack).toBe(false)
    act(() => result.current.goPrev()) // should do nothing
    expect(result.current.currentPage).toBe(0)
  })

  it('disables forward at last page', () => {
    const { result } = renderHook(() => useCarousel({ totalItems: 3 }))
    act(() => result.current.goNext())
    act(() => result.current.goNext())
    expect(result.current.canGoForward).toBe(false)
    act(() => result.current.goNext()) // should do nothing
    expect(result.current.currentPage).toBe(2)
  })

  it('handles single item', () => {
    const { result } = renderHook(() => useCarousel({ totalItems: 1 }))
    expect(result.current.canGoBack).toBe(false)
    expect(result.current.canGoForward).toBe(false)
  })

  it('handles zero items', () => {
    const { result } = renderHook(() => useCarousel({ totalItems: 0 }))
    expect(result.current.currentPage).toBe(0)
    expect(result.current.canGoBack).toBe(false)
    expect(result.current.canGoForward).toBe(false)
  })
})

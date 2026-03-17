import { describe, expect, it, vi } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useHeartToggle } from '@/hooks/useHeartToggle'

// Mock the server action
vi.mock('@/lib/kudos/actions', () => ({
  toggleHeart: vi.fn().mockResolvedValue({ success: true, hearted: true, heartCount: 11 }),
}))

describe('useHeartToggle', () => {
  it('initializes with provided values', () => {
    const { result } = renderHook(() =>
      useHeartToggle({ kudosId: '1', initialHearted: false, initialCount: 10, isOwnKudos: false })
    )
    expect(result.current.hearted).toBe(false)
    expect(result.current.count).toBe(10)
    expect(result.current.disabled).toBe(false)
  })

  it('is disabled for own kudos', () => {
    const { result } = renderHook(() =>
      useHeartToggle({ kudosId: '1', initialHearted: false, initialCount: 10, isOwnKudos: true })
    )
    expect(result.current.disabled).toBe(true)
  })

  it('does not toggle when disabled (own kudos)', () => {
    const { result } = renderHook(() =>
      useHeartToggle({ kudosId: '1', initialHearted: false, initialCount: 10, isOwnKudos: true })
    )
    act(() => result.current.toggle())
    expect(result.current.hearted).toBe(false)
    expect(result.current.count).toBe(10)
  })

  it('optimistically increments on toggle', () => {
    const { result } = renderHook(() =>
      useHeartToggle({ kudosId: '1', initialHearted: false, initialCount: 10, isOwnKudos: false })
    )
    act(() => result.current.toggle())
    expect(result.current.hearted).toBe(true)
    expect(result.current.count).toBe(11)
  })

  it('optimistically decrements on untoggle', () => {
    const { result } = renderHook(() =>
      useHeartToggle({ kudosId: '1', initialHearted: true, initialCount: 10, isOwnKudos: false })
    )
    act(() => result.current.toggle())
    expect(result.current.hearted).toBe(false)
    expect(result.current.count).toBe(9)
  })
})

import { describe, expect, it, vi, beforeEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useCopyToClipboard } from '@/hooks/useCopyToClipboard'

describe('useCopyToClipboard', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  it('starts with copied = false', () => {
    const { result } = renderHook(() => useCopyToClipboard())
    expect(result.current.copied).toBe(false)
  })

  it('copies text to clipboard and sets copied = true', async () => {
    const writeText = vi.fn().mockResolvedValue(undefined)
    Object.assign(navigator, { clipboard: { writeText } })

    const { result } = renderHook(() => useCopyToClipboard())

    await act(async () => {
      const success = await result.current.copy('hello')
      expect(success).toBe(true)
    })

    expect(result.current.copied).toBe(true)
    expect(writeText).toHaveBeenCalledWith('hello')
  })

  it('resets copied after 3 seconds', async () => {
    const writeText = vi.fn().mockResolvedValue(undefined)
    Object.assign(navigator, { clipboard: { writeText } })

    const { result } = renderHook(() => useCopyToClipboard())

    await act(async () => {
      await result.current.copy('test')
    })

    expect(result.current.copied).toBe(true)

    act(() => {
      vi.advanceTimersByTime(3000)
    })

    expect(result.current.copied).toBe(false)
  })

  it('returns false if clipboard API throws', async () => {
    Object.assign(navigator, { clipboard: { writeText: vi.fn().mockRejectedValue(new Error('denied')) } })

    const { result } = renderHook(() => useCopyToClipboard())

    await act(async () => {
      const success = await result.current.copy('fail')
      expect(success).toBe(false)
    })
  })
})

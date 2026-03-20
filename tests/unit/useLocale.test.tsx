import { describe, expect, it, vi, beforeEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { LocaleProvider, useLocale } from '@/hooks/useLocale'
import type { ReactNode } from 'react'

function wrapper({ children }: { children: ReactNode }) {
  return <LocaleProvider>{children}</LocaleProvider>
}

describe('useLocale', () => {
  beforeEach(() => {
    // Clear cookies
    document.cookie = 'NEXT_LOCALE=; Max-Age=0; Path=/'
  })

  it('initializes with default vi when no cookie', () => {
    const { result } = renderHook(() => useLocale(), { wrapper })
    expect(result.current.locale).toBe('vi')
  })

  it('reads existing cookie value', () => {
    document.cookie = 'NEXT_LOCALE=en; Path=/'
    const { result } = renderHook(() => useLocale(), { wrapper })
    expect(result.current.locale).toBe('en')
  })

  it('setLocale updates context value', () => {
    const { result } = renderHook(() => useLocale(), { wrapper })
    act(() => { result.current.setLocale('en') })
    expect(result.current.locale).toBe('en')
  })

  it('setLocale writes cookie', () => {
    const { result } = renderHook(() => useLocale(), { wrapper })
    act(() => { result.current.setLocale('en') })
    expect(document.cookie).toContain('NEXT_LOCALE=en')
  })

  it('handles invalid cookie value gracefully (falls back to vi)', () => {
    document.cookie = 'NEXT_LOCALE=fr; Path=/'
    const { result } = renderHook(() => useLocale(), { wrapper })
    expect(result.current.locale).toBe('vi')
  })

  it('throws when used outside provider', () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
    expect(() => {
      renderHook(() => useLocale())
    }).toThrow('useLocale must be used within a LocaleProvider')
    consoleSpy.mockRestore()
  })
})

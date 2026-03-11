import { describe, it, expect, vi, beforeEach } from 'vitest'
import { NextResponse } from 'next/server'

// Mock next/server
vi.mock('next/server', async () => {
  const actual = await vi.importActual('next/server')
  return {
    ...actual,
    NextResponse: {
      redirect: vi.fn((url: URL) => ({ type: 'redirect', url: url.toString() })),
    },
  }
})

// Mock Supabase client
const mockExchangeCodeForSession = vi.fn()
vi.mock('@/libs/supabase/server', () => ({
  createClient: vi.fn(() =>
    Promise.resolve({
      auth: {
        exchangeCodeForSession: mockExchangeCodeForSession,
      },
    })
  ),
}))

describe('GET /auth/callback', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockExchangeCodeForSession.mockResolvedValue({ error: null })
  })

  const makeRequest = (params: Record<string, string>) => {
    const url = new URL('http://localhost:3000/auth/callback')
    Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v))
    return new Request(url)
  }

  it('redirects to / on successful code exchange', async () => {
    const { GET } = await import('./route')
    await GET(makeRequest({ code: 'valid-code' }))
    expect(NextResponse.redirect).toHaveBeenCalledWith(
      expect.objectContaining({ pathname: '/' })
    )
  })

  it('redirects to returnTo path on success when returnTo is valid', async () => {
    const { GET } = await import('./route')
    await GET(makeRequest({ code: 'valid-code', returnTo: '/dashboard' }))
    expect(NextResponse.redirect).toHaveBeenCalledWith(
      expect.objectContaining({ pathname: '/dashboard' })
    )
  })

  it('ignores invalid returnTo (external URL) and redirects to /', async () => {
    const { GET } = await import('./route')
    await GET(makeRequest({ code: 'valid-code', returnTo: 'http://evil.com' }))
    expect(NextResponse.redirect).toHaveBeenCalledWith(
      expect.objectContaining({ pathname: '/' })
    )
  })

  it('ignores invalid returnTo (double slash) and redirects to /', async () => {
    const { GET } = await import('./route')
    await GET(makeRequest({ code: 'valid-code', returnTo: '//evil.com' }))
    expect(NextResponse.redirect).toHaveBeenCalledWith(
      expect.objectContaining({ pathname: '/' })
    )
  })

  it('redirects to /login?error=auth_failed when ?error param is present', async () => {
    const { GET } = await import('./route')
    await GET(makeRequest({ error: 'access_denied' }))
    expect(NextResponse.redirect).toHaveBeenCalledWith(
      expect.objectContaining({ pathname: '/login', search: '?error=auth_failed' })
    )
  })

  it('redirects to /login?error=auth_failed when exchangeCodeForSession fails', async () => {
    mockExchangeCodeForSession.mockResolvedValue({ error: new Error('exchange failed') })
    const { GET } = await import('./route')
    await GET(makeRequest({ code: 'bad-code' }))
    expect(NextResponse.redirect).toHaveBeenCalledWith(
      expect.objectContaining({ pathname: '/login', search: '?error=auth_failed' })
    )
  })
})

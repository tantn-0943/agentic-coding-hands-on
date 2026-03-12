import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { NextRequest, NextResponse } from 'next/server'

// Mock Supabase middleware client
const mockGetUser = vi.fn()
const mockNextResponse = {
  type: 'next',
  headers: new Headers(),
  cookies: { set: vi.fn() },
}

vi.mock('@/libs/supabase/middleware', () => ({
  createClient: vi.fn(() =>
    Promise.resolve({
      supabase: {
        auth: { getUser: mockGetUser },
      },
      supabaseResponse: mockNextResponse,
    })
  ),
}))

// Mock next/server
vi.mock('next/server', async () => {
  const actual = await vi.importActual<typeof import('next/server')>('next/server')
  return {
    ...actual,
    NextResponse: {
      redirect: vi.fn((url: URL) => ({
        type: 'redirect',
        url: url.toString(),
        headers: new Headers(),
      })),
      next: vi.fn(() => mockNextResponse),
    },
  }
})

describe('middleware', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.resetModules()
    // reset headers
    mockNextResponse.headers = new Headers()
  })

  const makeRequest = (pathname: string) =>
    new NextRequest(new URL(`http://localhost:3000${pathname}`))

  it('redirects unauthenticated user to /login?returnTo= for protected route', async () => {
    mockGetUser.mockResolvedValue({ data: { user: null }, error: null })
    const { middleware } = await import('./middleware')
    await middleware(makeRequest('/dashboard'))
    expect(NextResponse.redirect).toHaveBeenCalledWith(
      expect.objectContaining({ pathname: '/login' })
    )
  })

  it('redirects authenticated user away from /login to /', async () => {
    mockGetUser.mockResolvedValue({ data: { user: { id: 'user-123' } }, error: null })
    const { middleware } = await import('./middleware')
    await middleware(makeRequest('/login'))
    expect(NextResponse.redirect).toHaveBeenCalledWith(
      expect.objectContaining({ pathname: '/' })
    )
  })

  it('allows unauthenticated user to access /login', async () => {
    mockGetUser.mockResolvedValue({ data: { user: null }, error: null })
    const { middleware } = await import('./middleware')
    await middleware(makeRequest('/login'))
    expect(NextResponse.redirect).not.toHaveBeenCalled()
  })

  it('passes static asset requests through without auth check', async () => {
    mockGetUser.mockResolvedValue({ data: { user: null }, error: null })
    const { middleware } = await import('./middleware')
    await middleware(makeRequest('/_next/static/chunk.js'))
    expect(NextResponse.redirect).not.toHaveBeenCalled()
  })

  it('passes /auth/callback through without auth check', async () => {
    mockGetUser.mockResolvedValue({ data: { user: null }, error: null })
    const { middleware } = await import('./middleware')
    await middleware(makeRequest('/auth/callback'))
    expect(NextResponse.redirect).not.toHaveBeenCalled()
  })

  // Countdown-specific tests (US3)
  describe('/countdown route', () => {
    const originalEnv = process.env

    beforeEach(() => {
      vi.resetModules()
      process.env = { ...originalEnv }
    })

    afterEach(() => {
      process.env = originalEnv
    })

    it('TC-C1: passes through when no env var is set', async () => {
      delete process.env.NEXT_PUBLIC_EVENT_START_DATE
      mockGetUser.mockResolvedValue({ data: { user: null }, error: null })
      const { middleware } = await import('./middleware')
      await middleware(makeRequest('/countdown'))
      expect(NextResponse.redirect).not.toHaveBeenCalledWith(
        expect.objectContaining({ pathname: '/' })
      )
    })

    it('TC-C2: passes through when event date is in the future', async () => {
      process.env.NEXT_PUBLIC_EVENT_START_DATE = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
      mockGetUser.mockResolvedValue({ data: { user: null }, error: null })
      const { middleware } = await import('./middleware')
      await middleware(makeRequest('/countdown'))
      expect(NextResponse.redirect).not.toHaveBeenCalledWith(
        expect.objectContaining({ pathname: '/' })
      )
    })

    it('TC-C3: redirects to "/" when event date is in the past', async () => {
      process.env.NEXT_PUBLIC_EVENT_START_DATE = new Date(Date.now() - 1000).toISOString()
      mockGetUser.mockResolvedValue({ data: { user: null }, error: null })
      const { middleware } = await import('./middleware')
      await middleware(makeRequest('/countdown'))
      expect(NextResponse.redirect).toHaveBeenCalledWith(
        expect.objectContaining({ pathname: '/' })
      )
    })

    it('TC-C4: passes through when event date string is invalid', async () => {
      process.env.NEXT_PUBLIC_EVENT_START_DATE = 'not-a-date'
      mockGetUser.mockResolvedValue({ data: { user: null }, error: null })
      const { middleware } = await import('./middleware')
      await middleware(makeRequest('/countdown'))
      expect(NextResponse.redirect).not.toHaveBeenCalledWith(
        expect.objectContaining({ pathname: '/' })
      )
    })

    it('TC-C5: unauthenticated + future date is NOT redirected to /login', async () => {
      process.env.NEXT_PUBLIC_EVENT_START_DATE = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
      mockGetUser.mockResolvedValue({ data: { user: null }, error: null })
      const { middleware } = await import('./middleware')
      await middleware(makeRequest('/countdown'))
      expect(NextResponse.redirect).not.toHaveBeenCalledWith(
        expect.objectContaining({ pathname: '/login' })
      )
    })

    it('TC-C6: authenticated + past date → redirect to "/"', async () => {
      process.env.NEXT_PUBLIC_EVENT_START_DATE = new Date(Date.now() - 1000).toISOString()
      mockGetUser.mockResolvedValue({ data: { user: { id: 'user-123' } }, error: null })
      const { middleware } = await import('./middleware')
      await middleware(makeRequest('/countdown'))
      expect(NextResponse.redirect).toHaveBeenCalledWith(
        expect.objectContaining({ pathname: '/' })
      )
    })
  })
})

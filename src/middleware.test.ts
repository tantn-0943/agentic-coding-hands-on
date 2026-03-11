import { describe, it, expect, vi, beforeEach } from 'vitest'
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
})

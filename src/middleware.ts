import { NextResponse, type NextRequest } from 'next/server'
import { createClient } from '@/libs/supabase/middleware'

const PUBLIC_ROUTES = ['/login', '/auth/callback', '/auth/error', '/countdown']

function isPublicRoute(pathname: string): boolean {
  return PUBLIC_ROUTES.some((route) => pathname.startsWith(route))
}

function isStaticAsset(pathname: string): boolean {
  return (
    pathname.startsWith('/_next/') ||
    pathname.startsWith('/favicon') ||
    pathname.startsWith('/images/') ||
    pathname.startsWith('/icons/') ||
    /\.(svg|png|jpg|jpeg|gif|ico|css|js|woff|woff2)$/.test(pathname)
  )
}

function addSecurityHeaders(response: NextResponse): NextResponse {
  response.headers.set('X-Frame-Options', 'DENY')
  response.headers.set('X-Content-Type-Options', 'nosniff')
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
  return response
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  if (isStaticAsset(pathname)) {
    return NextResponse.next()
  }

  if (pathname === '/countdown') {
    const eventDateStr = process.env.NEXT_PUBLIC_EVENT_START_DATE
    if (eventDateStr) {
      const eventDate = new Date(eventDateStr)
      if (!isNaN(eventDate.getTime()) && eventDate <= new Date()) {
        return addSecurityHeaders(NextResponse.redirect(new URL('/', request.url)))
      }
    }
  }

  const { supabase, supabaseResponse } = await createClient(request)
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user && !isPublicRoute(pathname)) {
    const loginUrl = new URL('/login', request.url)
    loginUrl.searchParams.set('returnTo', pathname)
    return addSecurityHeaders(NextResponse.redirect(loginUrl))
  }

  if (user && pathname === '/login') {
    return addSecurityHeaders(NextResponse.redirect(new URL('/', request.url)))
  }

  return addSecurityHeaders(supabaseResponse)
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|ico)$).*)',
  ],
}

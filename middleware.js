import { NextResponse } from 'next/server'

export function middleware(request) {
  const hostname = request.headers.get('host') || ''
  const { pathname, search } = request.nextUrl

  // Skip subdomain routing in local development
  if (hostname.includes('localhost') || hostname.includes('127.0.0.1')) {
    return NextResponse.next()
  }

  const isApp = hostname.startsWith('app.')
  const isAdmin = hostname.startsWith('admin.')
  const isMain = !isApp && !isAdmin

  // ── app.japalearnai.com ───────────────────────────────────────────────────────
  if (isApp) {
    const appPaths = ['/signup', '/login', '/dashboard', '/learn', '/api/', '/_next', '/favicon']
    const isAllowed = appPaths.some(p => pathname.startsWith(p))
    if (!isAllowed) {
      // Anything not app-related → send back to main site
      return NextResponse.redirect(new URL(`https://japalearnai.com${pathname}${search}`))
    }
  }

  // ── admin.japalearnai.com ─────────────────────────────────────────────────────
  if (isAdmin) {
    // /dashboard on admin → send to app
    if (pathname.startsWith('/dashboard')) {
      return NextResponse.redirect(new URL(`https://app.japalearnai.com${pathname}${search}`))
    }
    // Root → /admin
    if (pathname === '/') {
      return NextResponse.redirect(new URL('https://admin.japalearnai.com/admin'))
    }
  }

  // ── japalearnai.com (main) ────────────────────────────────────────────────────
  if (isMain) {
    // Dashboard → app subdomain
    if (pathname.startsWith('/dashboard')) {
      return NextResponse.redirect(new URL(`https://app.japalearnai.com${pathname}${search}`))
    }
    // Admin → admin subdomain
    if (pathname.startsWith('/admin')) {
      return NextResponse.redirect(new URL(`https://admin.japalearnai.com${pathname}${search}`))
    }
    // Login/signup → app subdomain (with query params preserved)
    if (pathname.startsWith('/login') || pathname.startsWith('/signup')) {
      return NextResponse.redirect(new URL(`https://app.japalearnai.com${pathname}${search}`))
    }
    // Learn pages → app subdomain
    if (pathname.startsWith('/learn')) {
      return NextResponse.redirect(new URL(`https://app.japalearnai.com${pathname}${search}`))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}

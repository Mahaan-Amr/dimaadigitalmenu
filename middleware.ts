import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const LANGUAGES = ['en', 'fa'];

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Handle root path redirect
  if (pathname === '/') {
    return NextResponse.redirect(new URL('/fa', request.url));
  }

  // Handle language paths
  const pathnameSegments = pathname.split('/').filter(Boolean);
  const firstSegment = pathnameSegments[0];

  // If it's not admin and not a valid language, redirect to /fa
  if (firstSegment !== 'admin' && !LANGUAGES.includes(firstSegment)) {
    return NextResponse.redirect(new URL(`/fa${pathname}`, request.url));
  }

  // Handle admin authentication
  if (pathname.startsWith('/admin')) {
    const isLoginPage = pathname === '/admin/login';
    const authCookie = request.cookies.get('dimaa_auth');
    const isAuthenticated = authCookie?.value === 'true';

    if (!isAuthenticated && !isLoginPage) {
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }

    if (isAuthenticated && isLoginPage) {
      return NextResponse.redirect(new URL('/admin', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}; 
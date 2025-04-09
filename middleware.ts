import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const LANGUAGES = ['en', 'fa'];

// Debug function
function logRequestDetails(req: NextRequest, message: string) {
  console.log(`[Middleware] ${message}`);
  console.log(`[Middleware] URL: ${req.url}`);
  console.log(`[Middleware] Pathname: ${req.nextUrl.pathname}`);
  console.log(`[Middleware] Search: ${req.nextUrl.search}`);
  console.log(`[Middleware] Headers:`, Object.fromEntries(req.headers.entries()));
}

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  logRequestDetails(request, 'Processing request');

  // Skip middleware for static files, API routes, and Next.js internals
  if (
    pathname.startsWith('/uploads/') ||
    pathname.startsWith('/api/') ||
    pathname.startsWith('/_next/') ||
    pathname === '/favicon.ico'
  ) {
    logRequestDetails(request, 'Skipping middleware for excluded path');
    return NextResponse.next();
  }

  // Handle root path redirect
  if (pathname === '/') {
    logRequestDetails(request, 'Redirecting root path to /fa');
    return NextResponse.redirect(new URL('/fa', request.url));
  }

  // Handle language paths
  const pathnameSegments = pathname.split('/').filter(Boolean);
  const firstSegment = pathnameSegments[0];

  // If it's not admin and not a valid language, redirect to /fa
  if (firstSegment !== 'admin' && !LANGUAGES.includes(firstSegment)) {
    logRequestDetails(request, `First segment '${firstSegment}' is not admin or valid language, redirecting to /fa${pathname}`);
    return NextResponse.redirect(new URL(`/fa${pathname}`, request.url));
  }

  // Handle admin authentication
  if (pathname.startsWith('/admin')) {
    const isLoginPage = pathname === '/admin/login';
    const authCookie = request.cookies.get('dimaa_auth');
    const isAuthenticated = authCookie?.value === 'true';

    logRequestDetails(request, `Admin route: isLoginPage=${isLoginPage}, isAuthenticated=${isAuthenticated}`);

    if (!isAuthenticated && !isLoginPage) {
      logRequestDetails(request, 'Redirecting unauthenticated admin request to login');
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }

    if (isAuthenticated && isLoginPage) {
      logRequestDetails(request, 'Redirecting authenticated login request to admin dashboard');
      return NextResponse.redirect(new URL('/admin', request.url));
    }
  }

  logRequestDetails(request, 'Proceeding to next middleware/handler');
  return NextResponse.next();
}

export const config = {
  matcher: [
    // Skip all internal Next.js assets which are statically served
    '/((?!api|_next/static|_next/image|favicon.ico|uploads).*)',
  ],
}; 
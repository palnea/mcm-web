import { NextResponse } from 'next/server';

export function middleware(request) {
  // Get locale information
  const locale = request.nextUrl.locale || 'en';

  // Handle RSC requests
  if (request.nextUrl.searchParams.has('_rsc')) {
    const response = NextResponse.next();

    // Set proper headers for RSC
    response.headers.set('RSC', '1');
    response.headers.set('Accept-Language', locale);
    response.headers.set('Content-Type', 'application/x-react-server-component');

    // Remove any existing cache headers
    response.headers.delete('Cache-Control');
    response.headers.set('Cache-Control', 'no-store, must-revalidate');

    return response;
  }

  // For non-RSC requests
  const response = NextResponse.next();

  // Set security headers
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-XSS-Protection', '1; mode=block');

  return response;
}

export const config = {
  matcher: [
    // Include all paths except static files and api routes
    '/((?!api/|_next/static|_next/image|favicon.ico|images).*)',
  ],
};

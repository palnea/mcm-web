import { NextResponse } from 'next/server';

export function middleware(request) {
  console.log('in middleware>>>');
  console.log('Request URL:', request.url);
  console.log('Request Pathname:', request.nextUrl.pathname);

  // Skip middleware for RSC (React Server Components) requests
  if (request.nextUrl.searchParams.has('_rsc')) {
    console.log('Skipping middleware for _rsc request');
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api/|_next/static|_next/image|favicon.ico|images).*)',
  ],
};

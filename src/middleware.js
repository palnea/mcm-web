import { NextResponse } from 'next/server';

const unprotectedRoutes = ['/login'];

export function middleware(request) {
  const { nextUrl } = request;
  const token = request.cookies.get('authToken');
  const isAuthenticated = token && token.value && token.value.length > 0;

  if (nextUrl.pathname === '/') {
    return isAuthenticated
      ? NextResponse.redirect(new URL('/dashboard', request.url))
      : NextResponse.redirect(new URL('/login', request.url));
  }

  if (nextUrl.pathname === '/login' && isAuthenticated) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  if (!unprotectedRoutes.includes(nextUrl.pathname) && !isAuthenticated) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)']
};

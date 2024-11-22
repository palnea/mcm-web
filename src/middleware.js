import { NextResponse } from 'next/server';

const protectedRoutes = ['/dashboard','/yacht', '/accessories', '/spare-parts', '/users', '/company', '/team-statistics'];

export function middleware(request) {
  const { nextUrl } = request;

  const token = request.cookies.get('authToken'); // Assuming the token is stored in cookies

  // Check if the user is trying to access a protected route
  if (protectedRoutes.some((route) => nextUrl.pathname.startsWith(route))) {
    if ("value" in token && token["value"].length > 0) {
      // If authorized and accessing '/dashboard', rewrite to '/dashboard/user'
      if (nextUrl.pathname.startsWith('/dashboard')) {
        return NextResponse.rewrite(new URL('/dashboard', request.url));
      }
    } else {
      // If not authorized, redirect to login
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }
}

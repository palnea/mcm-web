import { NextResponse } from 'next/server'

const unprotectedRoutes = ['/login']

export function middleware(request) {
  console.log('in middleware>>>')
  const { nextUrl } = request
  const pathname = nextUrl.pathname

  if (pathname.startsWith('/images/') || /\.(png|jpg|jpeg|gif|webp|svg|ico)$/i.test(pathname)) {
    return NextResponse.next()
  }

  const token = request.cookies.get('authToken')
  console.log('token: ', token)
  const isAuthenticated = token && token.value && token.value.length > 0
  console.log('isAuthenticated: ', isAuthenticated)
  console.log('request url: ', request.url)

  if (nextUrl.pathname === '/') {
    return isAuthenticated
      ? NextResponse.redirect(new URL('/dashboard', request.url))
      : NextResponse.redirect(new URL('/login', request.url))
  }

  if (nextUrl.pathname === '/login' && isAuthenticated) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  if (!unprotectedRoutes.includes(nextUrl.pathname) && !isAuthenticated) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/((?!api/|_next/static|_next/image|favicon.ico|images).*)',
  ],
};



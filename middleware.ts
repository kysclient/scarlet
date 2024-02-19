import { NextRequest, NextResponse } from 'next/server'

export { auth as middleware } from './auth'

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)']
}

export function auth(request: NextRequest) {
  return NextResponse.next({
    request: {
      headers: new Headers({ 'x-url': request.url })
    }
  })
}

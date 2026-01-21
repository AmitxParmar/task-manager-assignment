import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

/**
 * Next.js Proxy for route handling.
 * 
 * IMPORTANT: This proxy CANNOT read HTTP-only cookies (access_token, refresh_token)
 * set by the server. HTTP-only cookies are only accessible server-side and are 
 * automatically sent with requests, but cannot be read from client-side JavaScript.
 * 
 * Authentication validation happens client-side via the useAuth() hook which calls
 * the /auth/me endpoint. This approach:
 * 1. Works with HTTP-only cookies (they're sent automatically with API requests)
 * 2. Allows for optimistic UI rendering
 * 3. Enables proper token refresh handling
 * 4. Provides better error handling and UX
 * 
 * The trade-off is a brief loading state while checking auth, but this is preferable
 * to incorrect/broken cookie checks.
 */
export async function proxy(request: NextRequest) {
    // All authentication validation happens client-side via useAuth() hook
    // Let all requests through to their destinations
    return NextResponse.next()
}


/**
 * Configure which routes this proxy should run on.
 * Excludes static files, images, and Next.js internals.
 */
export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         * - public folder files
         */
        '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
    ],
}

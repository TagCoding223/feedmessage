import { getToken } from 'next-auth/jwt'
import { NextRequest, NextResponse } from 'next/server'

export { default } from "next-auth/middleware"

// This function can be marked `async` if using `await` inside
export async function middleware(request: NextRequest) {
    const token = await getToken({ req: request });
    const url = request.nextUrl;

    // Allow unauthenticated users to access sign-in, sign-up, and verify pages
    if (!token &&
        (
            url.pathname.startsWith('/sign-in') ||
            url.pathname.startsWith('/sign-up') ||
            url.pathname.startsWith('/verify')
        )
    ) {
        return NextResponse.next();
    }

    // Redirect authenticated users away from sign-in, sign-up, and verify pages
    if (token &&
        (
            url.pathname.startsWith('/sign-in') ||
            url.pathname.startsWith('/sign-up') ||
            url.pathname.startsWith('/verify')
        )
    ) {
        return NextResponse.redirect(new URL('/dashboard', request.url));
    }

    // Default redirect for unauthenticated users trying to access protected routes
    if (!token) {
        return NextResponse.redirect(new URL('/home', request.url));
        // return NextResponse.next()
    }

    // if (!token && url.pathname.startsWith('dashboard')) {
    //     return NextResponse.redirect(new URL('/sign-in',request.url));
    // }

    return NextResponse.next();
}

// See "Matching Paths" below to learn more
export const config = {
    matcher: ['/', '/sign-in', '/sign-up', '/dashboard/:path*', "/verify/:path*"]
}
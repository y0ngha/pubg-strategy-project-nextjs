import { NextRequest, NextResponse } from 'next/server';
import { authenticationMiddleware } from '@/middlewares/authentication.middleware';

export async function proxy(request: NextRequest) {
    const { pathname } = request.nextUrl;

    const authResponse = await authenticationMiddleware(request, pathname);

    if (authResponse.status !== 200) {
        return authResponse;
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};

import { Route } from '@/(presentation)/shared/constants/route';
import { isAuthenticationComplete } from '@/(presentation)/shared/helpers/authentication.helper';
import { NextRequest, NextResponse } from 'next/server';
import { CookieKeys } from '@/application/constants/cookie-keys';

const NEED_AUTHENTICATION_PATHNAMES = [Route.MYPAGE, Route.STRATEGIES];

export async function authenticationMiddleware(
    request: NextRequest,
    pathname: string
) {
    if (isIncludesNeedAuthenticationPathnames(pathname)) {
        if (!(await isAuthenticationComplete())) {
            const response = NextResponse.redirect(
                new URL(Route.LOGIN, request.url)
            );

            response.cookies.set(CookieKeys.AUTH_ERROR_SIGNAL, 'signal', {
                maxAge: 10,
                path: '/',
                httpOnly: false,
            });

            return response;
        }
    }

    return NextResponse.next();
}

function isIncludesNeedAuthenticationPathnames(pathName: string): boolean {
    return (
        NEED_AUTHENTICATION_PATHNAMES.find(needAuthenticationPathName =>
            pathName.startsWith(needAuthenticationPathName)
        ) !== undefined
    );
}

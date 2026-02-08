import { Route } from '@/(presentation)/shared/constants/route';
import { isAuthenticationComplete } from '@/(presentation)/shared/helpers/authentication.helper';
import { NextRequest, NextResponse } from 'next/server';
import { CookieKeys } from '@/application/constants/cookie-keys';

const NEED_AUTHENTICATION_PATHNAMES = [
    Route.MYPAGE,
    Route.STRATEGIES,
    Route.MYPAGE,
    Route.FRIENDS,
];

export async function authenticationMiddleware(
    request: NextRequest,
    pathname: string
) {
    if (isIncludesNeedAuthenticationPathnames(pathname)) {
        if (!(await isAuthenticationComplete())) {
            const url = getRedirectUrl(request.url);

            return getNextResponse(url);
        }
    }

    return NextResponse.next();
}

function getRedirectUrl(baseUrl: string): URL {
    const redirectUrl = new URL(`${Route.LOGIN}`, baseUrl);
    redirectUrl.searchParams.set('t', new Date().getTime().toString());

    return redirectUrl;
}

function getNextResponse(redirectUrl: URL) {
    const response = NextResponse.redirect(redirectUrl);

    response.cookies.set(CookieKeys.AUTH_ERROR_SIGNAL, 'signal', {
        maxAge: 10,
        path: '/',
        httpOnly: false,
    });

    return response;
}

function isIncludesNeedAuthenticationPathnames(pathName: string): boolean {
    return NEED_AUTHENTICATION_PATHNAMES.some(needAuthenticationPathName =>
        pathName.startsWith(needAuthenticationPathName)
    );
}

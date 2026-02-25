import { CookieKeys } from '@/application/constants/cookie-keys';
import { cookies } from 'next/headers';

export async function saveTokensByCookieStore(
    accessToken: string,
    refreshToken: string
): Promise<boolean> {
    const cookieStore = await cookies();

    cookieStore.set(CookieKeys.ACCESS_TOKEN, accessToken, {
        httpOnly: true,
        secure: true,
        path: '/',
    });
    cookieStore.set(CookieKeys.REFRESH_TOKEN, refreshToken, {
        httpOnly: true,
        secure: true,
        path: '/',
    });

    return true;
}

export async function saveUserIdByCookieStore(
    userId: string
): Promise<boolean> {
    const cookieStore = await cookies();

    cookieStore.set(CookieKeys.USER_ID, userId, {
        httpOnly: true,
        secure: true,
        path: '/',
    });

    return true;
}

export async function deleteTokensByCookieStore(): Promise<boolean> {
    const cookieStore = await cookies();

    cookieStore.delete(CookieKeys.ACCESS_TOKEN);
    cookieStore.delete(CookieKeys.REFRESH_TOKEN);

    return true;
}

export async function deleteUserIdByCookieStore(): Promise<boolean> {
    const cookieStore = await cookies();

    cookieStore.delete(CookieKeys.USER_ID);

    return true;
}

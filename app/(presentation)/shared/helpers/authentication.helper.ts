import { CookieKeys } from '@/application/constants/cookie-keys';

export async function ensureAuthentication() {
    if (!(await isAuthenticationComplete())) {
        throw new Error('로그인 후 접근할 수 있습니다.');
    }
}

export async function isAuthenticationComplete() {
    const token = await cookieStore.get(CookieKeys.ACCESS_TOKEN);
    return !(token?.value == null);
}

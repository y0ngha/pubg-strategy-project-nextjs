import { CookieKeys } from '@/application/constants/cookie-keys';
import { cookies } from 'next/headers';

export async function ensureAuthentication() {
    if (!(await isAuthenticationComplete())) {
        throw new Error('로그인 후 접근할 수 있습니다.');
    }
}

export async function isAuthenticationComplete() {
    const cookieStore = await cookies();
    const token = cookieStore.get(CookieKeys.ACCESS_TOKEN);
    return !!token?.value;
}

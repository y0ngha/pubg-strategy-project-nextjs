import { CookieKeys } from '@/application/constants/cookie-keys';

export async function ensureAuthentication() {
    const token = await cookieStore.get(CookieKeys.ACCESS_TOKEN);
    if (token?.value == null) {
        throw new Error('로그인 후 접근할 수 있습니다.');
    }
}

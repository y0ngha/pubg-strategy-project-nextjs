import { cookies } from 'next/headers';
import { CookieKeys } from '@/application/constants/cookie-keys';

export async function getUserIdByCookieStore() {
    const cookieStore = await cookies();

    return cookieStore.get(CookieKeys.USER_ID)?.value;
}

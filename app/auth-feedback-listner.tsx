'use client';

import { useEffect } from 'react';
import { deleteCookie, getCookie } from 'cookies-next';
import { CookieKeys } from '@/application/constants/cookie-keys';
import { toast } from 'react-toastify';
import { usePathname } from 'next/navigation';

function AuthFeedbackListner() {
    const pathname = usePathname();

    useEffect(() => {
        const cookie = getCookie(CookieKeys.AUTH_ERROR_SIGNAL);

        if (cookie != null) {
            toast.error('로그인이 필요한 서비스입니다.');
            deleteCookie(CookieKeys.AUTH_ERROR_SIGNAL);
        }
    }, [pathname]);

    return <></>;
}

AuthFeedbackListner.displayName = 'AuthFeedbackListner';

export default AuthFeedbackListner;

'use client';

import { useEffect } from 'react';
import { deleteCookie, useCookiesNext } from 'cookies-next';
import { CookieKeys } from '@/application/constants/cookie-keys';
import { toast } from 'react-toastify';

function AuthFeedbackListner() {
    const cookie = useCookiesNext();

    useEffect(() => {
        const authErrorSignal = cookie.getCookie(CookieKeys.AUTH_ERROR_SIGNAL);

        if (authErrorSignal != null) {
            toast.error('로그인이 필요한 서비스입니다.');
            deleteCookie(CookieKeys.AUTH_ERROR_SIGNAL);
        }
    }, [cookie]);

    return <></>;
}

AuthFeedbackListner.displayName = 'AuthFeedbackListner';

export default AuthFeedbackListner;

'use client';

import { useEffect } from 'react';
import { deleteCookie, getCookie } from 'cookies-next';
import { CookieKeys } from '@/application/constants/cookie-keys';
import { toast } from 'react-toastify';
import { usePathname, useSearchParams } from 'next/navigation';

function AuthFeedbackListner() {
    const pathname = usePathname();
    const searchParams = useSearchParams();

    useEffect(() => {
        const authErrorSignal = getCookie(CookieKeys.AUTH_ERROR_SIGNAL);

        if (authErrorSignal != null) {
            toast.error('로그인이 필요한 서비스입니다.', {
                toastId: 'AUTH_ERROR',
            });
            deleteCookie(CookieKeys.AUTH_ERROR_SIGNAL);
        }
    }, [searchParams, pathname]);

    return <></>;
}

AuthFeedbackListner.displayName = 'AuthFeedbackListner';

export default AuthFeedbackListner;

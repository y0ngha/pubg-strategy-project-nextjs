import { cookies } from 'next/headers';
import { env } from '../config/environment-variables';
import { RequestInterceptor, ResponseInterceptor } from './types';

export const loggingRequestInterceptor: RequestInterceptor<unknown> = async (url, config) => {
    if (env.NODE_ENV === 'development') {
        console.log(`[API Request] ${config.method} ${url}`);
        console.log('[API Body]', config.body);
    }
    return { url, config };
};

export const loggingResponseInterceptor: ResponseInterceptor = (response) => {
    if (env.NODE_ENV === 'development') {
        console.log(`[API Response] ${response.status} ${response.url}`);
    }
    return response;
};

export const authRequestInterceptor: RequestInterceptor<unknown> = async (url, config) => {
    if (config.withAuthorizationHeader) {
        if (typeof window === 'undefined') {
            const token = (await cookies()).get('auth_token')?.value;
            if (token) {
                config.headers = {
                    ...config.headers,
                    'Authorization': `Bearer ${token}`,
                };
            }
        }
    }

    return { url, config };
};

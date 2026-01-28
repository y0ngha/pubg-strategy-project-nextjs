export const CookieKeys = {
    ACCESS_TOKEN: 'ACCESS_TOKEN',
    REFRESH_TOKEN: 'REFRESH_TOKEN',
    USER_ID: 'USER_ID',
    AUTH_ERROR_SIGNAL: 'AUTH_ERROR_SIGNAL',
} as const;

export type CookieKeys = (typeof CookieKeys)[keyof typeof CookieKeys];

export const CookieKeys = {
    ACCESS_TOKEN: 'ACCESS_TOKEN',
    REFRESH_TOKEN: 'REFRESH_TOKEN',
    USER_ID: 'USER_ID',
} as const;

export type CookieKeys = (typeof CookieKeys)[keyof typeof CookieKeys];

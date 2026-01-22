export const CookieKeys = {
    ACCESS_TOKEN: 'ACCESS_TOKEN',
    REFRESH_TOKEN: 'REFRESH_TOKEN',
} as const;

export type CookieKeys = (typeof CookieKeys)[keyof typeof CookieKeys];

export const ReactQueryKeys = {
    GET_CURRENT_USER: 'GET_CURRENT_USER',
    STRATIGES: 'STRATIGES',
    SHARED_STRATIGES: 'SHARED_STRATIGES',
    FRIENDS: 'FRIENDS',
} as const;

export type ReactQueryKeys =
    (typeof ReactQueryKeys)[keyof typeof ReactQueryKeys];

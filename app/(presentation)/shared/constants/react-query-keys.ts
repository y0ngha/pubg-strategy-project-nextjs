export const ReactQueryKeys = {
    GET_CURRENT_USER: 'GET_CURRENT_USER',
    STRATIGES: 'STRATIGES',
    STRATIGES_ALL: 'STRATIGES_ALL',
    SHARED_STRATIGES: 'SHARED_STRATIGES',
    SHARED_STRATIGES_ALL: 'SHARED_STRATIGES_ALL',
    FRIENDS: 'FRIENDS',
} as const;

export type ReactQueryKeys =
    (typeof ReactQueryKeys)[keyof typeof ReactQueryKeys];

export const ReactQueryKeys = {
    GET_CURRENT_USER: 'GET_CURRENT_USER',
} as const;

export type ReactQueryKeys =
    (typeof ReactQueryKeys)[keyof typeof ReactQueryKeys];

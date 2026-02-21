export const ReactQueryKeys = {
    GET_CURRENT_USER: 'GET_CURRENT_USER',
    STRATIGIES: 'STRATIGIES',
    STRATEGIES_ALL: 'STRATIGIES_ALL',
    SHARED_STRATIGIES: 'SHARED_STRATIGIES',
    SHARED_STRATIGIES_ALL: 'SHARED_STRATIGIES_ALL',
    FRIENDS: 'FRIENDS',
    FRIENDS_ALL: 'FRIENDS_ALL',
} as const;

export type ReactQueryKeys =
    (typeof ReactQueryKeys)[keyof typeof ReactQueryKeys];

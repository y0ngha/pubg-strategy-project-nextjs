export const Route = {
    STATS: '/stats',
    STRATEGIES: '/strategies',
    LEADERBOARD: '/leaderboard',
    TERMS: '/terms',
    MAIN: '/',
    LOGIN: '/login',
    REGISTER: '/register',
    MYPAGE: '/mypage',

    STRATEGIES_NEW: '/strategies/new',
} as const;

export type Route = (typeof Route)[keyof typeof Route];

export const Routes = {
    STATS: '/stats',
    STRATEGIES: '/strategies',
    LEADERBOARD: '/leaderboard',
    TERMS: '/terms',
    MAIN: '/',
    LOGIN: '/login',
    REGISTER: '/register',
    MYPAGE: '/mypage',
    FRIENDS: '/mypage/friends',

    STRATEGIES_NEW: '/strategies/new',
} as const;

export type Routes = (typeof Routes)[keyof typeof Routes];

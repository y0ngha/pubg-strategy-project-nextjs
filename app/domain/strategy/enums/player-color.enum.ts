export const PlayerColor = {
    YELLOW: '#FBBF24',
    ORANGE: '#E67E22',
    BLUE: '#3498DB',
    GREEN: '#2ECC71',
} as const;

export type PlayerColor = (typeof PlayerColor)[keyof typeof PlayerColor];

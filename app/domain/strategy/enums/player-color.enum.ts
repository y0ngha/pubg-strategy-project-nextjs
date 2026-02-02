export const PlayerColor = {
    YELLOW: '#ffff00',
    ORANGE: '#ff8c00',
    BLUE: '#0000ff',
    GREEN: '#00ff00',
} as const;

export type PlayerColor = (typeof PlayerColor)[keyof typeof PlayerColor];

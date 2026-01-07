export const PlayerColor = {
    RED: '#FF0000',
    ORANGE: '#ff8c00',
    YELLOW: '#ffff00',
    GREEN: '#00ff00',
} as const;

export type PlayerColor = (typeof PlayerColor)[keyof typeof PlayerColor];

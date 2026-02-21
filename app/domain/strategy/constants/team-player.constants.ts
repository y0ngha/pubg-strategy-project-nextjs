import { PlayerColor } from '@domain/strategy/enums/player-color.enum';

export const TEAM_PLAYER_COLOR_MAP: Record<number, PlayerColor> = {
    1: PlayerColor.YELLOW,
    2: PlayerColor.ORANGE,
    3: PlayerColor.BLUE,
    4: PlayerColor.GREEN,
} as const;

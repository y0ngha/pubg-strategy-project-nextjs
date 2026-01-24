export type StrategiesBoardMap =
    | 'erangel'
    | 'miramar'
    | 'sanhok'
    | 'taego'
    | 'vikendi'
    | 'rondo'
    | 'karakin'
    | 'haven'
    | 'deston';

export interface StrategyPost {
    id: string;
    map: StrategiesBoardMap;
    title: string;
    author: string;
    updatedAt: string;
}

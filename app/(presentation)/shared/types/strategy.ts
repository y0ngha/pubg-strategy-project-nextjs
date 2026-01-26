export type StrategiesBoardMap =
    | '에란겔'
    | '미라마'
    | '테이고'
    | '론도'
    | '사녹'
    | '비켄디'
    | '카라킨'
    | '헤이븐'
    | '데스턴';

export interface StrategyPost {
    id: string;
    map: StrategiesBoardMap;
    title: string;
    author: string;
    updatedAt: string;
}

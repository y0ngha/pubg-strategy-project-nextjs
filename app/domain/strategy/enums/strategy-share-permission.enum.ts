export const StrategySharePermission = {
    ACCESS_DENIED: 'ACCESS_DENIED',
    READ_ONLY: 'READ_ONLY',
    EDITABLE: 'EDITABLE',
} as const;

export type StrategySharePermission =
    (typeof StrategySharePermission)[keyof typeof StrategySharePermission];

export const StrategySharePermissionLabels: Record<
    StrategySharePermission,
    string
> = {
    [StrategySharePermission.ACCESS_DENIED]: '권한없음',
    [StrategySharePermission.READ_ONLY]: '읽기전용',
    [StrategySharePermission.EDITABLE]: '편집가능',
};

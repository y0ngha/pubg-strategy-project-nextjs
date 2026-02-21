export const StrategySharePermission = {
    READ_ONLY: 'READ_ONLY',
    EDITABLE: 'EDITABLE',
} as const;

export type StrategySharePermission =
    (typeof StrategySharePermission)[keyof typeof StrategySharePermission];

export const StrategySharePermissionLabels: Record<
    StrategySharePermission,
    string
> = {
    [StrategySharePermission.READ_ONLY]: '읽기전용',
    [StrategySharePermission.EDITABLE]: '편집가능',
};

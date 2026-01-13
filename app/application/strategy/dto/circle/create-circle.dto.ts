import { z } from 'zod';
import { UserId } from '@domain/shared/value-objects/user-id';
import { StrategyId } from '@domain/strategy/value-objects/strategy-id';

export interface CreateCircleRequestDto {
    actorId: string;
    strategyId: string;
    phase: number;
}

export const CreateCircleRequestSchema = z.object({
    actorId: z.string().transform(value => {
        return UserId.create(value);
    }),
    strategyId: z.string().transform(value => {
        return StrategyId.create(value);
    }),
    phase: z
        .number()
        .min(1, { error: '페이즈는 1이상 이어야 합니다.' })
        .max(8, { error: '페이즈는 8이하 이어야 합니다.' }),
});

import { z } from 'zod';
import { UserId } from '@domain/shared/value-objects/user-id';
import { PubgMap } from '@domain/strategy/enums/map.enum';
import { StrategyId } from '@domain/strategy/value-objects/strategy-id';
import { StrategyTitle } from '@domain/strategy/value-objects/strategy-title';

export interface UpdateStrategyRequestDto {
    actorId: string;
    strategyId: string;
    title?: string;
    map?: string;
}

export const UpdateStrategyRequestSchema = z
    .object({
        actorId: z.string().transform(value => {
            return UserId.create(value);
        }),
        strategyId: z.string().transform(value => {
            return StrategyId.create(value);
        }),
        title: z
            .string()
            .transform(value => {
                return StrategyTitle.create(value);
            })
            .optional(),
        map: z.enum(PubgMap).optional(),
    })
    .refine(
        ({ title, map }) => {
            return title !== undefined || map !== undefined;
        },
        {
            error: '업데이트 할 속성이 없습니다.',
            path: ['title', 'map'],
        }
    );

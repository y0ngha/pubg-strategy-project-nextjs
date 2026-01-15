import { z } from 'zod';
import { UserId } from '@domain/shared/value-objects/user-id';
import { PubgMap } from '@domain/strategy/enums/map.enum';
import { StrategyTitle } from '@domain/strategy/value-objects/strategy-title';

export interface CreateStrategyRequestDto {
    actorId: string;
    title: string;
    map: string;
}

export const CreateStrategyRequestSchema = z.object({
    actorId: z.string().transform(value => {
        return UserId.create(value);
    }),
    title: z.string().transform(value => {
        return StrategyTitle.create(value);
    }),
    map: z.enum(PubgMap),
});

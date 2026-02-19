import { z } from 'zod';
import { PubgMap } from '@domain/strategy/enums/map.enum';
import { StrategyTitle } from '@domain/strategy/value-objects/strategy-title';

export interface CreateStrategyRequestDto {
    title: string;
    map: string;
}

export const CreateStrategyRequestSchema = z.object({
    title: z.string().transform(value => {
        return StrategyTitle.create(value);
    }),
    map: z.enum(PubgMap),
});

import { z } from 'zod';
import { UserId } from '@domain/shared/value-objects/user-id';
import { PubgMap } from '@domain/strategy/enums/map.enum';
import { StrategyTitle } from '@domain/strategy/value-objects/strategy-title';
import { Email } from '@domain/shared/value-objects/email';

export interface CreateStrategyRequestDto {
    actorId: string;
    actorEmail: string;
    title: string;
    map: string;
}

export const CreateStrategyRequestSchema = z.object({
    actorId: z.string().transform(value => {
        return UserId.create(value);
    }),
    actorEmail: z.string().transform(value => {
        return Email.create(value);
    }),
    title: z.string().transform(value => {
        return StrategyTitle.create(value);
    }),
    map: z.enum(PubgMap),
});

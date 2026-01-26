import { inject, injectable } from 'inversify';
import { StrategyRepositoryPort } from '@domain/strategy/port/out/strategy-repository.port';
import {
    CreateStrategyRequestDto,
    CreateStrategyRequestSchema,
} from '@/application/strategy/dto/strategy/create-strategy.dto';
import { Strategy } from '@domain/strategy/entities/strategy.entity';

@injectable()
export class CreateStrategyUseCase {
    constructor(
        @inject(StrategyRepositoryPort)
        private readonly strategyRepository: StrategyRepositoryPort
    ) {}

    async execute(dto: CreateStrategyRequestDto): Promise<boolean> {
        const { actorId, actorEmail, title, map } =
            CreateStrategyRequestSchema.parse(dto);

        const strategy = Strategy.create(actorId, actorEmail, title, map);

        await this.strategyRepository.save(strategy);

        return true;
    }
}

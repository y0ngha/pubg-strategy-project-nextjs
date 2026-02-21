import { inject, injectable } from 'inversify';
import {
    GetStrategyRequestDto,
    GetStrategyRequestSchema,
    GetStrategyResponseDto,
} from '@/application/strategy/dto/strategy/get-strategy.dto';
import { StrategyMapper } from '@/application/strategy/mappers/strategy.mapper';
import { StrategyNotFoundException } from '@domain/strategy/exceptions/strategy.exceptions';
import { StrategyQueryRepositoryPort } from '@domain/strategy/port/repositories/strategy-query-repository.port';

@injectable()
export class GetStrategyUseCase {
    constructor(
        @inject(StrategyQueryRepositoryPort)
        private readonly strategyQueryRepositoryPort: StrategyQueryRepositoryPort,
        @inject(StrategyMapper)
        private readonly strategyMapper: StrategyMapper
    ) {}

    async execute(dto: GetStrategyRequestDto): Promise<GetStrategyResponseDto> {
        const { strategyId } = GetStrategyRequestSchema.parse(dto);

        const strategy =
            await this.strategyQueryRepositoryPort.findById(strategyId);

        if (!strategy) {
            throw new StrategyNotFoundException();
        }

        return this.strategyMapper.toResponse(strategy);
    }
}

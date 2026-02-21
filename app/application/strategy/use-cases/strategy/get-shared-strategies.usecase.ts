import { inject, injectable } from 'inversify';
import {
    GetStrategiesRequestDto,
    GetStrategiesRequestSchema,
} from '@/application/strategy/dto/strategy/get-strategy.dto';
import { StrategyMapper } from '@/application/strategy/mappers/strategy.mapper';
import { StrategyQueryRepositoryPort } from '@domain/strategy/port/repositories/strategy-query-repository.port';

@injectable()
export class GetSharedStrategiesUseCase {
    constructor(
        @inject(StrategyQueryRepositoryPort)
        private readonly strategyQueryRepositoryPort: StrategyQueryRepositoryPort,
        @inject(StrategyMapper)
        private readonly strategyMapper: StrategyMapper
    ) {}

    async execute(dto: GetStrategiesRequestDto) {
        const { page, limit } = GetStrategiesRequestSchema.parse(dto);

        const { hasNextPage, data } =
            await this.strategyQueryRepositoryPort.findSharedStrategies(
                page,
                limit
            );

        return {
            hasNextPage: hasNextPage,
            data: data.map(strategy =>
                this.strategyMapper.toResponse(strategy)
            ),
        };
    }
}

import { inject, injectable } from 'inversify';
import { StrategyRepositoryPort } from '@domain/strategy/port/out/strategy-repository.port';
import {
    GetStrategiesRequestDto,
    GetStrategiesRequestSchema,
} from '@/application/strategy/dto/strategy/get-strategy.dto';
import { StrategyMapper } from '@/application/strategy/mappers/strategy.mapper';

@injectable()
export class GetSharedStrategiesUseCase {
    constructor(
        @inject(StrategyRepositoryPort)
        private readonly strategyRepository: StrategyRepositoryPort,
        @inject(StrategyMapper)
        private readonly strategyMapper: StrategyMapper
    ) {}

    async execute(dto: GetStrategiesRequestDto) {
        const { actorId, page, limit } = GetStrategiesRequestSchema.parse(dto);

        const { hasNextPage, data } =
            await this.strategyRepository.findSharedStrategiesByUserID(
                actorId,
                page,
                limit
            );

        return {
            hasNextPage: hasNextPage,
            data: data.map(strategy =>
                this.strategyMapper.toResponse(strategy, actorId)
            ),
        };
    }
}

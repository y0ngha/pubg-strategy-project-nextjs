import { inject, injectable } from 'inversify';
import { StrategyRepositoryPort } from '@domain/strategy/port/out/strategy-repository.port';
import {
    GetStrategyRequestDto,
    GetStrategyRequestSchema,
    GetStrategyResponseDto,
} from '@/application/strategy/dto/strategy/get-strategy.dto';
import { StrategyMapper } from '@/application/strategy/mappers/strategy.mapper';
import {
    StrategyAccessDeniedException,
    StrategyNotFoundException,
} from '@domain/strategy/exceptions/strategy.exceptions';

@injectable()
export class GetStrategyUseCase {
    constructor(
        @inject(StrategyRepositoryPort)
        private readonly strategyRepository: StrategyRepositoryPort,
        @inject(StrategyMapper)
        private readonly strategyMapper: StrategyMapper
    ) {}

    async execute(dto: GetStrategyRequestDto): Promise<GetStrategyResponseDto> {
        const { actorId, strategyId } = GetStrategyRequestSchema.parse(dto);

        const strategy = await this.strategyRepository.findById(strategyId);

        if (!strategy) {
            throw new StrategyNotFoundException();
        }

        if (!strategy.isAccessibleByUserId(actorId)) {
            throw new StrategyAccessDeniedException();
        }

        return this.strategyMapper.toResponse(strategy, actorId);
    }
}

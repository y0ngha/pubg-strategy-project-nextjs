import { inject, injectable } from 'inversify';
import { StrategyRepositoryPort } from '@domain/strategy/port/out/strategy-repository.port';
import {
    GetStrategiesRequestDto,
    GetStrategiesRequestSchema,
    GetStrategiesResponseDto,
} from '@/application/strategy/dto/strategy/get-strategy.dto';
import { StrategyMapper } from '@/application/strategy/mappers/strategy.mapper';
import { Strategy } from '@domain/strategy/entities/strategy.entity';
import { UserId } from '@domain/shared/value-objects/user-id';

@injectable()
export class GetStrategiesUseCase {
    constructor(
        @inject(StrategyRepositoryPort)
        private readonly strategyRepository: StrategyRepositoryPort,
        @inject(StrategyMapper)
        private readonly strategyMapper: StrategyMapper
    ) {}

    async execute(
        dto: GetStrategiesRequestDto
    ): Promise<GetStrategiesResponseDto> {
        const { actorId } = GetStrategiesRequestSchema.parse(dto);

        const strategies = await this.fetchAllStrategies(actorId);

        return strategies
            .map(strategy => this.strategyMapper.toResponse(strategy, actorId))
            .sort(this.compareByNewestAndTitle);
    }

    private async fetchAllStrategies(actorId: UserId): Promise<Strategy[]> {
        const [owned, shared] = await Promise.all([
            this.strategyRepository.findOwnedStrategiesByUserID(
                actorId,
                1, // 현재 구현 안됨 -> 정해지지 않은 부분으로 임시 처리
                100 // 현재 구현 안됨 -> 정해지지 않은 부분으로 임시 처리
            ),
            this.strategyRepository.findSharedStrategiesByUserID(
                actorId,
                1, // 현재 구현 안됨 -> 정해지지 않은 부분으로 임시 처리
                100 // 현재 구현 안됨 -> 정해지지 않은 부분으로 임시 처리
            ),
        ]);

        return [...owned, ...shared];
    }

    private compareByNewestAndTitle(
        a: GetStrategiesResponseDto[number],
        b: GetStrategiesResponseDto[number]
    ): number {
        const timeDiff = b.createdAt.getTime() - a.createdAt.getTime();

        return timeDiff !== 0 ? timeDiff : a.title.localeCompare(b.title);
    }
}

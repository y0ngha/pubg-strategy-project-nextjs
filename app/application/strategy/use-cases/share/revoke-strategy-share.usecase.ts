import { inject, injectable } from 'inversify';
import { StrategyRepositoryPort } from '@domain/strategy/port/out/strategy-repository.port';
import { StrategyNotFoundException } from '@domain/strategy/exceptions/strategy.exceptions';
import {
    RevokeStrategyShareRequestDto,
    RevokeStrategyShareRequestSchema,
} from '@/application/strategy/dto/share/revoke-strategy-share.dto';
import { StrategySharePermission } from '@domain/strategy/enums/strategy-share-permission.enum';

@injectable()
export class RevokeStrategyShareUseCase {
    constructor(
        @inject(StrategyRepositoryPort)
        private readonly strategyRepository: StrategyRepositoryPort
    ) {}

    async execute(dto: RevokeStrategyShareRequestDto): Promise<boolean> {
        const { actorId, strategyId, strategyShareId } =
            RevokeStrategyShareRequestSchema.parse(dto);

        const strategy = await this.strategyRepository.findById(strategyId);

        if (!strategy) {
            throw new StrategyNotFoundException();
        }

        strategy.updateStrategySharePermission(
            actorId,
            strategyShareId,
            StrategySharePermission.ACCESS_DENIED
        );

        await this.strategyRepository.save(strategy);

        return true;
    }
}

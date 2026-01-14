import { inject, injectable } from 'inversify';
import { StrategyRepositoryPort } from '@domain/strategy/port/out/strategy-repository.port';
import { StrategyNotFoundException } from '@domain/strategy/exceptions/strategy.exceptions';
import {
    UpdateStrategySharePermissionRequestDto,
    UpdateStrategySharePermissionRequestSchema,
} from '@/application/strategy/dto/share/update-strategy-share-permission.dto';

@injectable()
export class UpdateStrategySharePermissionUseCase {
    constructor(
        @inject(StrategyRepositoryPort)
        private readonly strategyRepository: StrategyRepositoryPort
    ) {}

    async execute(
        dto: UpdateStrategySharePermissionRequestDto
    ): Promise<boolean> {
        const { actorId, strategyId, strategyShareId, permission } =
            UpdateStrategySharePermissionRequestSchema.parse(dto);

        const strategy = await this.strategyRepository.findById(strategyId);

        if (!strategy) {
            throw new StrategyNotFoundException();
        }

        strategy.updateStrategySharePermission(
            actorId,
            strategyShareId,
            permission
        );

        await this.strategyRepository.save(strategy);

        return true;
    }
}

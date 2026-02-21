import { inject, injectable } from 'inversify';
import {
    CreateStrategyShareRequestDto,
    CreateStrategyShareRequestSchema,
} from '@/application/strategy/dto/share/create-strategy-share.dto';
import { StrategyCommandRepositoryPort } from '@domain/strategy/port/repositories/strategy-command-repository.port';
import { CreateStrategyShareCommand } from '@domain/strategy/commands/strategy-share/create-strategy-share.command';
import { StrategySharePermissionLabels } from '@domain/strategy/enums/strategy-share-permission.enum';

@injectable()
export class CreateStrategyShareUseCase {
    constructor(
        @inject(StrategyCommandRepositoryPort)
        private readonly strategyCommandRepositoryPort: StrategyCommandRepositoryPort
    ) {}

    async execute(dto: CreateStrategyShareRequestDto) {
        const { strategyId, targetUserId, permission } =
            CreateStrategyShareRequestSchema.parse(dto);

        const command = CreateStrategyShareCommand.create(
            strategyId,
            targetUserId,
            permission
        );

        const strategyShare =
            await this.strategyCommandRepositoryPort.createStrategyShare(
                command
            );

        return {
            id: strategyShare.id,
            sharedUserId: strategyShare.sharedUserId,
            sharedEmail: strategyShare.sharedEmail,
            permission: strategyShare.permission,
            permissionLabel:
                StrategySharePermissionLabels[strategyShare.permission],
        };
    }
}

import { inject, injectable } from 'inversify';
import {
    UpdateStrategySharePermissionRequestDto,
    UpdateStrategySharePermissionRequestSchema,
} from '@/application/strategy/dto/share/update-strategy-share-permission.dto';
import { StrategyCommandRepositoryPort } from '@domain/strategy/port/repositories/strategy-command-repository.port';
import { UpdateStrategySharePermissionCommand } from '@domain/strategy/commands/strategy-share/update-strategy-share-permission.command';
import { StrategySharePermissionLabels } from '@domain/strategy/enums/strategy-share-permission.enum';

@injectable()
export class UpdateStrategySharePermissionUseCase {
    constructor(
        @inject(StrategyCommandRepositoryPort)
        private readonly strategyCommandRepositoryPort: StrategyCommandRepositoryPort
    ) {}

    async execute(dto: UpdateStrategySharePermissionRequestDto) {
        const { strategyId, strategyShareId, permission } =
            UpdateStrategySharePermissionRequestSchema.parse(dto);

        const command = UpdateStrategySharePermissionCommand.create(
            strategyId,
            strategyShareId,
            permission
        );

        await this.strategyCommandRepositoryPort.updateStrategySharePermission(
            command
        );

        return {
            strategyShareId: strategyShareId.toString(),
            permission: permission,
            permissionLabel: StrategySharePermissionLabels[permission],
        };
    }
}

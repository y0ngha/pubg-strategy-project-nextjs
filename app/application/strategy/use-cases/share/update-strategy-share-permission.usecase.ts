import { inject, injectable } from 'inversify';
import {
    UpdateStrategySharePermissionRequestDto,
    UpdateStrategySharePermissionRequestSchema,
} from '@/application/strategy/dto/share/update-strategy-share-permission.dto';
import { StrategyCommandRepositoryPort } from '@domain/strategy/port/repositories/strategy-command-repository.port';
import { UpdateStrategySharePermissionCommand } from '@domain/strategy/commands/strategy-share/update-strategy-share-permission.command';

@injectable()
export class UpdateStrategySharePermissionUseCase {
    constructor(
        @inject(StrategyCommandRepositoryPort)
        private readonly strategyCommandRepositoryPort: StrategyCommandRepositoryPort
    ) {}

    async execute(
        dto: UpdateStrategySharePermissionRequestDto
    ): Promise<boolean> {
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

        return true;
    }
}

import { inject, injectable } from 'inversify';
import {
    DeleteTagRequestDto,
    DeleteTagRequestSchema,
} from '@/application/strategy/dto/tag/delete-tag.dto';
import { StrategyCommandRepositoryPort } from '@domain/strategy/port/repositories/strategy-command-repository.port';
import { DeleteTagCommand } from '@domain/strategy/commands/tag/delete-tag.command';

@injectable()
export class DeleteTagUseCase {
    constructor(
        @inject(StrategyCommandRepositoryPort)
        private readonly strategyCommandRepositoryPort: StrategyCommandRepositoryPort
    ) {}

    async execute(dto: DeleteTagRequestDto) {
        const { strategyId, tagId } = DeleteTagRequestSchema.parse(dto);

        const command = DeleteTagCommand.create(strategyId, tagId);

        await this.strategyCommandRepositoryPort.deleteTag(command);

        return {
            tagId: tagId.toString(),
        };
    }
}

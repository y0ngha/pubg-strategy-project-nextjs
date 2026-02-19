import { inject, injectable } from 'inversify';
import {
    CreateTagRequestDto,
    CreateTagRequestSchema,
} from '@/application/strategy/dto/tag/create-tag.dto';
import { StrategyCommandRepositoryPort } from '@domain/strategy/port/repositories/strategy-command-repository.port';
import { CreateTagCommand } from '@domain/strategy/commands/tag/create-tag.command';

@injectable()
export class CreateTagUseCase {
    constructor(
        @inject(StrategyCommandRepositoryPort)
        private readonly strategyCommandRepositoryPort: StrategyCommandRepositoryPort
    ) {}

    async execute(dto: CreateTagRequestDto) {
        const { strategyId, position, content } =
            CreateTagRequestSchema.parse(dto);

        const command = CreateTagCommand.create(strategyId, position, content);

        const tag = await this.strategyCommandRepositoryPort.createTag(command);

        return {
            id: tag.id.toString(),
            position: {
                x: tag.position.x,
                y: tag.position.y,
            },
            content: tag.content.toString(),
        };
    }
}

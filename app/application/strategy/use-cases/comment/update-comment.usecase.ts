import { inject, injectable } from 'inversify';
import { StrategyRepositoryPort } from '@domain/strategy/port/out/strategy-repository.port';
import {
    UpdateCommentRequestDto,
    UpdateCommentRequestSchema,
} from '@/application/strategy/dto/comment/update-comment.dto';
import { StrategyNotFoundException } from '@domain/strategy/exceptions/strategy.exceptions';

@injectable()
export class UpdateCommentUseCase {
    constructor(
        @inject(StrategyRepositoryPort)
        private readonly strategyRepository: StrategyRepositoryPort
    ) {}

    async execute(dto: UpdateCommentRequestDto) {
        const { actorId, strategyId, commentId, content, position } =
            UpdateCommentRequestSchema.parse(dto);

        const strategy = await this.strategyRepository.findById(strategyId);

        if (!strategy) {
            throw new StrategyNotFoundException();
        }

        const comment = strategy.updateComment(
            actorId,
            commentId,
            content,
            position
        );

        await this.strategyRepository.save(strategy);

        return {
            id: comment.id.toString(),
            position:
                comment.position !== null
                    ? { x: comment.position.x, y: comment.position.y }
                    : null,
            content: comment.content.toString(),
        };
    }
}

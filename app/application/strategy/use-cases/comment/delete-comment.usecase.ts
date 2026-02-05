import { inject, injectable } from 'inversify';
import { StrategyRepositoryPort } from '@domain/strategy/port/out/strategy-repository.port';
import { StrategyNotFoundException } from '@domain/strategy/exceptions/strategy.exceptions';
import {
    DeleteCommentRequestDto,
    DeleteCommentRequestSchema,
} from '@/application/strategy/dto/comment/delete-comment.dto';

@injectable()
export class DeleteCommentUseCase {
    constructor(
        @inject(StrategyRepositoryPort)
        private readonly strategyRepository: StrategyRepositoryPort
    ) {}

    async execute(dto: DeleteCommentRequestDto) {
        const { actorId, strategyId, commentId } =
            DeleteCommentRequestSchema.parse(dto);

        const strategy = await this.strategyRepository.findById(strategyId);

        if (!strategy) {
            throw new StrategyNotFoundException();
        }

        strategy.removeComment(actorId, commentId);

        await this.strategyRepository.save(strategy);

        return {
            commentId: commentId.toString(),
        };
    }
}

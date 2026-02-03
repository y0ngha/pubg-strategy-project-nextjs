import { inject, injectable } from 'inversify';
import { StrategyRepositoryPort } from '@domain/strategy/port/out/strategy-repository.port';
import { StrategyNotFoundException } from '@domain/strategy/exceptions/strategy.exceptions';
import {
    CreateCommentRequestDto,
    CreateCommentRequestSchema,
} from '@/application/strategy/dto/comment/create-comment.dto';

@injectable()
export class CreateCommentUseCase {
    constructor(
        @inject(StrategyRepositoryPort)
        private readonly strategyRepository: StrategyRepositoryPort
    ) {}

    async execute(dto: CreateCommentRequestDto) {
        const {
            actorId,
            actorEmail,
            strategyId,
            content,
            parentCommentId,
            position,
        } = CreateCommentRequestSchema.parse(dto);

        const strategy = await this.strategyRepository.findById(strategyId);

        if (!strategy) {
            throw new StrategyNotFoundException();
        }

        const comment = strategy.addComment(
            actorId,
            actorEmail,
            content,
            position ?? null,
            parentCommentId ?? null
        );

        await this.strategyRepository.save(strategy);

        return {
            id: comment.id.toString(),
            position:
                comment.position !== null
                    ? { x: comment.position.x, y: comment.position.y }
                    : null,
            authorId: comment.authorId.toString(),
            authorEmail: comment.authorEmail.toString(),
            content: comment.content.toString(),
            parentCommentId: comment.parentCommentId?.toString() ?? null,
            createdAt: comment.createdAt,
            isAuthor: comment.authorId.equals(actorId),
        };
    }
}

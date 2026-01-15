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

    async execute(dto: CreateCommentRequestDto): Promise<boolean> {
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

        strategy.addComment(
            actorId,
            actorEmail,
            content,
            position ?? null,
            parentCommentId ?? null
        );

        await this.strategyRepository.save(strategy);

        return true;
    }
}

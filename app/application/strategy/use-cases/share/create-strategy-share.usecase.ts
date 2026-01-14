import { inject, injectable } from 'inversify';
import { StrategyRepositoryPort } from '@domain/strategy/port/out/strategy-repository.port';
import { StrategyNotFoundException } from '@domain/strategy/exceptions/strategy.exceptions';
import {
    CreateStrategyShareRequestDto,
    CreateStrategyShareRequestSchema,
} from '@/application/strategy/dto/share/create-strategy-share.dto';
import { UserRepositoryPort } from '@domain/user/port/out/user-repository.port';
import { UserNotFoundException } from '@domain/user/exceptions/user.exceptions';

@injectable()
export class CreateStrategyShareUseCase {
    constructor(
        @inject(StrategyRepositoryPort)
        private readonly strategyRepository: StrategyRepositoryPort,
        @inject(UserRepositoryPort)
        private readonly userRepository: UserRepositoryPort
    ) {}

    async execute(dto: CreateStrategyShareRequestDto): Promise<boolean> {
        const { actorId, strategyId, targetUserId, permission } =
            CreateStrategyShareRequestSchema.parse(dto);

        const [strategy, user] = await Promise.all([
            await this.strategyRepository.findById(strategyId),
            await this.userRepository.findByUserId(targetUserId),
        ]);

        if (!strategy) {
            throw new StrategyNotFoundException();
        }

        if (!user) {
            throw new UserNotFoundException();
        }

        strategy.addStrategyShare(
            actorId,
            targetUserId,
            user.email,
            permission
        );

        await this.strategyRepository.save(strategy);

        return true;
    }
}

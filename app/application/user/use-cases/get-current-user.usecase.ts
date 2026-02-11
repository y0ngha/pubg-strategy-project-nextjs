import { UserNotFoundException } from '@/domain/user/exceptions/user.exceptions';
import { UserQueryRepositoryPort } from '@domain/user/port/repositories/user-query-repository.port';
import { inject, injectable } from 'inversify';
import { GetCurrentUserResponseDto } from '@/application/user/dto/get-current-user.dto';

@injectable()
export class GetCurrentUserUseCase {
    constructor(
        @inject(UserQueryRepositoryPort)
        private readonly userQueryRepository: UserQueryRepositoryPort
    ) {}

    async execute(): Promise<GetCurrentUserResponseDto> {
        const user = await this.userQueryRepository.findByAccessToken();

        if (!user) {
            throw new UserNotFoundException();
        }

        return {
            id: user.id.toString(),
            email: user.email.toString(),
        };
    }
}

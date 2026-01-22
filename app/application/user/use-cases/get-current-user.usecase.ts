import { UserNotFoundException } from '@/domain/user/exceptions/user.exceptions';
import { UserRepositoryPort } from '@/domain/user/port/out/user-repository.port';
import { inject, injectable } from 'inversify';
import { GetCurrentUserResponseDto } from '@/application/user/dto/get-current-user.dto';

@injectable()
export class GetCurrentUserUseCase {
    constructor(
        @inject(UserRepositoryPort)
        private readonly userRepository: UserRepositoryPort
    ) {}

    async execute(): Promise<GetCurrentUserResponseDto> {
        const user = await this.userRepository.findByAccessToken();

        if (!user) {
            throw new UserNotFoundException();
        }

        return {
            id: user.id.toString(),
            email: user.email.toString(),
        };
    }
}

import { UserNotFoundException } from '@/domain/user/exceptions/user.exceptions';
import { UserRepositoryPort } from '@/domain/user/port/out/user-repository.port';
import { inject, injectable } from 'inversify';
import {
    GetCurrentUserRequestDto,
    GetCurrentUserRequestSchema,
    GetCurrentUserResponseObject,
} from '../dto/get-current-user.dto';

@injectable()
export class GetCurrentUserUseCase {
    constructor(
        @inject(UserRepositoryPort)
        private readonly userRepository: UserRepositoryPort
    ) {}

    async execute(
        dto: GetCurrentUserRequestDto
    ): Promise<GetCurrentUserResponseObject> {
        const { id } = GetCurrentUserRequestSchema.parse(dto);

        const user = await this.userRepository.findByUserId(id);

        if (!user) {
            throw new UserNotFoundException(id.toString());
        }

        return {
            id: user.id.toString(),
            email: user.email.toString(),
        };
    }
}

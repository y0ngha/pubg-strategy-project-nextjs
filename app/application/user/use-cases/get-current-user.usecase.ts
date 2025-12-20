import { UserNotFoundException } from '@/domain/user/exceptions/user.exceptions';
import { UserRepositoryPort } from '@/domain/user/port/user-repository.port';
import { inject } from 'inversify';
import {
    GetCurrentUserRequestObject,
    GetCurrentUserResponseObject,
} from '../dto/get-current-user.dto';

export class GetCurrentUserUseCase {
    constructor(
        @inject(UserRepositoryPort)
        private readonly userRepository: UserRepositoryPort
    ) {}

    async execute(
        dto: GetCurrentUserRequestObject
    ): Promise<GetCurrentUserResponseObject> {
        const { id } = dto;

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

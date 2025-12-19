import { UserNotFoundException } from '@/domain/user/exceptions/user.exceptions';
import { UserRepository } from '@/domain/user/port/user.repository';
import { inject } from 'inversify';
import {
    GetCurrentUserRequestObject,
    GetCurrentUserResponseObject,
} from '../dto/get-current-user.dto';

export class GetCurrentUserUseCase {
    constructor(
        @inject(UserRepository)
        private readonly userRepository: UserRepository
    ) {}

    async execute(
        dto: GetCurrentUserRequestObject
    ): Promise<GetCurrentUserResponseObject> {
        const { id } = dto;

        // Server Dependency
        const user = await this.userRepository.findByUserId(id);

        if (!user) {
            throw new UserNotFoundException(id.toString());
        }

        // Client Dependency
        // ... UserSessionPort 이용하여 User 저장 ...
        
        return {
            id: user.id.toString(),
            email: user.email.toString(),
        };
    }
}

import { UserRepositoryPort } from '@/domain/user/port/out/user-repository.port';
import { inject, injectable } from 'inversify';
import {
    CheckEmailDupliacteRequestDto,
    CheckEmailDupliacteRequestSchema,
} from '@/application/user/dto/check-email-duplicate.dto';

@injectable()
export class CheckEmailDupliateUseCase {
    constructor(
        @inject(UserRepositoryPort)
        private readonly userRepository: UserRepositoryPort
    ) {}

    async execute(dto: CheckEmailDupliacteRequestDto): Promise<boolean> {
        const { email } = CheckEmailDupliacteRequestSchema.parse(dto);

        return await this.userRepository.existsByEmail(email);
    }
}

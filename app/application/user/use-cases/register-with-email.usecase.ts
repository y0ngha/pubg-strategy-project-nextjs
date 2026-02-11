import { inject, injectable } from 'inversify';
import {
    RegisterWithEmailRequestDto,
    RegisterWithEmailRequestSchema,
} from '../dto/register-with-email.dto';
import { UserCommandRepositoryPort } from '@domain/user/port/repositories/user-command-repository.port';
import { RegisterWithEmailCommand } from '@domain/user/commands/register-with-email.command';

@injectable()
export class RegisterWithEmailUseCase {
    constructor(
        @inject(UserCommandRepositoryPort)
        private readonly userCommandRepository: UserCommandRepositoryPort
    ) {}

    async execute(dto: RegisterWithEmailRequestDto): Promise<boolean> {
        const { email, password } = RegisterWithEmailRequestSchema.parse(dto);

        const command = RegisterWithEmailCommand.create(email, password);

        await this.userCommandRepository.registerWithEmail(command);

        return true;
    }
}

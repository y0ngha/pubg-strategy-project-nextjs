import { UserRepository } from "@/domain/user/port/user.repository";
import { PasswordValidatorService } from "@/domain/user/services/password-validator.service";
import { SymbolKeys } from "@/global/di/di-symbol";
import { inject } from "inversify";

/**
 * 이메일 회원가입 Use Case
 */
export class RegisterWithEmailUseCase {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly passwordValidatorService: PasswordValidatorService
  ) {}

  async execute(dto: RegisterWithEmailDto): Promise<RegisterWithEmailResult> {
    // 1. DTO 검증
    const validatedDto = RegisterWithEmailDtoSchema.parse(dto);

    // 2. Value Object 생성
    const email = Email.create(validatedDto.email);
    const password = Password.create(validatedDto.password);

    // 3. 이메일 중복 체크
    const existingUser = await this.userRepository.findByEmail(email);
    if (existingUser) {
      throw new Error('Email already exists');
    }

    // 4. 비밀번호 정책 검증 (이메일 포함 여부)
    if (!this.passwordValidatorService.validateNotContainsEmail(email, password)) {
      throw new Error('Password cannot contain email');
    }

    // 5. User Entity 생성
    const user = User.createWithEmail(email, password);

    // 6. 저장
    await this.userRepository.save(user);

    // 7. 결과 반환
    return {
      id: user.id.toString(),
      email: user.email.toString(),
    };
  }
}
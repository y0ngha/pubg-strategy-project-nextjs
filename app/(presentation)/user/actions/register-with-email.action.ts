'use server';

import { initializeRequestServices } from '@global/di/server/get-server-dependency';
import { RegisterWithEmailUseCase } from '@/application/user/use-cases/register-with-email.usecase';
import { parseFormData } from '@/(presentation)/shared/helpers/form-data.helper';

export type RegisterWithEmailAction = boolean;

export async function registerWithEmailAction(
    formData: FormData
): Promise<RegisterWithEmailAction> {
    const getService = initializeRequestServices();

    const { email, password, confirmPassword, terms } = parseFormData(
        formData,
        [
            {
                key: 'email',
                error: '이메일은 필수적으로 입력해야합니다.',
                type: 'string',
            },
            {
                key: 'password',
                error: '비밀번호는 필수적으로 입력해야합니다.',
                type: 'string',
            },
            {
                key: 'confirmPassword',
                error: '비밀번호 확인은 필수적으로 입력해야합니다.',
                type: 'string',
            },
            {
                key: 'terms',
                error: '약관 동의가 필요합니다.',
                type: 'boolean',
            },
        ] as const
    );

    ensureConfirmPasswordMatch(password, confirmPassword);
    ensureAgreementTerms(terms);

    const dto = {
        email: email,
        password: password,
    };

    const useCase = getService<RegisterWithEmailUseCase>(
        RegisterWithEmailUseCase
    );

    try {
        await useCase.execute(dto);

        return true;
    } catch (e) {
        throw e;
    }
}

function ensureConfirmPasswordMatch(
    password: string,
    confirmPasswordMatch: string
) {
    if (password !== confirmPasswordMatch) {
        throw new Error('비밀번호와 비밀번호 확인이 일치하지 않습니다.');
    }
}
function ensureAgreementTerms(terms: boolean) {
    if (!terms) {
        throw new Error('이용약관에 반드시 동의해야합니다.');
    }
}

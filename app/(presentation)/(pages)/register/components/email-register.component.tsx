'use client';

import Input from '@/(presentation)/shared/components/input.component';
import Button from '@/(presentation)/shared/components/button.component';
import { usePasswordMatchChecker } from '@/(presentation)/(pages)/register/hooks/usePasswordMatchChecker';
import { useEmailRegister } from '@/(presentation)/(pages)/register/hooks/useEmailRegister';
import Checkbox from '@/(presentation)/shared/components/checkbox.component';
import Link from 'next/link';

function EmailRegister() {
    const { isMatch, onPasswordChangeHanlder, onConfirmPasswordChangeHanlder } =
        usePasswordMatchChecker();

    const { isPending, formAction } = useEmailRegister();

    return (
        <form className="w-full space-y-4" action={formAction}>
            <Input
                name={'email'}
                type={'email'}
                label={'Email'}
                disabled={isPending}
            />
            <Input
                name={'password'}
                type={'password'}
                label={'Password'}
                disabled={isPending}
                onChange={onPasswordChangeHanlder}
            />
            <Input
                name={'confirmPassword'}
                type={'password'}
                label={'Confirm Password'}
                disabled={isPending}
                onChange={onConfirmPasswordChangeHanlder}
                error={!isMatch ? '비밀번호가 일치하지 않습니다.' : undefined}
            />

            <Checkbox name="terms" required>
                (필수) 서비스 이용약관에 동의합니다.{' '}
                <Link
                    className={'opacity-70 hover:opacity-100'}
                    href={'/'}
                    target={'_blank'}
                >
                    [약관 보기]
                </Link>
            </Checkbox>

            <Button
                type={'submit'}
                className={'w-full'}
                disabled={isPending || !isMatch}
            >
                회원가입
            </Button>
        </form>
    );
}

EmailRegister.displayName = 'EmailRegister';

export default EmailRegister;

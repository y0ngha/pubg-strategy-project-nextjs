'use client';

import Input from '@/(presentation)/shared/components/input.component';
import Button from '@/(presentation)/shared/components/button.component';
import { usePasswordMatchChecker } from '@/(presentation)/(pages)/register/hooks/usePasswordMatchChecker';

function EmailRegister() {
    const { isMatch, onPasswordChangeHanlder, onConfirmPasswordChangeHanlder } =
        usePasswordMatchChecker();

    const isPending = false;
    return (
        <form className="w-full space-y-4">
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

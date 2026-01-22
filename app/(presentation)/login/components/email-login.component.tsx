'use client';

import Input from '@/(presentation)/shared/components/input.component';
import Button from '@/(presentation)/shared/components/button.component';
import { useEmailLogin } from '@/(presentation)/login/hooks/useEmailLogin';

function EmailLogin() {
    const { formAction, isPending } = useEmailLogin();

    return (
        <form className="w-full space-y-4" action={formAction}>
            <Input
                name={'email'}
                type={'text'}
                label={'Email'}
                disabled={isPending}
            />
            <Input
                name={'password'}
                type={'password'}
                label={'Password'}
                disabled={isPending}
            />
            <Button type={'submit'} className={'w-full'} disabled={isPending}>
                로그인
            </Button>
        </form>
    );
}

EmailLogin.displayName = 'EmailLogin';

export default EmailLogin;

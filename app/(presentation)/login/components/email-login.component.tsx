'use client';

import Input from '@/(presentation)/shared/components/input.component';
import Button from '@/(presentation)/shared/components/button.component';
import { useEmailLogin } from '@/(presentation)/login/hooks/useEmailLogin';

function EmailLogin() {
    const { formAction } = useEmailLogin();

    return (
        <form className="w-full space-y-4" action={formAction}>
            <Input name={'email'} type={'text'} label={'Email'} />
            <Input name={'password'} type={'password'} label={'Password'} />
            <Button type={'submit'} className={'w-full'}>
                로그인
            </Button>
        </form>
    );
}

EmailLogin.displayName = 'EmailLogin';

export default EmailLogin;

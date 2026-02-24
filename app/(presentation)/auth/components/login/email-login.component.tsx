'use client';

import Input from '@/(presentation)/shared/components/input.component';
import Button from '@/(presentation)/shared/components/button.component';
import { useEmailLoginMutation } from '@/(presentation)/auth/hooks/mutations/useEmailLoginMutation';
import React from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';

interface LoginFormInputs {
    email: string;
    password: string;
}

function EmailLogin() {
    const { login, isPending } = useEmailLoginMutation();
    const { register, handleSubmit, reset } = useForm<LoginFormInputs>();

    const onSubmit: SubmitHandler<LoginFormInputs> = (
        data: LoginFormInputs
    ) => {
        const formData = new FormData();
        formData.set('email', data.email);
        formData.set('password', data.password);

        login(formData, {
            onError: () => {
                reset();
            },
        });
    };

    return (
        <form className="w-full space-y-4" onSubmit={handleSubmit(onSubmit)}>
            <Input
                {...register('email')}
                type={'email'}
                label={'Email'}
                disabled={isPending}
            />
            <Input
                {...register('password')}
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

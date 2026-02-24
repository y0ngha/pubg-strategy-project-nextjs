'use client';

import Input from '@/(presentation)/shared/components/input.component';
import Button from '@/(presentation)/shared/components/button.component';
import { useEmailRegisterMutation } from '@/(presentation)/auth/hooks/mutations/useEmailRegisterMutation';
import Checkbox from '@/(presentation)/shared/components/checkbox.component';
import { Route } from '@/(presentation)/shared/constants/route';
import { SubmitHandler, useForm } from 'react-hook-form';
import Link from 'next/link';

interface RegisterFormInputs {
    email: string;
    password: string;
    confirmPassword: string;
    terms: string;
}

function EmailRegister() {
    const { register: registerAction, isPending } = useEmailRegisterMutation();
    const { register, handleSubmit, resetField, watch } =
        useForm<RegisterFormInputs>();

    const confirmPassword = watch('confirmPassword');
    const password = watch('password');

    const isMatch = !confirmPassword || password === confirmPassword;

    const onSubmit: SubmitHandler<RegisterFormInputs> = (
        data: RegisterFormInputs
    ) => {
        const formData = new FormData();
        formData.set('email', data.email);
        formData.set('password', data.password);
        formData.set('confirmPassword', data.confirmPassword);
        formData.set('terms', data.terms);

        registerAction(formData, {
            onError: () => {
                resetField('password');
                resetField('confirmPassword');
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
            <Input
                {...register('confirmPassword')}
                type={'password'}
                label={'Confirm Password'}
                disabled={isPending}
                error={!isMatch ? '비밀번호가 일치하지 않습니다.' : undefined}
            />

            <Checkbox {...register('terms')} required>
                (필수) 서비스 이용약관에 동의합니다.{' '}
                <Link
                    className={'opacity-70 hover:opacity-100'}
                    href={Route.TERMS}
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

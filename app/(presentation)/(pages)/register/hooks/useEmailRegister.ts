import { useActionState, useEffect } from 'react';
import {
    RegisterWithEmailAction,
    registerWithEmailAction,
} from '@/(presentation)/user/actions/register-with-email.action';
import { toast } from 'react-toastify';
import { redirect } from 'next/navigation';

export function useEmailRegister() {
    const [state, formAction, isPending] = useActionState<
        RegisterWithEmailAction,
        FormData
    >(registerWithEmailAction, {
        isSuccess: false,
        isError: false,
        errorMessage: undefined,
        data: undefined,
        inputs: {
            email: '',
        },
    });

    const { isSuccess, isError, errorMessage, inputs } = state;

    useEffect(() => {
        if (isError) {
            toast.error(
                errorMessage ?? '알 수 없는 오류로 로그인에 실패했습니다.'
            );
        }
    }, [isError, errorMessage]);

    useEffect(() => {
        if (isSuccess) {
            toast.success('회원가입이 완료되었습니다.');
            redirect('/login');
        }
    }, [isSuccess]);

    return {
        formAction,
        isPending,
        inputs,
    };
}

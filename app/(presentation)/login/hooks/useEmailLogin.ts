import { loginWithEmailAction } from '@/(presentation)/user/actions/login-with-email.action';
import { useActionState, useEffect } from 'react';
import { toast } from 'react-toastify';

export function useEmailLogin() {
    const [state, formAction, isPending] = useActionState(
        loginWithEmailAction,
        {
            isSuccess: false,
            isError: false,
            errorMessage: undefined,
        }
    );

    const { isSuccess, isError, errorMessage } = state;

    useEffect(() => {
        if (isError) {
            toast.error(
                errorMessage ?? '알 수 없는 오류로 로그인에 실패했습니다.'
            );
        }
    }, [isError, errorMessage]);

    useEffect(() => {
        // TODO 구현 안됨.
    }, [isSuccess]);

    return {
        formAction,
        isPending,
    };
}

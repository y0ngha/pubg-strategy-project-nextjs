import {
    LoginWithEmailAction,
    loginWithEmailAction,
} from '@/(presentation)/user/actions/login-with-email.action';
import { useActionState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { getQueryClient } from '@/(presentation)/shared/helpers/query-client.helpers';
import { ReactQueryKeys } from '@/(presentation)/shared/constants/react-query-keys';
import { GetCurrentUserAction } from '@/(presentation)/user/actions/get-current-user.action';

export function useEmailLogin() {
    const queryClient = getQueryClient();

    const [state, formAction, isPending] = useActionState<
        LoginWithEmailAction,
        FormData
    >(loginWithEmailAction, {
        isSuccess: false,
        isError: false,
        errorMessage: undefined,
        data: undefined,
    });

    const { isSuccess, isError, errorMessage, data } = state;

    useEffect(() => {
        if (isError) {
            toast.error(
                errorMessage ?? '알 수 없는 오류로 로그인에 실패했습니다.'
            );
        }
    }, [isError, errorMessage]);

    useEffect(() => {
        if (isSuccess && data) {
            queryClient.setQueryData<GetCurrentUserAction>(
                [ReactQueryKeys.GET_CURRENT_USER],
                {
                    isSuccess: true,
                    isError: false,
                    errorMessage: undefined,
                    data: {
                        id: data.id,
                        email: data.email,
                    },
                }
            );
        }
    }, [data, isSuccess, queryClient]);

    return {
        formAction,
        isPending,
        isSuccess,
    };
}

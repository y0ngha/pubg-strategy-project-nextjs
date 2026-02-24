import { getQueryClient } from '@/(presentation)/shared/helpers/query-client.helpers';
import { useMutation } from '@tanstack/react-query';
import { loginWithEmailAction } from '@/(presentation)/auth/actions/login-with-email.action';
import { ReactQueryKeys } from '@/(presentation)/shared/constants/react-query-keys';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';

export function useEmailLoginMutation() {
    const queryClient = getQueryClient();
    const router = useRouter();

    const { isError, isPending, isSuccess, mutate } = useMutation({
        mutationFn: async (formData: FormData) =>
            await loginWithEmailAction(formData),
        onSuccess: async () => {
            await queryClient.invalidateQueries({
                queryKey: [ReactQueryKeys.GET_CURRENT_USER],
            });

            router.push('/');
        },
        onError: error => {
            console.error('useEmailLoginMutation', error);
            toast.error(
                error.message ?? '알 수 없는 오류로 로그인에 실패했습니다.'
            );
        },
    });

    return {
        login: mutate,
        isPending,
        isSuccess,
        isError,
    };
}

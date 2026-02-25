import { getQueryClient } from '@/(presentation)/shared/helpers/query-client.helpers';
import { useMutation } from '@tanstack/react-query';
import { logoutAction } from '@/(presentation)/auth/actions/logout.action';
import { toast } from 'react-toastify';
import { ReactQueryKeys } from '@/(presentation)/shared/constants/react-query-keys';
import { useRouter } from 'next/navigation';
import { Routes } from '@/(presentation)/shared/constants/routes';

export function useLogoutMutation() {
    const router = useRouter();
    const queryClient = getQueryClient();

    const { mutate } = useMutation({
        mutationFn: async () => {
            return await logoutAction();
        },
        onSuccess: () => {
            queryClient.clear();
            router.push(Routes.MAIN);
        },
        onError: error => {
            queryClient.invalidateQueries({
                queryKey: [ReactQueryKeys.GET_CURRENT_USER],
            });

            console.error('useLogoutMutation', error);
            toast.error(
                error.message ?? '알 수 없는 오류로 로그아웃에 실패했습니다.'
            );
        },
    });

    return {
        mutate,
    };
}

import { getQueryClient } from '@/(presentation)/shared/helpers/query-client.helpers';
import { useMutation } from '@tanstack/react-query';
import { logoutAction } from '@/(presentation)/user/actions/logout.action';
import { useGetCurrentUser } from '@/(presentation)/shared/hooks/useGetCurrentUser';
import { toast } from 'react-toastify';
import { ReactQueryKeys } from '@/(presentation)/shared/constants/react-query-keys';
import { useRouter } from 'next/navigation';
import { Route } from '@/(presentation)/shared/constants/route';

export function useLogoutMutation() {
    const router = useRouter();
    const { data: user } = useGetCurrentUser();
    const queryClient = getQueryClient();

    const { mutate } = useMutation({
        mutationFn: async () => {
            const formData = new FormData();
            formData.set('userId', user?.id ?? '');
            return await logoutAction(formData);
        },
        onSuccess: () => {
            queryClient.clear();
            router.push(Route.MAIN);
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

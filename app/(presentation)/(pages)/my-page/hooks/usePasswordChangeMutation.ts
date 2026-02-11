import { useMutation } from '@tanstack/react-query';
import { changePasswordAction } from '@/(presentation)/user/actions/change-password.action';
import { useGetCurrentUser } from '@/(presentation)/shared/hooks/useGetCurrentUser';
import { toast } from 'react-toastify';
import { getQueryClient } from '@/(presentation)/shared/helpers/query-client.helpers';
import { ReactQueryKeys } from '@/(presentation)/shared/constants/react-query-keys';
import { useLogoutMutation } from '@/(presentation)/shared/hooks/useLogoutMutation';

export function usePasswordChangeMutation() {
    const queryClient = getQueryClient();
    const { data: user } = useGetCurrentUser();
    const { mutate: logoutMutation } = useLogoutMutation();

    const { mutate, isPending } = useMutation({
        mutationFn: async (formData: FormData) => {
            formData.set('userId', user?.id ?? '');

            return await changePasswordAction(formData);
        },
        onSuccess: () => {
            toast.success('비밀번호가 수정되었습니다. 다시 로그인해주세요.');
            logoutMutation();
        },
        onError: error => {
            queryClient.invalidateQueries({
                queryKey: [ReactQueryKeys.GET_CURRENT_USER],
            });

            console.error('usePasswordChangeMutation', error);
            toast.error(
                error.message ??
                    '알 수 없는 오류로 비밀번호 수정에 실패했습니다.'
            );
        },
    });

    return { mutate, isPending };
}

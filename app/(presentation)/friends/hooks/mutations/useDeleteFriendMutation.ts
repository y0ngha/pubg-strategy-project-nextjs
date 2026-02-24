import { getQueryClient } from '@/(presentation)/shared/helpers/query-client.helpers';
import { useMutation } from '@tanstack/react-query';
import { ReactQueryKeys } from '@/(presentation)/shared/constants/react-query-keys';
import { toast } from 'react-toastify';
import { deleteFriendAction } from '@/(presentation)/friends/actions/delete-friend.action';
import { useGetCurrentUser } from '@/(presentation)/users/hooks/queries/useGetCurrentUser';

export function useDeleteFriendMutation() {
    const { data: user } = useGetCurrentUser();
    const queryClient = getQueryClient();

    const { mutate } = useMutation({
        mutationFn: async (formData: FormData) => {
            return await deleteFriendAction(formData);
        },
        onSuccess: () => {
            toast.success('친구를 삭제했습니다.');
        },
        onError: error => {
            console.error('useDeleteFriendMutation', error);
            toast.error(
                error.message ?? '알 수 없는 오류로 친구 삭제에 실패했습니다.'
            );
        },
        onSettled: () => {
            queryClient.invalidateQueries({
                queryKey: [user?.id, ReactQueryKeys.FRIENDS_ALL],
            });
        },
    });

    return {
        deleteFriend: mutate,
    };
}

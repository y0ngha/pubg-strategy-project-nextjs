import { getQueryClient } from '@/(presentation)/shared/helpers/query-client.helpers';
import { useMutation } from '@tanstack/react-query';
import { ReactQueryKeys } from '@/(presentation)/shared/constants/react-query-keys';
import { toast } from 'react-toastify';
import { requestFriendAction } from '@/(presentation)/friend/actions/request-friend.action';
import { useGetCurrentUser } from '@/(presentation)/shared/hooks/useGetCurrentUser';

export function useRequestFriendMutation() {
    const { data: user } = useGetCurrentUser();
    const queryClient = getQueryClient();

    const { mutate } = useMutation({
        mutationFn: async (formData: FormData) => {
            return await requestFriendAction(formData);
        },
        onSuccess: () => {
            toast.success('친구 요청을 보냈습니다.');
        },
        onError: error => {
            console.error('useRequestFriendMutation', error);
            toast.error(
                error.message ?? '알 수 없는 오류로 친구 요청에 실패했습니다.'
            );
        },
        onSettled: () => {
            queryClient.invalidateQueries({
                queryKey: [user?.id, ReactQueryKeys.FRIENDS_ALL],
            });
        },
    });

    return {
        requestFriend: mutate,
    };
}

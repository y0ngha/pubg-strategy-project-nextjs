import { getQueryClient } from '@/(presentation)/shared/helpers/query-client.helpers';
import { useMutation } from '@tanstack/react-query';
import { ReactQueryKeys } from '@/(presentation)/shared/constants/react-query-keys';
import { toast } from 'react-toastify';
import { cancelSentFriendRequestAction } from '@/(presentation)/friends/actions/cancel-sent-friend-request.action';
import { useGetCurrentUser } from '@/(presentation)/users/hooks/queries/useGetCurrentUser';

export function useCancelSentFriendRequestMutation() {
    const { data: user } = useGetCurrentUser();
    const queryClient = getQueryClient();

    const { mutate } = useMutation({
        mutationFn: async (formData: FormData) => {
            return await cancelSentFriendRequestAction(formData);
        },
        onSuccess: () => {
            toast.success('보낸 친구 요청을 취소했습니다.');
        },
        onError: error => {
            console.error('useCancelSentFriendRequestMutation', error);
            toast.error(
                error.message ??
                    '알 수 없는 오류로 보낸 친구 요청 취소에 실패했습니다.'
            );
        },
        onSettled: () => {
            queryClient.invalidateQueries({
                queryKey: [user?.id, ReactQueryKeys.FRIENDS_ALL],
            });
        },
    });

    return {
        cancelSentFriendRequest: mutate,
    };
}

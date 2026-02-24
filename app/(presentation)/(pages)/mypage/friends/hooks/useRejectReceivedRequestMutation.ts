import { getQueryClient } from '@/(presentation)/shared/helpers/query-client.helpers';
import { useMutation } from '@tanstack/react-query';
import { ReactQueryKeys } from '@/(presentation)/shared/constants/react-query-keys';
import { toast } from 'react-toastify';
import { rejectReceivedFriendRequestAction } from '@/(presentation)/friend/actions/reject-received-friend-request.action';
import { useGetCurrentUser } from '@/(presentation)/shared/hooks/useGetCurrentUser';

export function useRejectReceivedRequestMutation() {
    const { data: user } = useGetCurrentUser();
    const queryClient = getQueryClient();

    const { mutate } = useMutation({
        mutationFn: async (formData: FormData) => {
            return await rejectReceivedFriendRequestAction(formData);
        },
        onSuccess: () => {
            toast.success('받은 친구 요청을 거절했습니다.');
        },
        onError: error => {
            console.error('useRejectReceivedRequestMutation', error);
            toast.error(
                error.message ??
                    '알 수 없는 오류로 친구 요청 거절에 실패했습니다.'
            );
        },
        onSettled: () => {
            queryClient.invalidateQueries({
                queryKey: [user?.id, ReactQueryKeys.FRIENDS_ALL],
            });
        },
    });

    return {
        rejectReceivedFriendRequest: mutate,
    };
}

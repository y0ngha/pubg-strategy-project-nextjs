import { getQueryClient } from '@/(presentation)/shared/helpers/query-client.helpers';
import { useMutation } from '@tanstack/react-query';
import { acceptReceivedFriendRequestAction } from '@/(presentation)/friend/actions/accept-received-friend-request.action';
import { ReactQueryKeys } from '@/(presentation)/shared/constants/react-query-keys';
import { toast } from 'react-toastify';
import { useGetCurrentUser } from '@/(presentation)/shared/hooks/useGetCurrentUser';

export function useAcceptReceivedRequestMutation() {
    const { data: user } = useGetCurrentUser();
    const queryClient = getQueryClient();

    const { mutate } = useMutation({
        mutationFn: async (formData: FormData) => {
            return await acceptReceivedFriendRequestAction(formData);
        },
        onSuccess: () => {
            toast.success('받은 친구 요청을 수락했습니다.');
        },
        onError: error => {
            console.error('useAcceptReceivedRequestMutation', error);
            toast.error(
                error.message ?? '알 수 없는 오류로 친구 수락에 실패했습니다.'
            );
        },
        onSettled: () => {
            queryClient.invalidateQueries({
                queryKey: [user?.id, ReactQueryKeys.FRIENDS_ALL],
            });
        },
    });

    return {
        acceptReceivedFriendRequest: mutate,
    };
}

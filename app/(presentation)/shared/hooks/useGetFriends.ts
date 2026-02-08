import { useGetCurrentUser } from '@/(presentation)/shared/hooks/useGetCurrentUser';
import {
    useQuery,
    UseQueryOptions,
    UseQueryResult,
} from '@tanstack/react-query';
import { ReactQueryKeys } from '@/(presentation)/shared/constants/react-query-keys';
import {
    GetFriendListAction,
    getFriendListAction,
} from '@/(presentation)/friend/actions/get-friend-list.action';

export function useGetFriends(
    options?: Omit<
        UseQueryOptions<GetFriendListAction, Error>,
        'queryKey' | 'queryFn' | 'staleTime' | 'gcTime' | 'retry'
    >
): UseQueryResult<GetFriendListAction, Error> {
    const { data: user } = useGetCurrentUser();

    return useQuery({
        queryKey: [user?.id, ReactQueryKeys.FRIENDS],
        queryFn: async () => {
            if (user?.id === undefined) {
                return Promise.reject(
                    new Error('유저 고유 식별자를 불러오지 못했습니다.')
                );
            }

            return await getFriendListAction(user.id);
        },
        enabled: user?.id !== undefined,
        staleTime: 1000 * 60 * 60,
        gcTime: 1000 * 60 * 60 * 24,
        retry: false,
        ...options,
    });
}

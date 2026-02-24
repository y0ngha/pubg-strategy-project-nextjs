import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { ReactQueryKeys } from '@/(presentation)/shared/constants/react-query-keys';
import {
    GetFriendListAction,
    getFriendListAction,
} from '@/(presentation)/friend/actions/get-friend-list.action';
import { useGetCurrentUser } from '@/(presentation)/shared/hooks/useGetCurrentUser';

export function useGetFriends(
    options?: Omit<
        UseQueryOptions<GetFriendListAction, Error>,
        'queryKey' | 'queryFn' | 'staleTime' | 'gcTime' | 'retry' | 'enabled'
    >
) {
    const { data: user } = useGetCurrentUser();

    return useQuery({
        queryKey: [user?.id, ReactQueryKeys.FRIENDS_ALL],
        queryFn: async () => {
            return await getFriendListAction();
        },
        enabled: !!user?.id,
        staleTime: 1000 * 60 * 60,
        gcTime: 1000 * 60 * 60 * 24,
        retry: false,
        ...options,
    });
}

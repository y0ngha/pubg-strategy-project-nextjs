import {
    useInfiniteQuery,
    UseInfiniteQueryOptions,
    UseInfiniteQueryResult,
} from '@tanstack/react-query';
import { ReactQueryKeys } from '@/(presentation)/shared/constants/react-query-keys';
import { useGetCurrentUser } from '@/(presentation)/shared/hooks/useGetCurrentUser';
import {
    GetOwnedStrategiesAction,
    getOwnedStrategiesAction,
} from '@/(presentation)/strategy/actions/get-owned-strategies.action';

export function useGetOwnedStrategies(
    limit?: number,
    options?: Omit<
        UseInfiniteQueryOptions<GetOwnedStrategiesAction, Error>,
        | 'queryKey'
        | 'queryFn'
        | 'enabled'
        | 'staleTime'
        | 'gcTime'
        | 'retry'
        | 'getNextPageParam'
        | 'initialPageParam'
    >
): UseInfiniteQueryResult<GetOwnedStrategiesAction, Error> {
    const user = useGetCurrentUser();

    return useInfiniteQuery({
        queryKey: [user.data?.id, ReactQueryKeys.STRATIGES],
        queryFn: async ({ pageParam }) => {
            if (user.data?.id === undefined) {
                return Promise.reject(
                    '유저 고유 식별자를 불러오지 못했습니다.'
                );
            }
            return await getOwnedStrategiesAction(
                user.data?.id,
                pageParam as number,
                limit ?? 15
            );
        },
        enabled: user.data?.id !== undefined,
        staleTime: 1000 * 60 * 60,
        gcTime: 1000 * 60 * 60 * 24,
        retry: false,
        getNextPageParam: lastPage => {
            // TODO 아직 구현 안됨 -> 서버에서 어떻게 주는지 확인 필요
            return undefined;
        },
        initialPageParam: 1,
        ...options,
    });
}

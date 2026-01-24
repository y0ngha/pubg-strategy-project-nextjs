import {
    useInfiniteQuery,
    UseInfiniteQueryOptions,
    UseInfiniteQueryResult,
} from '@tanstack/react-query';
import { ReactQueryKeys } from '@/(presentation)/shared/constants/react-query-keys';
import {
    GetOwnedStrategiesAction,
    getOwnedStrategiesAction,
} from '@/(presentation)/strategy/actions/get-owned-strategies.action';
import { InfiniteData } from '@tanstack/query-core';

export function useGetOwnedStrategies(
    limit?: number,
    options?: Omit<
        UseInfiniteQueryOptions<
            GetOwnedStrategiesAction,
            Error,
            InfiniteData<GetOwnedStrategiesAction>
        >,
        | 'queryKey'
        | 'queryFn'
        | 'enabled'
        | 'staleTime'
        | 'gcTime'
        | 'retry'
        | 'getNextPageParam'
        | 'initialPageParam'
    >
): UseInfiniteQueryResult<InfiniteData<GetOwnedStrategiesAction>, Error> {
    // const { data: user } = useGetCurrentUser();
    const user = {
        id: 'bf89ed6c-bed6-4898-9421-1d33acccaf04',
    };

    return useInfiniteQuery({
        queryKey: [user?.id, ReactQueryKeys.STRATIGES],
        queryFn: async ({ pageParam }) => {
            if (user?.id === undefined) {
                return Promise.reject(
                    '유저 고유 식별자를 불러오지 못했습니다.'
                );
            }
            return await getOwnedStrategiesAction(
                user?.id,
                pageParam as number,
                limit ?? 15
            );
        },
        enabled: user?.id !== undefined,
        staleTime: 1000 * 60 * 60,
        gcTime: 1000 * 60 * 60 * 24,
        retry: false,
        getNextPageParam: lastPage => {
            return lastPage.hasNextPage ? lastPage.nextPage : undefined;
        },
        initialPageParam: 1,
        ...options,
    });
}

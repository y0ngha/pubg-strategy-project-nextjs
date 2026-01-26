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
import { InfiniteData, type QueryKey } from '@tanstack/query-core';
import { useGetCurrentUser } from '@/(presentation)/shared/hooks/useGetCurrentUser';

export function useGetOwnedStrategies(
    limit?: number,
    options?: Omit<
        UseInfiniteQueryOptions<
            GetOwnedStrategiesAction,
            Error,
            InfiniteData<GetOwnedStrategiesAction>,
            QueryKey,
            number
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
    const { data: user } = useGetCurrentUser();

    return useInfiniteQuery<
        GetOwnedStrategiesAction,
        Error,
        InfiniteData<GetOwnedStrategiesAction>,
        QueryKey,
        number
    >({
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
        getNextPageParam: (lastPage, _, lastPageParam) => {
            return lastPage.hasNextPage ? lastPageParam + 1 : undefined;
        },
        initialPageParam: 1,
        ...options,
    });
}

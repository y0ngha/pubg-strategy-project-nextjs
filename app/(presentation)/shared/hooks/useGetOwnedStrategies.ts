import {
    useInfiniteQuery,
    UseInfiniteQueryOptions,
    UseInfiniteQueryResult,
} from '@tanstack/react-query';
import { ReactQueryKeys } from '@/(presentation)/shared/constants/react-query-keys';
import {
    GetOwnedStrategiesAction,
    getOwnedStrategiesAction,
} from '@/(presentation)/strategy/actions/strategy/get-owned-strategies.action';
import { InfiniteData, type QueryKey } from '@tanstack/query-core';

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
    return useInfiniteQuery<
        GetOwnedStrategiesAction,
        Error,
        InfiniteData<GetOwnedStrategiesAction>,
        QueryKey,
        number
    >({
        queryKey: [ReactQueryKeys.STRATIGES_ALL],
        queryFn: async ({ pageParam }) => {
            return await getOwnedStrategiesAction(
                pageParam as number,
                limit ?? 15
            );
        },
        enabled: true,
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

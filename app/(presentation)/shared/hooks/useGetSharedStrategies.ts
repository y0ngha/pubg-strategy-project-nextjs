import {
    useInfiniteQuery,
    UseInfiniteQueryOptions,
    UseInfiniteQueryResult,
} from '@tanstack/react-query';
import { ReactQueryKeys } from '@/(presentation)/shared/constants/react-query-keys';
import {
    getSharedStrategiesAction,
    GetSharedStrategiesAction,
} from '@/(presentation)/strategy/actions/strategy/get-shared-strategies.action';
import { InfiniteData, type QueryKey } from '@tanstack/query-core';

export function useGetSharedStrategies(
    limit?: number,
    options?: Omit<
        UseInfiniteQueryOptions<
            GetSharedStrategiesAction,
            Error,
            InfiniteData<GetSharedStrategiesAction>,
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
): UseInfiniteQueryResult<InfiniteData<GetSharedStrategiesAction>, Error> {
    return useInfiniteQuery<
        GetSharedStrategiesAction,
        Error,
        InfiniteData<GetSharedStrategiesAction>,
        QueryKey,
        number
    >({
        queryKey: [ReactQueryKeys.SHARED_STRATIGES, 'ALL'],
        queryFn: async ({ pageParam }) => {
            return await getSharedStrategiesAction(
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

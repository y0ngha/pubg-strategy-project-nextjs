import {
    useInfiniteQuery,
    UseInfiniteQueryOptions,
    UseInfiniteQueryResult,
} from '@tanstack/react-query';
import { ReactQueryKeys } from '@/(presentation)/shared/constants/react-query-keys';
import { useGetCurrentUser } from '@/(presentation)/shared/hooks/useGetCurrentUser';
import {
    getSharedStrategiesAction,
    GetSharedStrategiesAction,
} from '@/(presentation)/strategy/actions/get-shared-strategies.action';
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
    const user = useGetCurrentUser();

    return useInfiniteQuery<
        GetSharedStrategiesAction,
        Error,
        InfiniteData<GetSharedStrategiesAction>,
        QueryKey,
        number
    >({
        queryKey: [user.data?.id, ReactQueryKeys.SHARED_STRATIGES],
        queryFn: async ({ pageParam }) => {
            if (user.data?.id === undefined) {
                return Promise.reject(
                    '유저 고유 식별자를 불러오지 못했습니다.'
                );
            }
            return await getSharedStrategiesAction(
                user.data?.id,
                pageParam as number,
                limit ?? 15
            );
        },
        enabled: user.data?.id !== undefined,
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

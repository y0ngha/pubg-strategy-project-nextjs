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
import { InfiniteData } from '@tanstack/query-core';

export function useGetSharedStrategies(
    limit?: number,
    options?: Omit<
        UseInfiniteQueryOptions<
            GetSharedStrategiesAction,
            Error,
            InfiniteData<GetSharedStrategiesAction>
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

    return useInfiniteQuery({
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
        getNextPageParam: lastPage => {
            // TODO 아직 구현 안됨 -> 서버에서 어떻게 주는지 확인 필요
            return undefined;
        },
        initialPageParam: 1,
        ...options,
    });
}

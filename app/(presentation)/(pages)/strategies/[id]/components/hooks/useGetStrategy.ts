import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { ReactQueryKeys } from '@/(presentation)/shared/constants/react-query-keys';
import {
    GetStrategyAction,
    getStrategyAction,
} from '@/(presentation)/strategy/actions/get-strategy.action';
import { useGetCurrentUser } from '@/(presentation)/shared/hooks/useGetCurrentUser';

export function useGetStrategy(
    strategyId: string,
    options?: Omit<
        UseQueryOptions<GetStrategyAction, Error>,
        'queryKey' | 'queryFn' | 'staleTime' | 'gcTime' | 'retry' | 'enabled'
    >
) {
    const user = useGetCurrentUser();

    return useQuery({
        queryKey: [ReactQueryKeys.STRATIGES, strategyId],
        queryFn: async () => {
            if (user.data?.id === undefined) {
                return Promise.reject(
                    new Error('유저 고유 식별자를 불러오지 못했습니다.')
                );
            }

            return await getStrategyAction(user.data.id, strategyId);
        },
        enabled: user.data?.id !== undefined && !!strategyId,
        staleTime: 1000 * 60 * 60,
        gcTime: 1000 * 60 * 60 * 24,
        retry: false,
        ...options,
    });
}

import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { ReactQueryKeys } from '@/(presentation)/shared/constants/react-query-keys';
import {
    GetStrategyAction,
    getStrategyAction,
} from '@/(presentation)/strategy/actions/strategy/get-strategy.action';

export function useGetStrategy(
    strategyId: string,
    options?: Omit<
        UseQueryOptions<GetStrategyAction, Error>,
        'queryKey' | 'queryFn' | 'staleTime' | 'gcTime' | 'retry' | 'enabled'
    >
) {
    return useQuery({
        queryKey: [ReactQueryKeys.STRATIGIES, strategyId],
        queryFn: async () => {
            return await getStrategyAction(strategyId);
        },
        enabled: !!strategyId,
        staleTime: 1000 * 60 * 60,
        gcTime: 1000 * 60 * 60 * 24,
        retry: false,
        ...options,
    });
}

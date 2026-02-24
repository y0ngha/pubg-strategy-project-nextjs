import { getQueryClient } from '@/(presentation)/shared/helpers/query-client.helpers';
import { useMutation } from '@tanstack/react-query';
import { ReactQueryKeys } from '@/(presentation)/shared/constants/react-query-keys';
import { GetStrategyAction } from '@/(presentation)/strategies/actions/strategy/get-strategy.action';
import { toast } from 'react-toastify';
import { QueryKey } from '@tanstack/query-core';
import {
    UpdateAirplanePathAction,
    updateAirplanePathAction,
} from '@/(presentation)/strategies/actions/airplane-path/update-airplane-path.action';
import { useGetCurrentUser } from '@/(presentation)/users/hooks/queries/useGetCurrentUser';

export function useUpdateAirplanePathMutation(strategyId: string) {
    const { data: user } = useGetCurrentUser();
    const queryClient = getQueryClient();

    const strategyQueryKey: QueryKey = [ReactQueryKeys.STRATIGIES, strategyId];
    const strategiesQueryKey: QueryKey = [
        user?.id,
        ReactQueryKeys.STRATEGIES_ALL,
    ];

    const { mutate } = useMutation({
        mutationFn: async (formData: FormData) => {
            formData.set('strategyId', strategyId);

            return await updateAirplanePathAction(formData);
        },
        onSuccess: data => {
            cacheUpdate(strategyQueryKey, data);

            queryClient.invalidateQueries({
                queryKey: strategiesQueryKey,
            });
        },
        onError: error => {
            queryClient.invalidateQueries({
                queryKey: strategyQueryKey,
            });

            console.error('useUpdateAirplanePathMutation', error);
            toast.error(
                error.message ??
                    '알 수 없는 오류로 비행기 동선 수정에 실패했습니다.'
            );
        },
    });

    const cacheUpdate = (
        queryKey: QueryKey,
        data: UpdateAirplanePathAction
    ) => {
        queryClient.setQueryData<GetStrategyAction>(queryKey, oldStrategy => {
            if (!oldStrategy) {
                return undefined;
            }

            if (!oldStrategy.airplanePath) {
                return oldStrategy;
            }

            return {
                ...oldStrategy,
                airplanePath: {
                    id: oldStrategy.airplanePath.id,
                    startPosition: data.startPosition,
                    endPosition: data.endPosition,
                },
            };
        });
    };

    return {
        updateAirplanePath: mutate,
    };
}

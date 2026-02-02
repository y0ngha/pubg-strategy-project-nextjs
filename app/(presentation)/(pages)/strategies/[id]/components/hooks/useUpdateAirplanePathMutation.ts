import { getQueryClient } from '@/(presentation)/shared/helpers/query-client.helpers';
import { useMutation } from '@tanstack/react-query';
import { useGetCurrentUser } from '@/(presentation)/shared/hooks/useGetCurrentUser';
import { ReactQueryKeys } from '@/(presentation)/shared/constants/react-query-keys';
import { GetStrategyAction } from '@/(presentation)/strategy/actions/get-strategy.action';
import { toast } from 'react-toastify';
import { QueryKey } from '@tanstack/query-core';
import {
    UpdateAirplanePathAction,
    updateAirplanePathAction,
} from '@/(presentation)/strategy/actions/airplane-path/update-airplane-path.action';
import { parseFormData } from '@/(presentation)/shared/helpers/form-data.helper';

export function useUpdateAirplanePathMutation(strategyId: string) {
    const queryClient = getQueryClient();
    const user = useGetCurrentUser();

    const strategyQueryKey: QueryKey = [ReactQueryKeys.STRATIGES, strategyId];
    const strategiesQueryKey: QueryKey = [
        user.data?.id,
        ReactQueryKeys.STRATIGES,
    ];

    const { mutate } = useMutation({
        mutationFn: async (formData: FormData) => {
            formData.set('userId', user.data?.id ?? '');
            formData.set('strategyId', strategyId);

            return await updateAirplanePathAction(formData);
        },
        onMutate: async (formData: FormData) => {
            await queryClient.cancelQueries({
                queryKey: strategyQueryKey,
            });

            const previousStrategy =
                queryClient.getQueryData<GetStrategyAction>(strategyQueryKey);

            const { startPosition, endPosition } = parseFormData(formData, [
                {
                    key: 'startPosition',
                    type: 'position',
                    allowUndefined: true,
                },
                {
                    key: 'endPosition',
                    type: 'position',
                    allowUndefined: true,
                },
            ] as const);

            if (startPosition && endPosition) {
                optimisticUpdate(strategyQueryKey, {
                    startPosition,
                    endPosition,
                });
            }

            return { previousStrategy };
        },
        onError: (error, variables, context) => {
            if (context?.previousStrategy) {
                queryClient.setQueryData(
                    strategyQueryKey,
                    context.previousStrategy
                );
            }

            console.error('useUpdateAirplanePathMutation', error, variables);
            toast.error(
                error.message ??
                    '알 수 없는 오류로 비행기 동선 수정에 실패했습니다.'
            );
        },
        onSettled: () => {
            queryClient.invalidateQueries({
                queryKey: strategiesQueryKey,
            });
            queryClient.invalidateQueries({
                queryKey: strategyQueryKey,
            });
        },
    });

    const optimisticUpdate = (
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

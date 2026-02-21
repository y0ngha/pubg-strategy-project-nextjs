import { getQueryClient } from '@/(presentation)/shared/helpers/query-client.helpers';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { ReactQueryKeys } from '@/(presentation)/shared/constants/react-query-keys';
import { GetStrategyAction } from '@/(presentation)/strategy/actions/strategy/get-strategy.action';
import {
    updateCirclePositionAction,
    UpdateCirclePositionAction,
} from '@/(presentation)/strategy/actions/circle/update-circle-position.action';
import { QueryKey } from '@tanstack/query-core';

export function useUpdateCirclePositionMutation(strategyId: string) {
    const queryClient = getQueryClient();

    const strategyQueryKey: QueryKey = [ReactQueryKeys.STRATIGES, strategyId];
    const strategiesQueryKey: QueryKey = [ReactQueryKeys.STRATIGES_ALL];

    const { mutate } = useMutation({
        mutationFn: async (formData: FormData) => {
            formData.set('strategyId', strategyId);

            return await updateCirclePositionAction(formData);
        },
        onSuccess: data => {
            cacheUpdate([ReactQueryKeys.STRATIGES, strategyId], data);

            queryClient.invalidateQueries({
                queryKey: strategiesQueryKey,
            });
        },
        onError: error => {
            queryClient.invalidateQueries({
                queryKey: strategyQueryKey,
            });

            console.error('useUpdateCirclePositionMutation', error);
            toast.error(
                error.message ?? '알 수 없는 오류로 자기장 수정에 실패했습니다.'
            );
        },
    });

    const cacheUpdate = (
        queryKey: QueryKey,
        data: UpdateCirclePositionAction
    ) => {
        queryClient.setQueryData<GetStrategyAction>(queryKey, oldStrategy => {
            if (!oldStrategy) {
                return undefined;
            }

            return {
                ...oldStrategy,
                circles: oldStrategy.circles.map(circle => {
                    if (circle.id === data.id) {
                        return {
                            ...circle,
                            id: data.id,
                            centerPosition: data.centerPosition,
                        };
                    }

                    return circle;
                }),
            };
        });
    };

    return {
        updateCirclePosition: mutate,
    };
}

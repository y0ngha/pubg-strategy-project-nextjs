import { getQueryClient } from '@/(presentation)/shared/helpers/query-client.helpers';
import { useMutation } from '@tanstack/react-query';
import { useGetCurrentUser } from '@/(presentation)/shared/hooks/useGetCurrentUser';
import { toast } from 'react-toastify';
import { ReactQueryKeys } from '@/(presentation)/shared/constants/react-query-keys';
import { GetStrategyAction } from '@/(presentation)/strategy/actions/get-strategy.action';
import {
    UpdateCircleAction,
    updateCircleAction,
} from '@/(presentation)/strategy/actions/circle/update-circle.action';
import { QueryKey } from '@tanstack/query-core';

export function useUpdateCircleMutation(strategyId: string) {
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

            return await updateCircleAction(formData);
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

            console.error('useUpdateCircleMutation', error);
            toast.error(
                error.message ?? '알 수 없는 오류로 자기장 수정에 실패했습니다.'
            );
        },
    });

    const cacheUpdate = (queryKey: QueryKey, data: UpdateCircleAction) => {
        queryClient.setQueryData<GetStrategyAction>(queryKey, oldStrategy => {
            if (!oldStrategy) {
                return undefined;
            }

            return {
                ...oldStrategy,
                circles: oldStrategy.circles.map(circle => {
                    if (circle.id === data.id) {
                        return {
                            id: data.id,
                            centerPosition: data.centerPosition,
                            phase: data.phase,
                            radius: data.radius,
                            color: data.color,
                        };
                    }

                    return circle;
                }),
            };
        });
    };

    return {
        updateCircle: mutate,
    };
}

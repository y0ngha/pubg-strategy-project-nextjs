import { getQueryClient } from '@/(presentation)/shared/helpers/query-client.helpers';
import { useMutation } from '@tanstack/react-query';

import { toast } from 'react-toastify';
import { ReactQueryKeys } from '@/(presentation)/shared/constants/react-query-keys';
import { GetStrategyAction } from '@/(presentation)/strategies/actions/strategy/get-strategy.action';
import {
    CreateCircleAction,
    createCircleAction,
} from '@/(presentation)/strategies/actions/circle/create-circle.action';
import { QueryKey } from '@tanstack/query-core';
import { useGetCurrentUser } from '@/(presentation)/users/hooks/queries/useGetCurrentUser';

export function useCreateCircleMutation(strategyId: string) {
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

            return await createCircleAction(formData);
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

            console.error('useCreateCircleMutation', error);
            toast.error(
                error.message ?? '알 수 없는 오류로 자기장 생성에 실패했습니다.'
            );
        },
    });

    const cacheUpdate = (queryKey: QueryKey, data: CreateCircleAction) => {
        queryClient.setQueryData<GetStrategyAction>(queryKey, oldStrategy => {
            if (!oldStrategy) {
                return undefined;
            }

            return {
                ...oldStrategy,
                circles: [
                    ...oldStrategy.circles,
                    {
                        id: data.id,
                        centerPosition: data.centerPosition,
                        phase: data.phase,
                        radius: data.radius,
                        color: data.color,
                    },
                ],
            };
        });
    };

    return {
        createCircle: mutate,
    };
}

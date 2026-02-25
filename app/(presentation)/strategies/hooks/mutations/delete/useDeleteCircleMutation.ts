import { getQueryClient } from '@/(presentation)/shared/helpers/query-client.helpers';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { ReactQueryKeys } from '@/(presentation)/shared/constants/react-query-keys';
import { GetStrategyAction } from '@/(presentation)/strategies/actions/strategy/get-strategy.action';
import { QueryKey } from '@tanstack/query-core';
import { parseFormData } from '@/(presentation)/shared/helpers/form-data.helper';
import { deleteCircleAction } from '@/(presentation)/strategies/actions/circle/delete-circle.action';
import { useGetCurrentUser } from '@/(presentation)/users/hooks/queries/useGetCurrentUser';

export function useDeleteCircleMutation(strategyId: string) {
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

            return await deleteCircleAction(formData);
        },
        onMutate: variables => {
            const previousStrategy =
                queryClient.getQueryData<GetStrategyAction>(strategyQueryKey);

            const { circleId } = parseFormData(variables, [
                {
                    key: 'circleId',
                    type: 'string',
                    error: '삭제한 자기장의 고유 식별자를 불러오지 못했습니다.',
                },
            ] as const);

            optimisticUpdate(strategyQueryKey, circleId);

            return { previousStrategy };
        },
        onError: (error, _, onMutateResult) => {
            if (onMutateResult?.previousStrategy) {
                queryClient.setQueryData(
                    strategyQueryKey,
                    onMutateResult.previousStrategy
                );
            }

            console.error('useDeleteCircleMutation', error);
            toast.error(
                error.message ?? '알 수 없는 오류로 자기장 삭제에 실패했습니다.'
            );
        },
        onSettled: () => {
            queryClient.invalidateQueries({
                queryKey: strategyQueryKey,
            });

            queryClient.invalidateQueries({
                queryKey: strategiesQueryKey,
            });
        },
    });

    const optimisticUpdate = (queryKey: QueryKey, circleId: string) => {
        queryClient.setQueryData<GetStrategyAction>(queryKey, oldStrategy => {
            if (!oldStrategy) {
                return undefined;
            }

            return {
                ...oldStrategy,
                circles: oldStrategy.circles.filter(
                    circle => circle.id !== circleId
                ),
            };
        });
    };

    return {
        deleteCircle: mutate,
    };
}

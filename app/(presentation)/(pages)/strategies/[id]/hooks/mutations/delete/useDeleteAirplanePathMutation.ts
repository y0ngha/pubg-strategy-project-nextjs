import { getQueryClient } from '@/(presentation)/shared/helpers/query-client.helpers';
import { useMutation } from '@tanstack/react-query';
import { useGetCurrentUser } from '@/(presentation)/shared/hooks/useGetCurrentUser';
import { ReactQueryKeys } from '@/(presentation)/shared/constants/react-query-keys';
import { GetStrategyAction } from '@/(presentation)/strategy/actions/get-strategy.action';
import { toast } from 'react-toastify';
import { QueryKey } from '@tanstack/query-core';
import { deleteAirplanePathAction } from '@/(presentation)/strategy/actions/airplane-path/delete-airplane-path.action';

export function useDeleteAirplanePathMutation(strategyId: string) {
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

            return await deleteAirplanePathAction(formData);
        },
        onMutate: () => {
            const previousStrategy =
                queryClient.getQueryData<GetStrategyAction>(strategyQueryKey);

            optimisticUpdate(strategyQueryKey);

            return { previousStrategy };
        },
        onError: (error, _, onMutateResult) => {
            if (onMutateResult?.previousStrategy) {
                queryClient.setQueryData(
                    strategyQueryKey,
                    onMutateResult.previousStrategy
                );
            }

            console.error('useDeleteAirplanePathMutation', error);
            toast.error(
                error.message ??
                    '알 수 없는 오류로 비행기 동선 삭제에 실패했습니다.'
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

    const optimisticUpdate = (queryKey: QueryKey) => {
        queryClient.setQueryData<GetStrategyAction>(queryKey, oldStrategy => {
            if (!oldStrategy) {
                return undefined;
            }

            return {
                ...oldStrategy,
                airplanePath: undefined,
            };
        });
    };

    return {
        deleteAirplanePath: mutate,
    };
}

import { useMutation } from '@tanstack/react-query';
import { getQueryClient } from '@/(presentation)/shared/helpers/query-client.helpers';
import { useGetCurrentUser } from '@/(presentation)/shared/hooks/useGetCurrentUser';
import { ReactQueryKeys } from '@/(presentation)/shared/constants/react-query-keys';
import { toast } from 'react-toastify';
import {
    UpdateStrategyAction,
    updateStrategyAction,
} from '@/(presentation)/strategy/actions/update-strategy.action';
import { GetStrategyAction } from '@/(presentation)/strategy/actions/get-strategy.action';
import { QueryKey } from '@tanstack/query-core';

export function useUpdateStrategyMutation(strategyId: string) {
    const queryClient = getQueryClient();
    const user = useGetCurrentUser();

    const strategyQueryKey: QueryKey = [ReactQueryKeys.STRATIGES, strategyId];
    const strategiesQueryKey: QueryKey = [
        user.data?.id,
        ReactQueryKeys.STRATIGES,
    ];

    const {
        mutate: updateStrategy,
        data,
        isError,
        isPending,
        isSuccess,
    } = useMutation({
        mutationFn: async (formData: FormData) => {
            formData.set('userId', user.data?.id ?? '');
            formData.set('strategyId', strategyId);

            return await updateStrategyAction(formData);
        },
        onSuccess: data => {
            optimisticUpdate([ReactQueryKeys.STRATIGES, strategyId], data);

            queryClient.invalidateQueries({
                queryKey: strategiesQueryKey,
            });

            toast.success('전략이 수정되었습니다.');
        },
        onError: error => {
            queryClient.invalidateQueries({
                queryKey: strategyQueryKey,
            });

            console.error('useUpdateStrategyMutation', error);
            toast.error(
                error.message ?? '알 수 없는 오류로 전략 수정에 실패했습니다.'
            );
        },
    });

    const optimisticUpdate = (
        queryKey: QueryKey,
        data: UpdateStrategyAction
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
                title: data.title,
                map: data.map,
            };
        });
    };

    return {
        updateStrategy,
        data,
        isError,
        isPending,
        isSuccess,
    };
}

import { useMutation } from '@tanstack/react-query';
import { getQueryClient } from '@/(presentation)/shared/helpers/query-client.helpers';
import { useGetCurrentUser } from '@/(presentation)/shared/hooks/useGetCurrentUser';
import { ReactQueryKeys } from '@/(presentation)/shared/constants/react-query-keys';
import { toast } from 'react-toastify';
import {
    UpdateStrategyTitleAction,
    updateStrategyTitleAction,
} from '@/(presentation)/strategy/actions/strategy/update-strategy-title.action';
import { GetStrategyAction } from '@/(presentation)/strategy/actions/strategy/get-strategy.action';
import { QueryKey } from '@tanstack/query-core';

export function useUpdateStrategyTitleMutation(strategyId: string) {
    const queryClient = getQueryClient();
    const user = useGetCurrentUser();

    const strategyQueryKey: QueryKey = [ReactQueryKeys.STRATIGES, strategyId];
    const strategiesQueryKey: QueryKey = [ReactQueryKeys.STRATIGES, 'ALL'];

    const {
        mutate: updateStrategyTitle,
        data,
        isError,
        isPending,
        isSuccess,
    } = useMutation({
        mutationFn: async (formData: FormData) => {
            formData.set('userId', user.data?.id ?? '');
            formData.set('strategyId', strategyId);

            return await updateStrategyTitleAction(formData);
        },
        onSuccess: data => {
            cacheUpdate([ReactQueryKeys.STRATIGES, strategyId], data);

            queryClient.invalidateQueries({
                queryKey: strategiesQueryKey,
            });

            toast.success('전략이 수정되었습니다.');
        },
        onError: error => {
            queryClient.invalidateQueries({
                queryKey: strategyQueryKey,
            });

            console.error('useUpdateStrategyTitleMutation', error);
            toast.error(
                error.message ?? '알 수 없는 오류로 전략 수정에 실패했습니다.'
            );
        },
    });

    const cacheUpdate = (
        queryKey: QueryKey,
        data: UpdateStrategyTitleAction
    ) => {
        queryClient.setQueryData<GetStrategyAction>(queryKey, oldStrategy => {
            if (!oldStrategy) {
                return undefined;
            }

            return {
                ...oldStrategy,
                title: data.title,
            };
        });
    };

    return {
        updateStrategyTitle,
        data,
        isError,
        isPending,
        isSuccess,
    };
}

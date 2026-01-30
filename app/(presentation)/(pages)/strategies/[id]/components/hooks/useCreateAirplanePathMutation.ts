import { getQueryClient } from '@/(presentation)/shared/helpers/query-client.helpers';
import { useMutation } from '@tanstack/react-query';
import { useGetCurrentUser } from '@/(presentation)/shared/hooks/useGetCurrentUser';
import {
    AddAirplanePathAction,
    addAirplanePathAction,
} from '@/(presentation)/strategy/actions/airplane-path/add-airplane-path.action';
import { ReactQueryKeys } from '@/(presentation)/shared/constants/react-query-keys';
import { GetStrategyAction } from '@/(presentation)/strategy/actions/get-strategy.action';
import { toast } from 'react-toastify';
import { QueryKey } from '@tanstack/query-core';

export function useCreateAirplanePathMutation(strategyId: string) {
    const queryClient = getQueryClient();
    const user = useGetCurrentUser();

    const { mutate } = useMutation({
        mutationFn: async (formData: FormData) => {
            formData.set('userId', user.data?.id ?? '');
            formData.set('strategyId', strategyId);

            return await addAirplanePathAction(formData);
        },
        onSuccess: data => {
            const strataegyQueryKey = [ReactQueryKeys.STRATIGES, strategyId];

            optimisticUpdate(strataegyQueryKey, data);

            queryClient.invalidateQueries({
                queryKey: [user.data?.id, ReactQueryKeys.STRATIGES],
            });
        },
        onError: error => {
            console.error('useCreateAirplanePathMutation', error);
            toast.error(
                error.message ??
                    '알 수 없는 오류로 비행기 동선 생성에 실패했습니다.'
            );
        },
    });

    const optimisticUpdate = (
        queryKey: QueryKey,
        data: AddAirplanePathAction
    ) => {
        queryClient.setQueryData<GetStrategyAction>(queryKey, oldStrategy => {
            if (!oldStrategy) {
                return undefined;
            }

            return {
                ...oldStrategy,
                airplanePath: {
                    id: data.id,
                    startPosition: data.startPosition,
                    endPosition: data.endPosition,
                },
            };
        });
    };

    return {
        createAirplanePath: mutate,
    };
}

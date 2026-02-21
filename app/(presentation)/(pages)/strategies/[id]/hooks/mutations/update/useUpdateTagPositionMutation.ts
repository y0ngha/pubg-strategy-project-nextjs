import { getQueryClient } from '@/(presentation)/shared/helpers/query-client.helpers';
import { useMutation } from '@tanstack/react-query';
import { ReactQueryKeys } from '@/(presentation)/shared/constants/react-query-keys';
import { GetStrategyAction } from '@/(presentation)/strategy/actions/strategy/get-strategy.action';
import { toast } from 'react-toastify';
import { QueryKey } from '@tanstack/query-core';
import {
    UpdateTagPositionAction,
    updateTagPositionAction,
} from '@/(presentation)/strategy/actions/tag/update-tag-position.action';

export function useUpdateTagPositionMutation(strategyId: string) {
    const queryClient = getQueryClient();

    const strategyQueryKey: QueryKey = [ReactQueryKeys.STRATIGIES, strategyId];
    const strategiesQueryKey: QueryKey = [ReactQueryKeys.STRATEGIES_ALL];

    const { mutate } = useMutation({
        mutationFn: async (formData: FormData) => {
            formData.set('strategyId', strategyId);

            return await updateTagPositionAction(formData);
        },
        onSuccess: data => {
            cacheUpdate([ReactQueryKeys.STRATIGIES, strategyId], data);

            queryClient.invalidateQueries({
                queryKey: strategiesQueryKey,
            });
        },
        onError: error => {
            queryClient.invalidateQueries({
                queryKey: strategyQueryKey,
            });

            console.error('useUpdateTagPositionMutation', error);
            toast.error(
                error.message ?? '알 수 없는 오류로 태그 수정에 실패했습니다.'
            );
        },
    });

    const cacheUpdate = (queryKey: QueryKey, data: UpdateTagPositionAction) => {
        queryClient.setQueryData<GetStrategyAction>(queryKey, oldStrategy => {
            if (!oldStrategy) {
                return undefined;
            }

            return {
                ...oldStrategy,
                tags: oldStrategy.tags.map(tag => {
                    if (tag.id === data.id) {
                        return {
                            ...tag,
                            id: data.id,
                            position: data.position,
                        };
                    }

                    return tag;
                }),
            };
        });
    };

    return {
        updateTagPosition: mutate,
    };
}

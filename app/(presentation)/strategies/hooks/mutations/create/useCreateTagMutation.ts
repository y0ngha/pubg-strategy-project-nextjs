import { getQueryClient } from '@/(presentation)/shared/helpers/query-client.helpers';
import { useMutation } from '@tanstack/react-query';
import { ReactQueryKeys } from '@/(presentation)/shared/constants/react-query-keys';
import { GetStrategyAction } from '@/(presentation)/strategies/actions/strategy/get-strategy.action';
import { toast } from 'react-toastify';
import {
    CreateTagAction,
    createTagAction,
} from '@/(presentation)/strategies/actions/tag/create-tag.action';
import { QueryKey } from '@tanstack/query-core';
import { useGetCurrentUser } from '@/(presentation)/users/hooks/queries/useGetCurrentUser';

export function useCreateTagMutation(strategyId: string) {
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

            return await createTagAction(formData);
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

            console.error('useCreateTagMutation', error);
            toast.error(
                error.message ?? '알 수 없는 오류로 태그 생성에 실패했습니다.'
            );
        },
    });

    const cacheUpdate = (queryKey: QueryKey, data: CreateTagAction) => {
        queryClient.setQueryData<GetStrategyAction>(queryKey, oldStrategy => {
            if (!oldStrategy) {
                return undefined;
            }

            return {
                ...oldStrategy,
                tags: [
                    ...oldStrategy.tags,
                    {
                        id: data.id,
                        content: data.content,
                        position: data.position,
                    },
                ],
            };
        });
    };

    return {
        createTag: mutate,
    };
}

import { getQueryClient } from '@/(presentation)/shared/helpers/query-client.helpers';
import { useMutation } from '@tanstack/react-query';
import { useGetCurrentUser } from '@/(presentation)/shared/hooks/useGetCurrentUser';
import { ReactQueryKeys } from '@/(presentation)/shared/constants/react-query-keys';
import { GetStrategyAction } from '@/(presentation)/strategy/actions/get-strategy.action';
import { toast } from 'react-toastify';
import {
    CreateTagAction,
    createTagAction,
} from '@/(presentation)/strategy/actions/tag/create-tag.action';
import { QueryKey } from '@tanstack/query-core';

export function useCreateTagMutation(strategyId: string) {
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

            return await createTagAction(formData);
        },
        onSuccess: data => {
            optimisticUpdate([ReactQueryKeys.STRATIGES, strategyId], data);

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

    const optimisticUpdate = (queryKey: QueryKey, data: CreateTagAction) => {
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

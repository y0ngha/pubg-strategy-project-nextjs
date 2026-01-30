import { getQueryClient } from '@/(presentation)/shared/helpers/query-client.helpers';
import { useMutation } from '@tanstack/react-query';
import { useGetCurrentUser } from '@/(presentation)/shared/hooks/useGetCurrentUser';
import { ReactQueryKeys } from '@/(presentation)/shared/constants/react-query-keys';
import { GetStrategyAction } from '@/(presentation)/strategy/actions/get-strategy.action';
import { toast } from 'react-toastify';
import { createTagAction } from '@/(presentation)/strategy/actions/tag/create-tag.action';

export function useCreateTagMutation(strategyId: string) {
    const queryClient = getQueryClient();
    const user = useGetCurrentUser();

    const { mutate } = useMutation({
        mutationFn: async (formData: FormData) => {
            formData.set('userId', user.data?.id ?? '');
            formData.set('strategyId', strategyId);

            return await createTagAction(formData);
        },
        onSuccess: data => {
            const strataegyQueryKey = [ReactQueryKeys.STRATIGES, strategyId];

            queryClient.invalidateQueries({
                queryKey: [user.data?.id, ReactQueryKeys.STRATIGES],
            });

            queryClient.setQueryData<GetStrategyAction>(
                strataegyQueryKey,
                oldStrategy => {
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
                }
            );
        },
        onError: error => {
            console.error('useCreateTagMutation', error);
            toast.error(
                error.message ?? '알 수 없는 오류로 태그 생성에 실패했습니다.'
            );
        },
    });

    return {
        createTag: mutate,
    };
}

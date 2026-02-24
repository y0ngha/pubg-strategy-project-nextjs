import { getQueryClient } from '@/(presentation)/shared/helpers/query-client.helpers';
import { useMutation } from '@tanstack/react-query';
import { ReactQueryKeys } from '@/(presentation)/shared/constants/react-query-keys';
import { GetStrategyAction } from '@/(presentation)/strategy/actions/strategy/get-strategy.action';
import { toast } from 'react-toastify';
import { QueryKey } from '@tanstack/query-core';
import { CommentResponseDto } from '@/application/strategy/dto/strategy/get-strategy.dto';
import { deleteCommentAction } from '@/(presentation)/strategy/actions/comment/delete-comment.action';
import { parseFormData } from '@/(presentation)/shared/helpers/form-data.helper';
import { useGetCurrentUser } from '@/(presentation)/shared/hooks/useGetCurrentUser';

export function useDeleteCommentMutation(strategyId: string) {
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

            return await deleteCommentAction(formData);
        },
        onMutate: variables => {
            const previousStrategy =
                queryClient.getQueryData<GetStrategyAction>(strategyQueryKey);

            const { commentId } = parseFormData(variables, [
                {
                    key: 'commentId',
                    type: 'string',
                    error: '삭제한 댓글 고유 식별자를 불러오지 못했습니다.',
                },
            ] as const);

            optimisticUpdate(strategyQueryKey, commentId);

            return { previousStrategy };
        },
        onError: (error, _, onMutateResult) => {
            if (onMutateResult?.previousStrategy) {
                queryClient.setQueryData(
                    strategyQueryKey,
                    onMutateResult.previousStrategy
                );
            }

            console.error('useDeleteCommentMutation', error);
            toast.error(
                error.message ?? '알 수 없는 오류로 댓글 삭제에 실패했습니다.'
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

    const optimisticUpdate = (queryKey: QueryKey, commentId: string) => {
        queryClient.setQueryData<GetStrategyAction>(queryKey, oldStrategy => {
            if (!oldStrategy) {
                return undefined;
            }

            return {
                ...oldStrategy,
                comments: [
                    ...generateNewComments(commentId, oldStrategy.comments),
                ],
            };
        });
    };

    const generateNewComments = (
        commentId: string,
        comments: CommentResponseDto[]
    ): CommentResponseDto[] => {
        return comments
            .filter(comment => comment.id !== commentId)
            .map(comment => {
                const filteredChildComments = comment.childComments.filter(
                    child => child.id !== commentId
                );

                if (
                    filteredChildComments.length ===
                    comment.childComments.length
                ) {
                    return comment;
                }

                return { ...comment, childComments: filteredChildComments };
            });
    };

    return {
        deleteComment: mutate,
    };
}

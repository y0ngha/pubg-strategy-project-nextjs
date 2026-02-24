import { getQueryClient } from '@/(presentation)/shared/helpers/query-client.helpers';
import { useMutation } from '@tanstack/react-query';
import { ReactQueryKeys } from '@/(presentation)/shared/constants/react-query-keys';
import { GetStrategyAction } from '@/(presentation)/strategy/actions/strategy/get-strategy.action';
import { toast } from 'react-toastify';
import { QueryKey } from '@tanstack/query-core';
import { CommentResponseDto } from '@/application/strategy/dto/strategy/get-strategy.dto';
import {
    UpdateCommentContentAction,
    updateCommentContentAction,
} from '@/(presentation)/strategy/actions/comment/update-comment-content.action';
import { useGetCurrentUser } from '@/(presentation)/shared/hooks/useGetCurrentUser';

export function useUpdateCommentContentMutation(strategyId: string) {
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

            return await updateCommentContentAction(formData);
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

            console.error('useUpdateCommentContentMutation', error);
            toast.error(
                error.message ?? '알 수 없는 오류로 댓글 수정에 실패했습니다.'
            );
        },
    });

    const cacheUpdate = (
        queryKey: QueryKey,
        data: UpdateCommentContentAction
    ) => {
        queryClient.setQueryData<GetStrategyAction>(queryKey, oldStrategy => {
            if (!oldStrategy) {
                return undefined;
            }

            return {
                ...oldStrategy,
                comments: [...generateNewComments(data, oldStrategy.comments)],
            };
        });
    };

    const generateNewComments = (
        data: UpdateCommentContentAction,
        comments: CommentResponseDto[]
    ): CommentResponseDto[] => {
        const { id, content } = data;

        return comments.map(parentComment => {
            if (parentComment.id === id) {
                return {
                    ...parentComment,
                    content: content,
                };
            }

            if (parentComment.childComments.length > 0) {
                return {
                    ...parentComment,
                    childComments: parentComment.childComments.map(
                        childComment => {
                            if (childComment.id === id) {
                                return {
                                    ...childComment,
                                    content: content,
                                };
                            }

                            return childComment;
                        }
                    ),
                };
            }

            return parentComment;
        });
    };

    return {
        updateCommentContent: mutate,
    };
}

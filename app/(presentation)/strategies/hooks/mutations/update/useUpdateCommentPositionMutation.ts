import { getQueryClient } from '@/(presentation)/shared/helpers/query-client.helpers';
import { useMutation } from '@tanstack/react-query';
import { ReactQueryKeys } from '@/(presentation)/shared/constants/react-query-keys';
import { GetStrategyAction } from '@/(presentation)/strategies/actions/strategy/get-strategy.action';
import { toast } from 'react-toastify';
import { QueryKey } from '@tanstack/query-core';
import { CommentResponseDto } from '@/application/strategy/dto/strategy/get-strategy.dto';
import {
    UpdateCommentPositionAction,
    updateCommentPositionAction,
} from '@/(presentation)/strategies/actions/comment/update-comment-poisition.action';
import { useGetCurrentUser } from '@/(presentation)/users/hooks/queries/useGetCurrentUser';

export function useUpdateCommentPositionMutation(strategyId: string) {
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

            return await updateCommentPositionAction(formData);
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

            console.error('useUpdateCommentPositionMutation', error);
            toast.error(
                error.message ?? '알 수 없는 오류로 댓글 수정에 실패했습니다.'
            );
        },
    });

    const cacheUpdate = (
        queryKey: QueryKey,
        data: UpdateCommentPositionAction
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
        data: UpdateCommentPositionAction,
        comments: CommentResponseDto[]
    ): CommentResponseDto[] => {
        const { id, position } = data;

        return comments.map(parentComment => {
            if (parentComment.id === id) {
                return {
                    ...parentComment,
                    position: position,
                };
            }

            return parentComment;
        });
    };

    return {
        updateCommentPosition: mutate,
    };
}

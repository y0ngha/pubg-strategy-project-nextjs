import { getQueryClient } from '@/(presentation)/shared/helpers/query-client.helpers';
import { useMutation } from '@tanstack/react-query';

import { ReactQueryKeys } from '@/(presentation)/shared/constants/react-query-keys';
import { GetStrategyAction } from '@/(presentation)/strategy/actions/strategy/get-strategy.action';
import { toast } from 'react-toastify';
import { QueryKey } from '@tanstack/query-core';
import { CommentResponseDto } from '@/application/strategy/dto/strategy/get-strategy.dto';
import {
    createChildCommentAction,
    CreateChildCommentAction,
} from '@/(presentation)/strategy/actions/comment/create-child-comment.action';

export function useCreateChildCommentMutation(strategyId: string) {
    const queryClient = getQueryClient();

    const strategyQueryKey: QueryKey = [ReactQueryKeys.STRATIGES, strategyId];
    const strategiesQueryKey: QueryKey = [ReactQueryKeys.STRATIGES_ALL];

    const { mutate } = useMutation({
        mutationFn: async (formData: FormData) => {
            formData.set('strategyId', strategyId);

            return await createChildCommentAction(formData);
        },
        onSuccess: data => {
            cacheUpdate([ReactQueryKeys.STRATIGES, strategyId], data);

            queryClient.invalidateQueries({
                queryKey: strategiesQueryKey,
            });
        },
        onError: error => {
            queryClient.invalidateQueries({
                queryKey: strategyQueryKey,
            });

            console.error('useCreateChildCommentMutation', error);
            toast.error(
                error.message ?? '알 수 없는 오류로 댓글 생성에 실패했습니다.'
            );
        },
    });

    const cacheUpdate = (
        queryKey: QueryKey,
        data: CreateChildCommentAction
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

    const findCommentIndexByChildCommentId = (
        comments: CommentResponseDto[],
        parentCommentId: string
    ) => {
        const index = comments.findIndex(
            comment => comment.id === parentCommentId
        );

        if (index === -1) {
            return null;
        }

        return index;
    };

    const appendChildComment = (
        data: CreateChildCommentAction,
        parentIndex: number,
        comments: CommentResponseDto[]
    ): CommentResponseDto[] => {
        return comments.map((comment, index) => {
            if (index !== parentIndex) {
                return comment;
            }

            return {
                ...comment,
                childComments: [
                    ...comment.childComments,
                    {
                        ...data,
                    },
                ],
            };
        });
    };

    const generateNewComments = (
        data: CreateChildCommentAction,
        comments: CommentResponseDto[]
    ) => {
        const { parentCommentId } = data;

        if (!parentCommentId) {
            return comments;
        }

        const parentCommentIndex = findCommentIndexByChildCommentId(
            comments,
            parentCommentId
        );

        if (parentCommentIndex === null) {
            return comments;
        }

        return appendChildComment(data, parentCommentIndex, comments);
    };

    return {
        createChildComment: mutate,
    };
}

import { getQueryClient } from '@/(presentation)/shared/helpers/query-client.helpers';
import { useMutation } from '@tanstack/react-query';
import { ReactQueryKeys } from '@/(presentation)/shared/constants/react-query-keys';
import { GetStrategyAction } from '@/(presentation)/strategies/actions/strategy/get-strategy.action';
import { toast } from 'react-toastify';
import {
    createParentCommentAction,
    CreateParentCommentAction,
} from '@/(presentation)/strategies/actions/comment/create-parent-comment.action';
import { QueryKey } from '@tanstack/query-core';
import { CommentResponseDto } from '@/application/strategy/dto/strategy/get-strategy.dto';
import { useGetCurrentUser } from '@/(presentation)/users/hooks/queries/useGetCurrentUser';

export function useCreateParentCommentMutation(strategyId: string) {
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

            return await createParentCommentAction(formData);
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

            console.error('useCreateParentCommentMutation', error);
            toast.error(
                error.message ?? '알 수 없는 오류로 댓글 생성에 실패했습니다.'
            );
        },
    });

    const cacheUpdate = (
        queryKey: QueryKey,
        data: CreateParentCommentAction
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

    const appendParentComment = (
        data: CreateParentCommentAction,
        comments: CommentResponseDto[]
    ): CommentResponseDto[] => {
        return [
            ...comments,
            {
                id: data.id,
                authorId: data.authorId,
                authorEmail: data.authorEmail,
                content: data.content,
                childComments: [],
                position: data.position!,
                createdAt: data.createdAt,
                isAuthor: data.isAuthor,
                isParent: data.isParent,
            },
        ];
    };

    const generateNewComments = (
        data: CreateParentCommentAction,
        comments: CommentResponseDto[]
    ) => {
        const { position } = data;

        if (position === null) {
            return comments;
        }

        return appendParentComment(data, comments);
    };

    return {
        createParentComment: mutate,
    };
}

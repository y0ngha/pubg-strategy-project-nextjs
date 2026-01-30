import { getQueryClient } from '@/(presentation)/shared/helpers/query-client.helpers';
import { useMutation } from '@tanstack/react-query';
import { useGetCurrentUser } from '@/(presentation)/shared/hooks/useGetCurrentUser';
import { ReactQueryKeys } from '@/(presentation)/shared/constants/react-query-keys';
import { GetStrategyAction } from '@/(presentation)/strategy/actions/get-strategy.action';
import { toast } from 'react-toastify';
import { createCommentAction } from '@/(presentation)/strategy/actions/comment/create-comment.action';

export function useCreateCommentMutation(strategyId: string) {
    const queryClient = getQueryClient();
    const user = useGetCurrentUser();

    const { mutate } = useMutation({
        mutationFn: async (formData: FormData) => {
            formData.set('userId', user.data?.id ?? '');
            formData.set('strategyId', strategyId);

            return await createCommentAction(formData);
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

                    let newComments = [...oldStrategy.comments];

                    if (data.parentCommentId) {
                        const parentCommentIndex =
                            oldStrategy.comments.findIndex(
                                comment => comment.id === data.parentCommentId
                            );

                        if (parentCommentIndex !== -1) {
                            newComments[parentCommentIndex].childComments = [
                                ...newComments[parentCommentIndex]
                                    .childComments,
                                {
                                    id: data.id,
                                    authorId: data.authorId,
                                    authorEmail: data.authorEmail,
                                    content: data.content,
                                },
                            ];
                        }
                    } else {
                        if (data.position) {
                            newComments = [
                                ...newComments,
                                {
                                    id: data.id,
                                    authorId: data.authorId,
                                    authorEmail: data.authorEmail,
                                    content: data.content,
                                    childComments: [],
                                    position: data.position,
                                },
                            ];
                        } else {
                            newComments = [...newComments];
                        }
                    }

                    return {
                        ...oldStrategy,
                        comments: [...newComments],
                    };
                }
            );
        },
        onError: error => {
            console.error('useCreateCommentMutation', error);
            toast.error(
                error.message ?? '알 수 없는 오류로 댓글 생성에 실패했습니다.'
            );
        },
    });

    return {
        createComment: mutate,
    };
}

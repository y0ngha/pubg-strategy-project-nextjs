import { useCreateCommentMutation } from '@/(presentation)/(pages)/strategies/[id]/components/hooks/useCreateCommentMutation';
import { useState } from 'react';
import { CommentResponseDto } from '@/application/strategy/dto/strategy/get-strategy.dto';
import { useUpdateCommentMutation } from '@/(presentation)/(pages)/strategies/[id]/components/hooks/useUpdateCommentMutation';

export function useCommentEvent(
    strategyId: string,
    comments: CommentResponseDto[]
) {
    const { createComment } = useCreateCommentMutation(strategyId);
    const { updateComment } = useUpdateCommentMutation(strategyId);

    const [topCommentId, setTopCommentId] = useState<string | null>(null);

    const [isCommentWindowOpen, setIsCommentWindowOpen] = useState(false);

    const [position, setPosition] = useState<{ x: number; y: number }>({
        x: 0,
        y: 0,
    });

    const [windowPosition, setwindowPosition] = useState<{
        x: number;
        y: number;
    }>({
        x: 0,
        y: 0,
    });

    const setupCommentWindowPosition = (
        commentWindowPosition: { x: number; y: number },
        commentPosition: { x: number; y: number }
    ) => {
        setwindowPosition(commentWindowPosition);
        setPosition(commentPosition);
    };

    const commentWindowOpen = (
        commentWindowPosition: { x: number; y: number },
        commentPosition: { x: number; y: number }
    ) => {
        setupCommentWindowPosition(commentWindowPosition, commentPosition);
        setTopCommentId(null);
        setIsCommentWindowOpen(true);
    };

    const commentWindowClose = () => {
        setIsCommentWindowOpen(false);
        setTopCommentId(null);
    };

    const commentCreate = (content: string, parentCommentId: string | null) => {
        const formData = new FormData();
        formData.set('content', content);

        if (!parentCommentId) {
            formData.set('position', JSON.stringify(position));
        }

        if (parentCommentId) {
            formData.set('parentCommentId', parentCommentId);
        }

        createComment(formData);
    };

    const commentUpdate = (commentId: string, content: string) => {
        const formData = new FormData();
        formData.set('commentId', commentId);
        formData.set('content', content);

        updateComment(formData);
    };

    const commentClick = (
        commentId: string,
        commentWindowPosition: { x: number; y: number },
        commentPosition: { x: number; y: number }
    ) => {
        setupCommentWindowPosition(commentWindowPosition, commentPosition);
        setTopCommentId(commentId);
        setIsCommentWindowOpen(true);
    };

    const filterSamePositionComments = (
        comment: CommentResponseDto,
        topComment: CommentResponseDto
    ) => {
        return (
            comment.id === topComment.id ||
            (comment.position.x === topComment.position.x &&
                comment.position.y === topComment.position.y)
        );
    };

    const sortingCreatedAtByAscending = (
        commentA: CommentResponseDto,
        commentB: CommentResponseDto
    ) => {
        return commentA.createdAt.getTime() - commentB.createdAt.getTime();
    };

    const topComment = comments.find(comment => comment.id === topCommentId);

    const filteredComments = topComment
        ? comments
              .filter(comment => {
                  return filterSamePositionComments(comment, topComment);
              })
              .sort(sortingCreatedAtByAscending)
        : [];

    return {
        isCommentWindowOpen,
        commentWindowOpen,
        commentWindowClose,
        commentCreate,
        commentUpdate,
        commentClick,
        windowPosition,
        filteredComments,
    };
}

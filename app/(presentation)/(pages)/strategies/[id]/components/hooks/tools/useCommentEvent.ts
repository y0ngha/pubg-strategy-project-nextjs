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

    const [activeCommentId, setActiveCommentId] = useState<string | null>(null);

    const [isCommentWindowOpen, setIsCommentWindowOpen] = useState(false);

    const [position, setPosition] = useState<{ x: number; y: number }>({
        x: 0,
        y: 0,
    });

    const [windowPosisiton, setWindowPosisiton] = useState<{
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
        setWindowPosisiton(commentWindowPosition);
        setPosition(commentPosition);
    };

    const commentWindowOpen = (
        commentWindowPosition: { x: number; y: number },
        commentPosition: { x: number; y: number }
    ) => {
        setupCommentWindowPosition(commentWindowPosition, commentPosition);
        setActiveCommentId(null);
        setIsCommentWindowOpen(true);
    };

    const commentWindowClose = () => {
        setIsCommentWindowOpen(false);
        setActiveCommentId(null);
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
        setActiveCommentId(commentId);
        setIsCommentWindowOpen(true);
    };

    const filterSamePositionComments = (
        comment: CommentResponseDto,
        activeComment?: CommentResponseDto
    ) => {
        return (
            comment.id === activeComment?.id ||
            (comment.position.x === activeComment?.position.x &&
                comment.position.y === activeComment?.position.y)
        );
    };

    const sortingCreatedAtByAscending = (
        commentA: CommentResponseDto,
        commentB: CommentResponseDto
    ) => {
        return commentA.createdAt.getTime() - commentB.createdAt.getTime();
    };

    const activeComment = comments.find(
        comment => comment.id === activeCommentId
    );

    const filteredComments = comments
        .filter(comment => {
            return filterSamePositionComments(comment, activeComment);
        })
        .sort(sortingCreatedAtByAscending);

    return {
        isCommentWindowOpen,
        commentWindowOpen,
        commentWindowClose,
        commentCreate,
        commentUpdate,
        commentClick,
        windowPosisiton,
        filteredComments,
    };
}

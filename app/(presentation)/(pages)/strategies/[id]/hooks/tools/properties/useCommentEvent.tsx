import { useCreateCommentMutation } from '@/(presentation)/(pages)/strategies/[id]/hooks/mutations/create/useCreateCommentMutation';
import React, { useState } from 'react';
import { CommentResponseDto } from '@/application/strategy/dto/strategy/get-strategy.dto';
import { useUpdateCommentMutation } from '@/(presentation)/(pages)/strategies/[id]/hooks/mutations/update/useUpdateCommentMutation';
import { useDeleteCommentMutation } from '@/(presentation)/(pages)/strategies/[id]/hooks/mutations/delete/useDeleteCommentMutation';
import StrategyCommentWindow from '@/(presentation)/(pages)/strategies/[id]/components/modals/strategy-comment-window.modal';
import CommentsLayer from '@/(presentation)/(pages)/strategies/[id]/components/tools/properties/comment-property.component';

export function useCommentEvent(
    strategyId: string,
    comments: CommentResponseDto[]
) {
    const { createComment: createCommentMutation } =
        useCreateCommentMutation(strategyId);
    const { updateComment: updateCommentMutation } =
        useUpdateCommentMutation(strategyId);
    const { deleteComment: deleteCommentMutation } =
        useDeleteCommentMutation(strategyId);

    const [selectedCommentId, setSelectedCommentId] = useState<
        string | undefined
    >(undefined);

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

    const toggleSelectedCommentId = (id?: string) => {
        setSelectedCommentId(prevState => {
            if (prevState === id) {
                return undefined;
            }

            return id;
        });
    };

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
        setSelectedCommentId(undefined);
        setIsCommentWindowOpen(true);
    };

    const commentWindowClose = () => {
        setIsCommentWindowOpen(false);
        setSelectedCommentId(undefined);
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

    const createComment = (content: string, parentCommentId: string | null) => {
        const formData = new FormData();
        formData.set('content', content);

        if (!parentCommentId) {
            formData.set('position', JSON.stringify(position));
        }

        if (parentCommentId) {
            formData.set('parentCommentId', parentCommentId);
        }

        createCommentMutation(formData);
    };

    const updateComment = (commentId: string, content: string) => {
        const formData = new FormData();
        formData.set('commentId', commentId);
        formData.set('content', content);

        updateCommentMutation(formData);
    };

    const moveComment = (
        commentId: string,
        deltaPosition: { x: number; y: number }
    ) => {
        const comment = comments.find(comment => comment.id === commentId);

        if (!comment) {
            throw new Error('댓글 ID로 댓글을 찾을 수 없습니다.');
        }

        const position = {
            x: comment.position.x + deltaPosition.x,
            y: comment.position.y + deltaPosition.y,
        };

        const formData = new FormData();
        formData.set('commentId', commentId);
        formData.set('position', JSON.stringify(position));

        updateCommentMutation(formData);
    };

    const deleteComment = (commentId: string) => {
        const formData = new FormData();
        formData.set('commentId', commentId);

        deleteCommentMutation(formData);
    };

    const commentClick = (
        commentId: string,
        commentWindowPosition: { x: number; y: number },
        commentPosition: { x: number; y: number }
    ) => {
        setupCommentWindowPosition(commentWindowPosition, commentPosition);
        setSelectedCommentId(commentId);
        setIsCommentWindowOpen(true);
    };

    const topComment = comments.find(
        comment => comment.id === selectedCommentId
    );

    const filteredComments = topComment
        ? comments
              .filter(comment => {
                  return filterSamePositionComments(comment, topComment);
              })
              .sort(sortingCreatedAtByAscending)
        : [];

    const Window = () => (
        <StrategyCommentWindow
            key={JSON.stringify(windowPosition)}
            isOpen={isCommentWindowOpen}
            onClose={commentWindowClose}
            comments={filteredComments}
            onAddComment={createComment}
            onUpdateComment={updateComment}
            onDeleteComment={deleteComment}
            position={windowPosition}
        />
    );

    const Layer = ({ isSelectable }: { isSelectable: boolean }) => (
        <CommentsLayer
            isSelectable={isSelectable}
            comments={comments}
            onClick={commentClick}
            onMove={moveComment}
        />
    );

    return {
        toggleSelectedCommentId,
        commentWindowOpen,
        commentClick,
        moveComment,
        StrategyCommentWindow: Window,
        CommentsLayer: Layer,
    };
}

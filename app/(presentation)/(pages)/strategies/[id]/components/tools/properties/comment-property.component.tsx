import { Group, Image } from 'react-konva';
import { useLucideIconToSvgUrl } from '@/(presentation)/(pages)/strategies/[id]/hooks/utils/useLucideIconToSvgUrl';
import useImage from 'use-image';
import { StrategyBodyProps } from '@/(presentation)/(pages)/strategies/[id]/components/body/strategy-body.component';
import React from 'react';
import { MessageSquareText } from 'lucide-react';
import { useKonvaHandleHover } from '@/(presentation)/(pages)/strategies/[id]/hooks/konvas/useKonvaHandleHover';
import { useKonvaHandleMouseClick } from '@/(presentation)/(pages)/strategies/[id]/hooks/konvas/useKonvaHandleMouseClick';
import { useKonvaHandlePropertyDrag } from '@/(presentation)/(pages)/strategies/[id]/hooks/konvas/useKonvaHandlePropertyDrag';

interface CommentPropertyProps {
    id: string;
    x: number;
    y: number;
    onClick: (
        id: string,
        commentWindowPosition: { x: number; y: number },
        mapClickPosition: { x: number; y: number }
    ) => void;
    isSelectable: boolean;
    onMove: (
        commentId: string,
        deltaPosition: { x: number; y: number }
    ) => void;
}

function CommentProperty({
    id,
    x,
    y,
    onClick,
    isSelectable,
}: CommentPropertyProps) {
    const iconColor = '#0EA5E9';

    const {
        handleMouseLeave: hoverHandleMouseLeave,
        handleMouseEnter: hoverHandleMouseEnter,
        scaleX,
        scaleY,
        shadowBlur,
        shadowColor,
        shadowOpacity,
    } = useKonvaHandleHover(iconColor);

    const { handleDragStart, handleDragEnd } = useKonvaHandlePropertyDrag();

    const { handleClick } = useKonvaHandleMouseClick(
        (_, clickPosition, windowPosition) => {
            onClick(id, windowPosition, clickPosition);
        }
    );

    const { url, center } = useLucideIconToSvgUrl(MessageSquareText, {
        color: iconColor,
        size: 128,
        strokeWidth: 1,
        fill: true,
    });

    const [commentImage] = useImage(url ?? '');

    return (
        <Group
            x={0}
            y={0}
            onMouseEnter={hoverHandleMouseEnter}
            onMouseLeave={hoverHandleMouseLeave}
            onClick={handleClick}
            listening={isSelectable}
            draggable={true}
            onMouseDown={event => {
                event.cancelBubble = true;
            }}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
        >
            <Image
                image={commentImage}
                x={x}
                y={y}
                offsetX={center}
                offsetY={center}
                scaleX={scaleX}
                scaleY={scaleY}
                shadowBlur={shadowBlur}
                shadowColor={shadowColor}
                shadowOpacity={shadowOpacity}
                alt={'댓글 이미지'}
            />
        </Group>
    );
}

CommentProperty.displayName = 'CommentProperty';

function CommentsLayer({
    comments,
    onClick,
    isSelectable,
    onMove,
}: Pick<CommentPropertyProps, 'onClick' | 'isSelectable' | 'onMove'> &
    Pick<StrategyBodyProps, 'comments'>) {
    return (
        <>
            {comments.map(field => (
                <CommentProperty
                    key={field.id}
                    id={field.id}
                    x={field.position.x}
                    y={field.position.y}
                    onClick={onClick}
                    isSelectable={isSelectable}
                    onMove={onMove}
                />
            ))}
        </>
    );
}

CommentsLayer.displayName = 'CommentsLayer';

export default React.memo(CommentsLayer);

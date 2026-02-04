import { Group, Image } from 'react-konva';
import { useLucideIconToSvgUrl } from '@/(presentation)/(pages)/strategies/[id]/hooks/utils/useLucideIconToSvgUrl';
import useImage from 'use-image';
import { StrategyBodyProps } from '@/(presentation)/(pages)/strategies/[id]/components/body/strategy-body.component';
import React from 'react';
import { MessageSquareText } from 'lucide-react';
import { useKonvaHandleHover } from '@/(presentation)/(pages)/strategies/[id]/hooks/konvas/useKonvaHandleHover';
import { useKonvaHandleMouseClick } from '@/(presentation)/(pages)/strategies/[id]/hooks/konvas/useKonvaHandleMouseClick';

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
}: Pick<CommentPropertyProps, 'onClick' | 'isSelectable'> &
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
                />
            ))}
        </>
    );
}

CommentsLayer.displayName = 'CommentsLayer';

export default React.memo(CommentsLayer);

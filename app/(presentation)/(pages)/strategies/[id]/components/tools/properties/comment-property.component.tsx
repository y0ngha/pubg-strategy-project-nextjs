import { Group, Image, Layer } from 'react-konva';
import { useLucideIconToSvgUrl } from '@/(presentation)/(pages)/strategies/[id]/hooks/utils/useLucideIconToSvgUrl';
import useImage from 'use-image';
import { StrategyBodyProps } from '@/(presentation)/(pages)/strategies/[id]/components/body/strategy-body.compoenent';
import React from 'react';
import { useKonvaHandleCursorChange } from '@/(presentation)/(pages)/strategies/[id]/hooks/konvas/useKonvaHandleCursorChange';
import { KonvaEventObject } from 'konva/lib/Node';
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
}

function CommentProperty({ id, x, y, onClick }: CommentPropertyProps) {
    const {
        handleMouseLeave: cursorHandleMouseLeave,
        handleMouseEnter: cursorHandleMouseEnter,
    } = useKonvaHandleCursorChange('pointer', 'default');

    const {
        isHovered,
        handleMouseLeave: hoverHandleMouseLeave,
        handleMouseEnter: hoverHandleMouseEnter,
    } = useKonvaHandleHover();

    const { handleClick } = useKonvaHandleMouseClick(
        (event, clickPosition, windowPosition) => {
            event.cancelBubble = true;
            onClick(id, windowPosition, clickPosition);
        }
    );

    const iconColor = '#0EA5E9';

    const { url, center } = useLucideIconToSvgUrl(MessageSquareText, {
        color: iconColor,
        size: 128,
        strokeWidth: 1,
        fill: true,
    });

    const [commentImage] = useImage(url ?? '');

    const handleMouseEnter = (event: KonvaEventObject<MouseEvent>) => {
        hoverHandleMouseEnter();
        cursorHandleMouseEnter(event);
    };

    const handleMouseLeave = (event: KonvaEventObject<MouseEvent>) => {
        hoverHandleMouseLeave();
        cursorHandleMouseLeave(event);
    };

    return (
        <Group
            x={x}
            y={y}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            onClick={handleClick}
        >
            <Image
                image={commentImage}
                offsetX={center}
                offsetY={center}
                scaleX={isHovered ? 1.0 : 0.8}
                scaleY={isHovered ? 1.0 : 0.8}
                shadowColor={iconColor}
                shadowBlur={isHovered ? 15 : 0}
                shadowOpacity={0.8}
                alt={'댓글 이미지'}
            />
        </Group>
    );
}

CommentProperty.displayName = 'CommentProperty';

function CommentsLayer({
    comments,
    onClick,
}: {
    onClick: (
        id: string,
        commentWindowPosition: { x: number; y: number },
        mapClickPosition: { x: number; y: number }
    ) => void;
} & Pick<StrategyBodyProps, 'comments'>) {
    return (
        <Layer>
            {comments.map(field => (
                <CommentProperty
                    key={field.id}
                    id={field.id}
                    x={field.position.x}
                    y={field.position.y}
                    onClick={onClick}
                />
            ))}
        </Layer>
    );
}

CommentsLayer.displayName = 'CommentsLayer';

export default React.memo(CommentsLayer);

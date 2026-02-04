import { Group, Image, Label, Tag as KonvaTag, Text } from 'react-konva';
import { useLucideIconToSvgUrl } from '@/(presentation)/(pages)/strategies/[id]/hooks/utils/useLucideIconToSvgUrl';
import useImage from 'use-image';
import { Tag } from 'lucide-react';
import { StrategyBodyProps } from '@/(presentation)/(pages)/strategies/[id]/components/body/strategy-body.component';
import React, { useState } from 'react';
import { useKonvaHandleHover } from '@/(presentation)/(pages)/strategies/[id]/hooks/konvas/useKonvaHandleHover';
import { useKonvaHandlePropertyDrag } from '@/(presentation)/(pages)/strategies/[id]/hooks/konvas/useKonvaHandlePropertyDrag';

interface TagPropertyProps {
    id: string;
    x: number;
    y: number;
    content: string;
    isSelectable: boolean;
    onMove: (tagId: string, deltaPosition: { x: number; y: number }) => void;
}

function TagProperty({
    id,
    x,
    y,
    content,
    isSelectable,
    onMove,
}: TagPropertyProps) {
    const iconColor = '#A855F7';

    const [isOpen, setIsOpen] = useState(false);

    const {
        handleMouseLeave: hoverHandleMouseLeave,
        handleMouseEnter: hoverHandleMouseEnter,
        scaleX,
        scaleY,
        shadowBlur,
        shadowColor,
        shadowOpacity,
    } = useKonvaHandleHover(iconColor);

    const { handleDragStart, handleDragEnd } = useKonvaHandlePropertyDrag(
        deltaPosition => {
            onMove(id, deltaPosition);
        }
    );

    const { url, center } = useLucideIconToSvgUrl(Tag, {
        color: iconColor,
        size: 128,
        strokeWidth: 1,
        fill: true,
    });

    const [tagImage] = useImage(url ?? '');

    const handleClick = () => {
        setIsOpen(prevState => !prevState);
    };

    return (
        <Group
            x={0}
            y={0}
            listening={isSelectable}
            draggable={true}
            onMouseDown={event => {
                event.cancelBubble = true;
            }}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
            onMouseEnter={hoverHandleMouseEnter}
            onMouseLeave={hoverHandleMouseLeave}
            onClick={handleClick}
        >
            <Image
                image={tagImage}
                x={x}
                y={y}
                offsetX={center}
                offsetY={center}
                scaleX={scaleX}
                scaleY={scaleY}
                shadowColor={shadowColor}
                shadowBlur={shadowBlur}
                shadowOpacity={shadowOpacity}
                alt={'태그 이미지'}
            />

            {isOpen && (
                <Label x={x} y={y - 60} opacity={0.9}>
                    <KonvaTag
                        fill={'#18181b'}
                        stroke={iconColor}
                        strokeWidth={1}
                        pointerDirection={'down'}
                        pointerWidth={10}
                        pointerHeight={5}
                        lineJoin={'round'}
                        cornerRadius={4}
                    />

                    <Text
                        text={content}
                        fontSize={72}
                        padding={8}
                        fill={'white'}
                        align={'center'}
                    />
                </Label>
            )}
        </Group>
    );
}

TagProperty.displayName = 'TagProperty';

function TagsLayer({
    tags,
    isSelectable,
    onMove,
}: Pick<TagPropertyProps, 'isSelectable' | 'onMove'> &
    Pick<StrategyBodyProps, 'tags'>) {
    return (
        <>
            {tags.map(field => (
                <TagProperty
                    key={field.id}
                    id={field.id}
                    x={field.position.x}
                    y={field.position.y}
                    content={field.content}
                    isSelectable={isSelectable}
                    onMove={onMove}
                />
            ))}
        </>
    );
}

TagsLayer.displayName = 'TagsLayer';

export default React.memo(TagsLayer);

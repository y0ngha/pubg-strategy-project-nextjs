import { Group, Image, Label, Layer, Tag as KonvaTag, Text } from 'react-konva';
import { useLucideIconToSvgUrl } from '@/(presentation)/(pages)/strategies/[id]/hooks/utils/useLucideIconToSvgUrl';
import useImage from 'use-image';
import { Tag } from 'lucide-react';
import { StrategyBodyProps } from '@/(presentation)/(pages)/strategies/[id]/components/body/strategy-body.component';
import React, { useState } from 'react';
import { useKonvaHandleCursorChange } from '@/(presentation)/(pages)/strategies/[id]/hooks/konvas/useKonvaHandleCursorChange';
import { KonvaEventObject } from 'konva/lib/Node';
import { useKonvaHandleHover } from '@/(presentation)/(pages)/strategies/[id]/hooks/konvas/useKonvaHandleHover';

interface TagPropertyProps {
    x: number;
    y: number;
    content: string;
    isSelectable: boolean;
}

function TagProperty({ x, y, content, isSelectable }: TagPropertyProps) {
    const [isOpen, setIsOpen] = useState(false);

    const {
        handleMouseLeave: cursorHandleMouseLeave,
        handleMouseEnter: cursorHandleMouseEnter,
    } = useKonvaHandleCursorChange('pointer', 'default');

    const {
        isHovered,
        handleMouseLeave: hoverHandleMouseLeave,
        handleMouseEnter: hoverHandleMouseEnter,
    } = useKonvaHandleHover();

    const iconColor = '#A855F7';

    const { url, center } = useLucideIconToSvgUrl(Tag, {
        color: iconColor,
        size: 128,
        strokeWidth: 1,
        fill: true,
    });

    const [tagImage] = useImage(url ?? '');

    const handleMouseEnter = (event: KonvaEventObject<MouseEvent>) => {
        hoverHandleMouseEnter();
        cursorHandleMouseEnter(event);
    };

    const handleMouseLeave = (event: KonvaEventObject<MouseEvent>) => {
        hoverHandleMouseLeave();
        cursorHandleMouseLeave(event);
    };

    const handleClick = () => {
        setIsOpen(prevState => !prevState);
    };

    return (
        <Group
            x={0}
            y={0}
            listening={isSelectable}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            onClick={handleClick}
        >
            <Image
                image={tagImage}
                x={x}
                y={y}
                offsetX={center}
                offsetY={center}
                scaleX={isHovered ? 1.0 : 0.8}
                scaleY={isHovered ? 1.0 : 0.8}
                shadowColor={iconColor}
                shadowBlur={isHovered ? 15 : 0}
                shadowOpacity={0.8}
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
}: Pick<TagPropertyProps, 'isSelectable'> & Pick<StrategyBodyProps, 'tags'>) {
    return (
        <Layer>
            {tags.map(field => (
                <TagProperty
                    key={field.id}
                    x={field.position.x}
                    y={field.position.y}
                    content={field.content}
                    isSelectable={isSelectable}
                />
            ))}
        </Layer>
    );
}

TagsLayer.displayName = 'TagsLayer';

export default React.memo(TagsLayer);

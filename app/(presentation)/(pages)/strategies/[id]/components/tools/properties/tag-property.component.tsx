'use client';

import { Group, Image, Label, Tag as KonvaTag, Text } from 'react-konva';
import { useLucideIconToSvgUrl } from '@/(presentation)/(pages)/strategies/[id]/hooks/utils/useLucideIconToSvgUrl';
import useImage from 'use-image';
import { Tag } from 'lucide-react';
import {
    PropertyClickPayload,
    StrategyBodyProps,
} from '@/(presentation)/(pages)/strategies/[id]/components/body/strategy-body.component';
import React, { useRef, useState } from 'react';
import { useKonvaHandleHover } from '@/(presentation)/(pages)/strategies/[id]/hooks/konvas/useKonvaHandleHover';
import { useKonvaHandlePropertyDrag } from '@/(presentation)/(pages)/strategies/[id]/hooks/konvas/useKonvaHandlePropertyDrag';
import { useKonvaHandleMouseClick } from '@/(presentation)/(pages)/strategies/[id]/hooks/konvas/useKonvaHandleMouseClick';
import Konva from 'konva';
import SelectionFrame from '@/(presentation)/(pages)/strategies/[id]/components/tools/properties/selection-frame.component';

interface TagPropertyProps {
    id: string;
    x: number;
    y: number;
    content: string;
    isSelectable: boolean;
    isSelected: boolean;
    onMove: (tagId: string, deltaPosition: { x: number; y: number }) => void;
    onDelete: (tagId: string) => void;
    onClick: ({ type, id }: PropertyClickPayload) => void;
}

function TagProperty({
    id,
    x,
    y,
    content,
    isSelectable,
    isSelected,
    onMove,
    onClick,
    onDelete,
}: TagPropertyProps) {
    const ref = useRef<Konva.Image>(null);

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

    const { handleClick } = useKonvaHandleMouseClick(() => {
        onClick({ type: 'tag', id });
        setIsOpen(prevState => !prevState);
    });

    const { url, center } = useLucideIconToSvgUrl(Tag, {
        color: iconColor,
        size: 128,
        strokeWidth: 1,
        fill: true,
    });

    const [tagImage] = useImage(url ?? '');

    const handleDelete = () => {
        onDelete(id);
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
        >
            <Image
                ref={ref}
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
                onMouseEnter={hoverHandleMouseEnter}
                onMouseLeave={hoverHandleMouseLeave}
                onClick={handleClick}
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

            <SelectionFrame
                targetRef={ref}
                isSelected={isSelected}
                onDelete={handleDelete}
            />
        </Group>
    );
}

TagProperty.displayName = 'TagProperty';

function TagsLayer({
    tags,
    isSelectable,
    selectedTagId,
    onMove,
    onDelete,
    onClick,
}: { selectedTagId?: string } & Pick<
    TagPropertyProps,
    'isSelectable' | 'onMove' | 'onDelete' | 'onClick'
> &
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
                    isSelected={selectedTagId === field.id}
                    onMove={onMove}
                    onDelete={onDelete}
                    onClick={onClick}
                />
            ))}
        </>
    );
}

TagsLayer.displayName = 'TagsLayer';

export default React.memo(TagsLayer);

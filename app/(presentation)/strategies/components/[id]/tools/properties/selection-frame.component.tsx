'use client';

import { Group, Rect } from 'react-konva';
import { RefObject, useEffect, useState } from 'react';
import Konva from 'konva';
import DeleteButton from '@/(presentation)/strategies/components/[id]/tools/properties/delete-button.component';

interface SelectionFrameProps {
    targetRef: RefObject<Konva.Node | null>;
    isSelected: boolean;
    onDelete: () => void;
    padding?: number;
}

function SelectionFrame({
    targetRef,
    isSelected,
    onDelete,
    padding = 8,
}: SelectionFrameProps) {
    const [rect, setRect] = useState({ x: 0, y: 0, width: 0, height: 0 });

    useEffect(() => {
        if (isSelected && targetRef.current) {
            const node = targetRef.current;

            const box = node.getClientRect({
                relativeTo: node.getParent() as Konva.Container,
            });

            setRect({
                x: box.x,
                y: box.y,
                width: box.width,
                height: box.height,
            });
        }
    }, [isSelected, targetRef]);

    const boxX = rect.x - padding;
    const boxY = rect.y - padding;
    const boxWidth = rect.width + padding * 2;
    const boxHeight = rect.height + padding * 2;

    if (!isSelected) {
        return null;
    }

    return (
        <Group>
            <Rect
                x={boxX}
                y={boxY}
                width={boxWidth}
                height={boxHeight}
                stroke={'#9d9d9d'}
                strokeWidth={4}
                dash={[6, 4]}
                listening={false}
                cornerRadius={4}
            />

            <DeleteButton x={boxX + boxWidth} y={boxY} onClick={onDelete} />
        </Group>
    );
}

SelectionFrame.displayName = 'PropertySelectionFrame';

export default SelectionFrame;

'use client';

import { Circle, Group, Text } from 'react-konva';
import { useKonvaHandleCursorChange } from '@/(presentation)/strategies/hooks/konvas/useKonvaHandleCursorChange';
import { useKonvaHandleMouseClick } from '@/(presentation)/strategies/hooks/konvas/useKonvaHandleMouseClick';

interface DeleteButtonProps {
    x: number;
    y: number;
    onClick: () => void;
}

function DeleteButton({ x, y, onClick }: DeleteButtonProps) {
    const { cursorChange, cursorChangeDispose } = useKonvaHandleCursorChange(
        'pointer',
        'default'
    );
    const { handleClick } = useKonvaHandleMouseClick(() => {
        onClick();
    });

    return (
        <Group
            x={x}
            y={y}
            onClick={handleClick}
            onMouseEnter={cursorChange}
            onMouseLeave={cursorChangeDispose}
        >
            <Circle radius={24} fill={'#ef4444'} shadowBlur={5} />

            <Text
                text={'삭제'}
                fontSize={22}
                x={-18}
                y={-10}
                fill={'white'}
                listening={false}
            />
        </Group>
    );
}

DeleteButton.displayName = 'PropertyDeleteButton';

export default DeleteButton;

import { ReactNode } from 'react';
import { useSafetyContext } from '@/(presentation)/shared/hooks/useSafetyContext';
import { ConfirmContext } from '@/(presentation)/shared/providers/confirm-provider';

export function useConfirm() {
    const context = useSafetyContext(
        ConfirmContext,
        'ConfirmContext를 찾을 수 없습니다.'
    );

    const open = () => {
        context.setIsOpen(true);
    };

    const show = (
        title: string,
        content: ReactNode,
        onConfirm: () => void | Promise<void>
    ) => {
        context.setModalData({ title, content, onConfirm });
        open();
    };

    return {
        show,
    };
}

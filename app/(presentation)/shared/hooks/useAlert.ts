import { ReactNode } from 'react';
import { useSafetyContext } from '@/(presentation)/shared/hooks/useSafetyContext';
import { AlertContext } from '@/(presentation)/shared/providers/alert-provider';

export function useAlert() {
    const context = useSafetyContext(
        AlertContext,
        'AlertContext를 찾을 수 없습니다.'
    );

    const open = () => {
        context.setIsOpen(true);
    };

    const show = (title: string, content: ReactNode) => {
        context.setModalData({ title, content });
        open();
    };

    return {
        show,
    };
}

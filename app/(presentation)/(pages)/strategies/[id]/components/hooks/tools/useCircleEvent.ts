import { useState } from 'react';
import { useCreateCircleMutation } from '@/(presentation)/(pages)/strategies/[id]/components/hooks/useCreateCircleMutation';

export function useCircleEvent(strategyId: string) {
    const { createCircle } = useCreateCircleMutation(strategyId);

    const [isPhaseSelectModalOpen, setIsPhaseSelectModalOpen] = useState(false);

    const phaseSelectModalOpen = () => {
        setIsPhaseSelectModalOpen(true);
    };

    const phaseSelectModalClose = () => {
        setIsPhaseSelectModalOpen(false);
    };

    const onCircleCreateConfirm = (
        phase: number,
        clickPosition: { x: number; y: number }
    ) => {
        const formData = new FormData();
        formData.set('phase', phase.toString());
        formData.set('position', JSON.stringify(clickPosition));

        createCircle(formData);

        phaseSelectModalClose();
    };

    return {
        isPhaseSelectModalOpen,
        phaseSelectModalOpen,
        phaseSelectModalClose,
        onCircleCreateConfirm,
    };
}

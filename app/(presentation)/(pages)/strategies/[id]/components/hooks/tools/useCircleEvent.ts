import { useState } from 'react';
import { useCreateCircleMutation } from '@/(presentation)/(pages)/strategies/[id]/components/hooks/useCreateCircleMutation';

export function useCircleEvent(strategyId: string) {
    const { createCircle } = useCreateCircleMutation(strategyId);

    const [isPhaseSelectModalOpen, setIsPhaseSelectModalOpen] = useState(false);
    const [position, setPosition] = useState<{ x: number; y: number }>({
        x: 0,
        y: 0,
    });

    const phaseSelectModalOpen = (position: { x: number; y: number }) => {
        setIsPhaseSelectModalOpen(true);
        setPosition(position);
    };

    const phaseSelectModalClose = () => {
        setIsPhaseSelectModalOpen(false);
    };

    const circleCreate = (phase: number) => {
        const formData = new FormData();
        formData.set('phase', phase.toString());
        formData.set('position', JSON.stringify(position));

        createCircle(formData);

        phaseSelectModalClose();
    };

    return {
        isPhaseSelectModalOpen,
        phaseSelectModalOpen,
        phaseSelectModalClose,
        circleCreate,
    };
}

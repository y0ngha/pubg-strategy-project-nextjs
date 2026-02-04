import { useState } from 'react';
import { useCreateCircleMutation } from '@/(presentation)/(pages)/strategies/[id]/hooks/mutations/create/useCreateCircleMutation';
import { useUpdateCircleMutation } from '@/(presentation)/(pages)/strategies/[id]/hooks/mutations/update/useUpdateCircleMutation';

export function useCircleEvent(strategyId: string) {
    const { createCircle: createCircleMutation } =
        useCreateCircleMutation(strategyId);
    const { updateCircle: updateCircleMutation } =
        useUpdateCircleMutation(strategyId);

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

    const createCircle = (phase: number) => {
        const formData = new FormData();
        formData.set('phase', phase.toString());
        formData.set('position', JSON.stringify(position));

        createCircleMutation(formData);

        phaseSelectModalClose();
    };

    const moveCircle = (
        circleId: string,
        position: { x: number; y: number }
    ) => {
        const formData = new FormData();
        formData.set('circleId', circleId);
        formData.set('position', JSON.stringify(position));

        updateCircleMutation(formData);
    };

    return {
        isPhaseSelectModalOpen,
        phaseSelectModalOpen,
        phaseSelectModalClose,
        createCircle,
        moveCircle,
    };
}

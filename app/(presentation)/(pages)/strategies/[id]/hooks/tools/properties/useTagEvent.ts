import { useCreateTagMutation } from '@/(presentation)/(pages)/strategies/[id]/hooks/mutations/create/useCreateTagMutation';
import { useState } from 'react';

export function useTagEvent(strategyId: string) {
    const { createTag } = useCreateTagMutation(strategyId);
    const { createTag: createTagMutation } = useCreateTagMutation(strategyId);

    const [isEnterTagContentModalOpen, setIsEnterTagContentModalOpen] =
        useState(false);

    const [position, setPosition] = useState<{ x: number; y: number }>({
        x: 0,
        y: 0,
    });

    const enterTagContentModalOpen = (position: { x: number; y: number }) => {
        setIsEnterTagContentModalOpen(true);
        setPosition(position);
    };

    const enterTagContentModalClose = () => {
        setIsEnterTagContentModalOpen(false);
    };

    const createTag = (content: string) => {
        const formData = new FormData();
        formData.set('content', content);
        formData.set('position', JSON.stringify(position));

        createTagMutation(formData);

        enterTagContentModalClose();
    };

    return {
        isEnterTagContentModalOpen,
        enterTagContentModalOpen,
        enterTagContentModalClose,
        createTag,
    };
}

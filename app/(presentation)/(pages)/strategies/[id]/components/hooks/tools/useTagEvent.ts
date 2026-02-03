import { useCreateTagMutation } from '@/(presentation)/(pages)/strategies/[id]/components/hooks/useCreateTagMutation';
import { useState } from 'react';

export function useTagEvent(strategyId: string) {
    const { createTag } = useCreateTagMutation(strategyId);
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

    const tagCreate = (content: string) => {
        const formData = new FormData();
        formData.set('content', content);
        formData.set('position', JSON.stringify(position));

        createTag(formData);

        enterTagContentModalClose();
    };

    return {
        isEnterTagContentModalOpen,
        enterTagContentModalOpen,
        enterTagContentModalClose,
        tagCreate,
    };
}

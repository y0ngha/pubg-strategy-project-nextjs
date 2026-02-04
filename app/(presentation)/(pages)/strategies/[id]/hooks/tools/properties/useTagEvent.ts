import { useCreateTagMutation } from '@/(presentation)/(pages)/strategies/[id]/hooks/mutations/create/useCreateTagMutation';
import { useState } from 'react';
import { useUpdateTagMutation } from '@/(presentation)/(pages)/strategies/[id]/hooks/mutations/update/useUpdateTagMutation';

export function useTagEvent(strategyId: string) {
    const { createTag: createTagMutation } = useCreateTagMutation(strategyId);
    const { updateTag: updateTagMutation } = useUpdateTagMutation(strategyId);

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

    const moveTag = (tagId: string, position: { x: number; y: number }) => {
        const formData = new FormData();
        formData.set('tagId', tagId);
        formData.set('position', JSON.stringify(position));

        updateTagMutation(formData);
    };

    return {
        isEnterTagContentModalOpen,
        enterTagContentModalOpen,
        enterTagContentModalClose,
        createTag,
        moveTag,
    };
}

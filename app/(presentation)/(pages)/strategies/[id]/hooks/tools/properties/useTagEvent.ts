import { useCreateTagMutation } from '@/(presentation)/(pages)/strategies/[id]/hooks/mutations/create/useCreateTagMutation';
import { useState } from 'react';
import { useUpdateTagMutation } from '@/(presentation)/(pages)/strategies/[id]/hooks/mutations/update/useUpdateTagMutation';
import { TagResponseDto } from '@/application/strategy/dto/strategy/get-strategy.dto';

export function useTagEvent(strategyId: string, tags: TagResponseDto[]) {
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

    const moveTag = (
        tagId: string,
        deltaPosition: { x: number; y: number }
    ) => {
        const tag = tags.find(tag => tag.id === tagId);

        if (!tag) {
            throw new Error('태그 ID로 태그를 찾을 수 없습니다.');
        }

        const position = {
            x: tag.position.x + deltaPosition.x,
            y: tag.position.y + deltaPosition.y,
        };

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

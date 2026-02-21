import { useCreateTagMutation } from '@/(presentation)/(pages)/strategies/[id]/hooks/mutations/create/useCreateTagMutation';
import React, { useState } from 'react';
import { TagResponseDto } from '@/application/strategy/dto/strategy/get-strategy.dto';
import { useDeleteTagMutation } from '@/(presentation)/(pages)/strategies/[id]/hooks/mutations/delete/useDeleteTagMutation';
import EnterTagContentModal from '@/(presentation)/(pages)/strategies/[id]/components/modals/enter-tag-content.modal';
import { PropertyClickPayload } from '@/(presentation)/(pages)/strategies/[id]/components/body/strategy-body.component';
import TagsLayer from '@/(presentation)/(pages)/strategies/[id]/components/tools/properties/tag-property.component';
import { useUpdateTagPositionMutation } from '@/(presentation)/(pages)/strategies/[id]/hooks/mutations/update/useUpdateTagPositionMutation';

export function useTagEvent(strategyId: string, tags: TagResponseDto[]) {
    const { createTag: createTagMutation } = useCreateTagMutation(strategyId);
    const { updateTagPosition: updateTagPositionMutation } =
        useUpdateTagPositionMutation(strategyId);

    const { deleteTag: deleteTagMutation } = useDeleteTagMutation(strategyId);

    const [isEnterTagContentModalOpen, setIsEnterTagContentModalOpen] =
        useState(false);

    const [position, setPosition] = useState<{ x: number; y: number }>({
        x: 0,
        y: 0,
    });

    const [selectedTagId, setSelectedTagId] = useState<string | undefined>(
        undefined
    );

    const toggleSelectedTagId = (id?: string) => {
        setSelectedTagId(prevState => {
            if (prevState === id) {
                return undefined;
            }

            return id;
        });
    };

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

        updateTagPositionMutation(formData);
    };

    const deleteTag = (tagId: string) => {
        const formData = new FormData();
        formData.set('tagId', tagId);

        deleteTagMutation(formData);
    };

    const Modal = () => (
        <EnterTagContentModal
            isOpen={isEnterTagContentModalOpen}
            onClose={enterTagContentModalClose}
            onConfirm={createTag}
        />
    );

    const Layer = ({
        isSelectable,
        handlePropertyClick,
    }: {
        isSelectable: boolean;
        handlePropertyClick: (props: PropertyClickPayload) => void;
    }) => (
        <TagsLayer
            isSelectable={isSelectable}
            selectedTagId={selectedTagId}
            onClick={handlePropertyClick}
            tags={tags}
            onMove={moveTag}
            onDelete={deleteTag}
        />
    );

    return {
        toggleSelectedTagId,
        enterTagContentModalOpen,
        EnterTagContentModal: Modal,
        TagsLayer: Layer,
    };
}

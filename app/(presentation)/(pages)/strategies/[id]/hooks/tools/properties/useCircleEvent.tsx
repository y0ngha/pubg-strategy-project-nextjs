import React, { useState } from 'react';
import { useCreateCircleMutation } from '@/(presentation)/(pages)/strategies/[id]/hooks/mutations/create/useCreateCircleMutation';
import { useUpdateCircleMutation } from '@/(presentation)/(pages)/strategies/[id]/hooks/mutations/update/useUpdateCircleMutation';
import { CircleResponseDto } from '@/application/strategy/dto/strategy/get-strategy.dto';
import { useDeleteCircleMutation } from '@/(presentation)/(pages)/strategies/[id]/hooks/mutations/delete/useDeleteCircleMutation';
import PhaseSelectModal from '@/(presentation)/(pages)/strategies/[id]/components/modals/phase-select.modal';

export function useCircleEvent(
    strategyId: string,
    circles: CircleResponseDto[]
) {
    const { createCircle: createCircleMutation } =
        useCreateCircleMutation(strategyId);
    const { updateCircle: updateCircleMutation } =
        useUpdateCircleMutation(strategyId);
    const { deleteCircle: deleteCircleMutation } =
        useDeleteCircleMutation(strategyId);

    const [isPhaseSelectModalOpen, setIsPhaseSelectModalOpen] = useState(false);
    const [position, setPosition] = useState<{ x: number; y: number }>({
        x: 0,
        y: 0,
    });

    const [selectedCircleId, setSelectedCircleId] = useState<
        string | undefined
    >(undefined);

    const toggleSelectedCircleId = (id?: string) => {
        setSelectedCircleId(prevState => {
            if (prevState === id) {
                return undefined;
            }

            return id;
        });
    };

    const findCircleById = (circleId: string) => {
        const circle = circles.find(circle => circle.id === circleId);

        if (!circle) {
            throw new Error('자기장 ID로 자기장을 찾을 수 없습니다.');
        }

        return circle;
    };

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
        deltaPosition: { x: number; y: number }
    ) => {
        const circle = findCircleById(circleId);

        const position = {
            x: circle.centerPosition.x + deltaPosition.x,
            y: circle.centerPosition.y + deltaPosition.y,
        };

        const formData = new FormData();
        formData.set('circleId', circleId);
        formData.set('centerPosition', JSON.stringify(position));

        updateCircleMutation(formData);
    };

    const deleteCircle = (circleId: string) => {
        const formData = new FormData();
        formData.set('circleId', circleId);

        deleteCircleMutation(formData);
    };

    const Modal = () => (
        <PhaseSelectModal
            isOpen={isPhaseSelectModalOpen}
            onClose={phaseSelectModalClose}
            onConfirm={createCircle}
        />
    );

    return {
        toggleSelectedCircleId,
        selectedCircleId,
        phaseSelectModalOpen,
        PhaseSelectModal: Modal,
        moveCircle,
        deleteCircle,
    };
}

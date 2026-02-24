import { useCreateEnemyTeamMutation } from '@/(presentation)/strategies/hooks/mutations/create/useCreateEnemyTeamMutation';
import React, { useState } from 'react';
import { EnemyTeamResponseDto } from '@/application/strategy/dto/strategy/get-strategy.dto';
import { useDeleteEnemyTeamMutation } from '@/(presentation)/strategies/hooks/mutations/delete/useDeleteEnemyTeamMutation';
import EnterTeamLabelModal from '@/(presentation)/strategies/modals/[id]/enter-team-label.modal';
import { PropertyClickPayload } from '@/(presentation)/strategies/components/[id]/body/strategy-body.component';
import EnemyTeamsLayer from '@/(presentation)/strategies/components/[id]/tools/properties/enemy-team-property.component';
import { useUpdateEnemyTeamPositionMutation } from '@/(presentation)/strategies/hooks/mutations/update/useUpdateEnemyTeamPositionMutation';

export function useEnemyTeamEvent(
    strategyId: string,
    enemyTeams: EnemyTeamResponseDto[]
) {
    const { createEnemyTeam: createEnemyTeamMutation } =
        useCreateEnemyTeamMutation(strategyId);
    const { updateEnemyTeamPosition: updateEnemyTeamPositionMutation } =
        useUpdateEnemyTeamPositionMutation(strategyId);
    const { deleteEnemyTeam: deleteEnemyTeamMutation } =
        useDeleteEnemyTeamMutation(strategyId);

    const [isEnterEnemyTeamLabelModalOpen, setIsEnterEnemyTeamLabelModalOpen] =
        useState(false);

    const [position, setPosition] = useState<{ x: number; y: number }>({
        x: 0,
        y: 0,
    });

    const [selectedEnemyTeamId, setSelectedEnemyTeamId] = useState<
        string | undefined
    >(undefined);

    const toggleSelectedEnemyTeamId = (id?: string) => {
        setSelectedEnemyTeamId(prevState => {
            if (prevState === id) {
                return undefined;
            }

            return id;
        });
    };

    const enterEnemyTeamLabelModalOpen = (position: {
        x: number;
        y: number;
    }) => {
        setIsEnterEnemyTeamLabelModalOpen(true);
        setPosition(position);
    };

    const enterEnemyTeamLabelModalClose = () => {
        setIsEnterEnemyTeamLabelModalOpen(false);
    };

    const createEnemyTeam = (teamLabel: string) => {
        const formData = new FormData();
        formData.set('teamLabel', teamLabel);
        formData.set('position', JSON.stringify(position));

        createEnemyTeamMutation(formData);

        enterEnemyTeamLabelModalClose();
    };

    const moveEnemyTeam = (
        enemyTeamId: string,
        deltaPosition: { x: number; y: number }
    ) => {
        const enemyTeam = enemyTeams.find(
            enemyTeam => enemyTeam.id === enemyTeamId
        );

        if (!enemyTeam) {
            throw new Error('적 팀 ID로 적 팀을 찾을 수 없습니다.');
        }

        const position = {
            x: enemyTeam.position.x + deltaPosition.x,
            y: enemyTeam.position.y + deltaPosition.y,
        };

        const formData = new FormData();
        formData.set('enemyTeamId', enemyTeamId);
        formData.set('position', JSON.stringify(position));

        updateEnemyTeamPositionMutation(formData);
    };

    const deleteEnemyTeam = (enemyTeamId: string) => {
        const formData = new FormData();
        formData.set('enemyTeamId', enemyTeamId);

        deleteEnemyTeamMutation(formData);
    };

    const Modal = () => (
        <EnterTeamLabelModal
            isOpen={isEnterEnemyTeamLabelModalOpen}
            onClose={enterEnemyTeamLabelModalClose}
            onConfirm={createEnemyTeam}
        />
    );

    const Layer = ({
        isSelectable,
        handlePropertyClick,
    }: {
        isSelectable: boolean;
        handlePropertyClick: (props: PropertyClickPayload) => void;
    }) => (
        <EnemyTeamsLayer
            isSelectable={isSelectable}
            selectedEnemyTeamId={selectedEnemyTeamId}
            onClick={handlePropertyClick}
            enemyTeams={enemyTeams}
            onMove={moveEnemyTeam}
            onDelete={deleteEnemyTeam}
        />
    );

    return {
        toggleSelectedEnemyTeamId,
        enterEnemyTeamLabelModalOpen,
        EnterTeamLabelModal: Modal,
        EnemyTeamsLayer: Layer,
    };
}

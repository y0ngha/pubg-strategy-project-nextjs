import { useCreateEnemyTeamMutation } from '@/(presentation)/(pages)/strategies/[id]/hooks/mutations/create/useCreateEnemyTeamMutation';
import { useState } from 'react';
import { useUpdateEnemyTeamMutation } from '@/(presentation)/(pages)/strategies/[id]/hooks/mutations/update/useUpdateEnemyTeamMutation';

export function useEnemyTeamEvent(strategyId: string) {
    const { createEnemyTeam: createEnemyTeamMutation } =
        useCreateEnemyTeamMutation(strategyId);
    const { updateEnemyTeam: updateEnemyTeamMutation } =
        useUpdateEnemyTeamMutation(strategyId);

    const [isEnterEnemyTeamLabelModalOpen, setIsEnterEnemyTeamLabelModalOpen] =
        useState(false);

    const [position, setPosition] = useState<{ x: number; y: number }>({
        x: 0,
        y: 0,
    });

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
        position: { x: number; y: number }
    ) => {
        const formData = new FormData();
        formData.set('enemyTeamId', enemyTeamId);
        formData.set('position', JSON.stringify(position));

        updateEnemyTeamMutation(formData);
    };

    return {
        isEnterEnemyTeamLabelModalOpen,
        enterEnemyTeamLabelModalOpen,
        enterEnemyTeamLabelModalClose,
        createEnemyTeam,
        moveEnemyTeam,
    };
}

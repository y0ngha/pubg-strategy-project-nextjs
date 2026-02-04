import { useCreateEnemyTeamMutation } from '@/(presentation)/(pages)/strategies/[id]/components/hooks/useCreateEnemyTeamMutation';
import { useState } from 'react';

export function useEnemyTeamEvent(strategyId: string) {
    const { createEnemyTeam } = useCreateEnemyTeamMutation(strategyId);
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

    const enemyTeamCreate = (teamLabel: string) => {
        const formData = new FormData();
        formData.set('teamLabel', teamLabel);
        formData.set('position', JSON.stringify(position));

        createEnemyTeam(formData);

        enterEnemyTeamLabelModalClose();
    };

    return {
        isEnterEnemyTeamLabelModalOpen,
        enterEnemyTeamLabelModalOpen,
        enterEnemyTeamLabelModalClose,
        enemyTeamCreate,
    };
}

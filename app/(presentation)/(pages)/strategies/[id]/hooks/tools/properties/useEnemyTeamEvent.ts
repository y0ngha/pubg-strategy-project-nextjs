import { useCreateEnemyTeamMutation } from '@/(presentation)/(pages)/strategies/[id]/hooks/mutations/create/useCreateEnemyTeamMutation';
import { useState } from 'react';
import { useUpdateEnemyTeamMutation } from '@/(presentation)/(pages)/strategies/[id]/hooks/mutations/update/useUpdateEnemyTeamMutation';
import { EnemyTeamResponseDto } from '@/application/strategy/dto/strategy/get-strategy.dto';
import { useDeleteEnemyTeamMutation } from '@/(presentation)/(pages)/strategies/[id]/hooks/mutations/delete/useDeleteEnemyTeamMutation';

export function useEnemyTeamEvent(
    strategyId: string,
    enemyTeams: EnemyTeamResponseDto[]
) {
    const { createEnemyTeam: createEnemyTeamMutation } =
        useCreateEnemyTeamMutation(strategyId);
    const { updateEnemyTeam: updateEnemyTeamMutation } =
        useUpdateEnemyTeamMutation(strategyId);
    const { deleteEnemyTeam: deleteEnemyTeamMutation } =
        useDeleteEnemyTeamMutation(strategyId);

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

        updateEnemyTeamMutation(formData);
    };

    const deleteEnemyTeam = (enemyTeamId: string) => {
        const formData = new FormData();
        formData.set('enemyTeamId', enemyTeamId);

        deleteEnemyTeamMutation(formData);
    };

    return {
        isEnterEnemyTeamLabelModalOpen,
        enterEnemyTeamLabelModalOpen,
        enterEnemyTeamLabelModalClose,
        createEnemyTeam,
        moveEnemyTeam,
        deleteEnemyTeam,
    };
}

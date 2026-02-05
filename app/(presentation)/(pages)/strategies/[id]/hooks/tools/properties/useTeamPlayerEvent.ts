import { useCreateTeamPlayerMutation } from '@/(presentation)/(pages)/strategies/[id]/hooks/mutations/create/useCreateTeamPlayerMutation';
import { useState } from 'react';
import { useUpdateTeamPlayerMutation } from '@/(presentation)/(pages)/strategies/[id]/hooks/mutations/update/useUpdateTeamPlayerMutation';
import { TeamPlayerResponseDto } from '@/application/strategy/dto/strategy/get-strategy.dto';
import { useDeleteTeamPlayerMutation } from '@/(presentation)/(pages)/strategies/[id]/hooks/mutations/delete/useDeleteTeamPlayerMutation';

export function useTeamPlayerEvent(
    strategyId: string,
    teamPlayers: TeamPlayerResponseDto[]
) {
    const { createTeamPlayer: createTeamPlayerMutation } =
        useCreateTeamPlayerMutation(strategyId);
    const { updateTeamPlayer: updateTeamPlayerMutation } =
        useUpdateTeamPlayerMutation(strategyId);
    const { deleteTeamPlayer: deleteTeamPlayerMutation } =
        useDeleteTeamPlayerMutation(strategyId);

    const [selectedTeamPlayerId, setSelectedTeamPlayerId] = useState<
        string | undefined
    >(undefined);

    const changeSelectedTeamPlayerId = (id: string) => {
        setSelectedTeamPlayerId(prevState => {
            if (prevState === id) {
                return undefined;
            }

            return id;
        });
    };

    const createTeamPlayer = (position: { x: number; y: number }) => {
        const formData = new FormData();
        formData.set('position', JSON.stringify(position));

        createTeamPlayerMutation(formData);
    };

    const moveTeamPlayer = (
        teamPlayerId: string,
        deltaPosition: { x: number; y: number }
    ) => {
        const teamPlayer = teamPlayers.find(
            teamPlayer => teamPlayer.id === teamPlayerId
        );

        if (!teamPlayer) {
            throw new Error('팀 플레이어 ID로 팀 플레이어를 찾을 수 없습니다.');
        }

        const position = {
            x: teamPlayer.position.x + deltaPosition.x,
            y: teamPlayer.position.y + deltaPosition.y,
        };

        const formData = new FormData();
        formData.set('teamPlayerId', teamPlayerId);
        formData.set('position', JSON.stringify(position));

        updateTeamPlayerMutation(formData);
    };

    const deleteTeamPlayer = (teamPlayerId: string) => {
        const formData = new FormData();
        formData.set('teamPlayerId', teamPlayerId);

        deleteTeamPlayerMutation(formData);
    };

    return {
        selectedTeamPlayerId,
        changeSelectedTeamPlayerId,
        createTeamPlayer,
        moveTeamPlayer,
        deleteTeamPlayer,
    };
}

import { useCreateTeamPlayerMutation } from '@/(presentation)/strategies/hooks/mutations/create/useCreateTeamPlayerMutation';
import React, { useState } from 'react';
import { useUpdateTeamPlayerPositionMutation } from '@/(presentation)/strategies/hooks/mutations/update/useUpdateTeamPlayerPositionMutation';
import { TeamPlayerResponseDto } from '@/application/strategy/dto/strategy/get-strategy.dto';
import { useDeleteTeamPlayerMutation } from '@/(presentation)/strategies/hooks/mutations/delete/useDeleteTeamPlayerMutation';
import { PropertyClickPayload } from '@/(presentation)/strategies/components/[id]/body/strategy-body.component';
import TeamPlayersLayer from '@/(presentation)/strategies/components/[id]/tools/properties/team-player-property.component';

export function useTeamPlayerEvent(
    strategyId: string,
    teamPlayers: TeamPlayerResponseDto[]
) {
    const { createTeamPlayer: createTeamPlayerMutation } =
        useCreateTeamPlayerMutation(strategyId);
    const { updateTeamPlayerPosition: updateTeamPlayerPositionMutation } =
        useUpdateTeamPlayerPositionMutation(strategyId);
    const { deleteTeamPlayer: deleteTeamPlayerMutation } =
        useDeleteTeamPlayerMutation(strategyId);

    const [selectedTeamPlayerId, setSelectedTeamPlayerId] = useState<
        string | undefined
    >(undefined);

    const toggleSelectedTeamPlayerId = (id?: string) => {
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

        updateTeamPlayerPositionMutation(formData);
    };

    const deleteTeamPlayer = (teamPlayerId: string) => {
        const formData = new FormData();
        formData.set('teamPlayerId', teamPlayerId);

        deleteTeamPlayerMutation(formData);
    };

    const Layer = ({
        isSelectable,
        handlePropertyClick,
    }: {
        isSelectable: boolean;
        handlePropertyClick: (props: PropertyClickPayload) => void;
    }) => (
        <TeamPlayersLayer
            isSelectable={isSelectable}
            teamPlayers={teamPlayers}
            selectedTeamPlayerId={selectedTeamPlayerId}
            onClick={handlePropertyClick}
            onMove={moveTeamPlayer}
            onDelete={deleteTeamPlayer}
        />
    );

    return {
        toggleSelectedTeamPlayerId,
        createTeamPlayer,
        TeamPlayersLayer: Layer,
        selectedTeamPlayerId,
    };
}

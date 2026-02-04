import { useCreateTeamPlayerMutation } from '@/(presentation)/(pages)/strategies/[id]/hooks/mutations/create/useCreateTeamPlayerMutation';
import { useState } from 'react';
import { useUpdateTeamPlayerMutation } from '@/(presentation)/(pages)/strategies/[id]/hooks/mutations/update/useUpdateTeamPlayerMutation';

export function useTeamPlayerEvent(strategyId: string) {
    const { createTeamPlayer: createTeamPlayerMutation } =
        useCreateTeamPlayerMutation(strategyId);
    const { updateTeamPlayer: updateTeamPlayerMutation } =
        useUpdateTeamPlayerMutation(strategyId);

    const [selectedTeamPlayerId, setSelectedTeamPlayerId] = useState<
        string | undefined
    >(undefined);

    const createTeamPlayer = (position: { x: number; y: number }) => {
        const formData = new FormData();
        formData.set('position', JSON.stringify(position));

        createTeamPlayerMutation(formData);
    };

    const moveTeamPlayer = (
        teamPlayerId: string,
        position: { x: number; y: number }
    ) => {
        const formData = new FormData();
        formData.set('teamPlayerId', teamPlayerId);
        formData.set('position', JSON.stringify(position));

        updateTeamPlayerMutation(formData);
    };

    const changeSelectedTeamPlayerId = (id: string) => {
        setSelectedTeamPlayerId(prevState => {
            if (prevState === id) {
                return undefined;
            }

            return id;
        });
    };

    return {
        createTeamPlayer,
        moveTeamPlayer,
        selectedTeamPlayerId,
        changeSelectedTeamPlayerId,
    };
}

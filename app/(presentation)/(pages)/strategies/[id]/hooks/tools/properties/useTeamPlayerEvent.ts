import { useCreateTeamPlayerMutation } from '@/(presentation)/(pages)/strategies/[id]/hooks/mutations/create/useCreateTeamPlayerMutation';
import { useState } from 'react';

export function useTeamPlayerEvent(strategyId: string) {
    const { createTeamPlayer } = useCreateTeamPlayerMutation(strategyId);
    const { createTeamPlayer: createTeamPlayerMutation } =
        useCreateTeamPlayerMutation(strategyId);

    const [selectedTeamPlayerId, setSelectedTeamPlayerId] = useState<
        string | undefined
    >(undefined);

    const createTeamPlayer = (position: { x: number; y: number }) => {
        const formData = new FormData();
        formData.set('position', JSON.stringify(position));

        createTeamPlayerMutation(formData);
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
        teamPlayerCreate,
        createTeamPlayer,
        selectedTeamPlayerId,
        changeSelectedTeamPlayerId,
    };
}

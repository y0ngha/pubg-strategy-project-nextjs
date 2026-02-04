import { useCreateTeamPlayerMutation } from '@/(presentation)/(pages)/strategies/[id]/hooks/mutations/create/useCreateTeamPlayerMutation';
import { CanvasTool } from '@/(presentation)/(pages)/strategies/[id]/hooks/tools/useToolbar';
import { useState } from 'react';

export function useTeamPlayerEvent(
    strategyId: string,
    selectedTool: CanvasTool
) {
    const { createTeamPlayer } = useCreateTeamPlayerMutation(strategyId);
    const [selectedTeamPlayerId, setSelectedTeamPlayerId] = useState<
        string | undefined
    >(undefined);

    const teamPlayerCreate = (position: { x: number; y: number }) => {
        const formData = new FormData();
        formData.set('position', JSON.stringify(position));

        createTeamPlayer(formData);
    };

    const isClickableTeamPlayer = selectedTool === 'select';

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
        selectedTeamPlayerId,
        isClickableTeamPlayer,
        changeSelectedTeamPlayerId,
    };
}

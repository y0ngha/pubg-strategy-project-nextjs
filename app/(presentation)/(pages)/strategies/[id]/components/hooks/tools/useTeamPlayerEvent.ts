import { useCreateTeamPlayerMutation } from '@/(presentation)/(pages)/strategies/[id]/components/hooks/useCreateTeamPlayerMutation';

export function useTeamPlayerEvent(strategyId: string) {
    const { createTeamPlayer } = useCreateTeamPlayerMutation(strategyId);

    const teamPlayerCreate = (position: { x: number; y: number }) => {
        const formData = new FormData();
        formData.set('position', JSON.stringify(position));

        createTeamPlayer(formData);
    };

    return {
        teamPlayerCreate,
    };
}

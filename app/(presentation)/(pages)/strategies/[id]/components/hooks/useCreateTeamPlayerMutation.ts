import { getQueryClient } from '@/(presentation)/shared/helpers/query-client.helpers';
import { useMutation } from '@tanstack/react-query';
import { addTeamPlayerAction } from '@/(presentation)/strategy/actions/team-player/add-team-player.action';
import { useGetCurrentUser } from '@/(presentation)/shared/hooks/useGetCurrentUser';
import { toast } from 'react-toastify';
import { ReactQueryKeys } from '@/(presentation)/shared/constants/react-query-keys';
import { GetStrategyAction } from '@/(presentation)/strategy/actions/get-strategy.action';

export function useCreateTeamPlayerMutation(strategyId: string) {
    const queryClient = getQueryClient();
    const user = useGetCurrentUser();

    const { mutate } = useMutation({
        mutationFn: async () => {
            const formData = new FormData();

            formData.set('userId', user.data?.id ?? '');
            formData.set('strategyId', strategyId);

            return await addTeamPlayerAction(formData);
        },
        onSuccess: data => {
            const strataegyQueryKey = [ReactQueryKeys.STRATIGES, strategyId];

            queryClient.invalidateQueries({
                queryKey: [user.data?.id, ReactQueryKeys.STRATIGES],
            });

            queryClient.setQueryData<GetStrategyAction>(
                strataegyQueryKey,
                oldStrategy => {
                    if (!oldStrategy) {
                        return undefined;
                    }

                    return {
                        ...oldStrategy,
                        teamPlayers: [
                            ...oldStrategy.teamPlayers,
                            {
                                id: data.id,
                                priority: data.priority,
                                position: data.position,
                                color: data.color,
                            },
                        ],
                    };
                }
            );
        },
        onError: error => {
            console.error('useCreateTeamPlayerMutation', error);
            toast.error(
                error.message ??
                    '알 수 없는 오류로 팀 플레이어 생성에 실패했습니다.'
            );
        },
    });

    return {
        createTeamPlayer: mutate,
    };
}

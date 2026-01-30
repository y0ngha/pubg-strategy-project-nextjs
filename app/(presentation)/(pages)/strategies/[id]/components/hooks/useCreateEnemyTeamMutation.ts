import { getQueryClient } from '@/(presentation)/shared/helpers/query-client.helpers';
import { useMutation } from '@tanstack/react-query';
import { useGetCurrentUser } from '@/(presentation)/shared/hooks/useGetCurrentUser';
import { toast } from 'react-toastify';
import { ReactQueryKeys } from '@/(presentation)/shared/constants/react-query-keys';
import { GetStrategyAction } from '@/(presentation)/strategy/actions/get-strategy.action';
import { addEnemyTeamAction } from '@/(presentation)/strategy/actions/enemy-team/add-enemy-team.action';

export function useCreateEnemyTeamMutation(strategyId: string) {
    const queryClient = getQueryClient();
    const user = useGetCurrentUser();

    const { mutate } = useMutation({
        mutationFn: async () => {
            const formData = new FormData();

            formData.set('userId', user.data?.id ?? '');
            formData.set('strategyId', strategyId);

            return await addEnemyTeamAction(formData);
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
                        enemyTeams: [
                            ...oldStrategy.enemyTeams,
                            {
                                id: data.id,
                                teamLabel: data.teamLabel,
                                position: data.position,
                            },
                        ],
                    };
                }
            );
        },
        onError: error => {
            console.error('useCreateEnemyTeamMutation', error);
            toast.error(
                error.message ?? '알 수 없는 오류로 적 팀 생성에 실패했습니다.'
            );
        },
    });

    return {
        createEnemyTeam: mutate,
    };
}

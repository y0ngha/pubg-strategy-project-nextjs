import { getQueryClient } from '@/(presentation)/shared/helpers/query-client.helpers';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { ReactQueryKeys } from '@/(presentation)/shared/constants/react-query-keys';
import { GetStrategyAction } from '@/(presentation)/strategy/actions/strategy/get-strategy.action';
import {
    UpdateEnemyTeamPositionAction,
    updateEnemyTeamPositionAction,
} from '@/(presentation)/strategy/actions/enemy-team/update-enemy-team-position.action';
import { QueryKey } from '@tanstack/query-core';
import { useGetCurrentUser } from '@/(presentation)/shared/hooks/useGetCurrentUser';

export function useUpdateEnemyTeamPositionMutation(strategyId: string) {
    const { data: user } = useGetCurrentUser();
    const queryClient = getQueryClient();

    const strategyQueryKey: QueryKey = [ReactQueryKeys.STRATIGIES, strategyId];
    const strategiesQueryKey: QueryKey = [
        user?.id,
        ReactQueryKeys.STRATEGIES_ALL,
    ];

    const { mutate } = useMutation({
        mutationFn: async (formData: FormData) => {
            formData.set('strategyId', strategyId);

            return await updateEnemyTeamPositionAction(formData);
        },
        onSuccess: data => {
            cacheUpdate(strategyQueryKey, data);

            queryClient.invalidateQueries({
                queryKey: strategiesQueryKey,
            });
        },
        onError: error => {
            queryClient.invalidateQueries({
                queryKey: strategyQueryKey,
            });

            console.error('useUpdateEnemyTeamPositionMutation', error);
            toast.error(
                error.message ?? '알 수 없는 오류로 적 팀 수정에 실패했습니다.'
            );
        },
    });

    const cacheUpdate = (
        queryKey: QueryKey,
        data: UpdateEnemyTeamPositionAction
    ) => {
        queryClient.setQueryData<GetStrategyAction>(queryKey, oldStrategy => {
            if (!oldStrategy) {
                return undefined;
            }

            return {
                ...oldStrategy,
                enemyTeams: oldStrategy.enemyTeams.map(enemyTeam => {
                    if (enemyTeam.id === data.id) {
                        return {
                            ...enemyTeam,
                            id: data.id,
                            position: data.position,
                        };
                    }

                    return enemyTeam;
                }),
            };
        });
    };

    return {
        updateEnemyTeamPosition: mutate,
    };
}

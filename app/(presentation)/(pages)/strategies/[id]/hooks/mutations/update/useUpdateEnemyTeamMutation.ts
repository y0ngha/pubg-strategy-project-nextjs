import { getQueryClient } from '@/(presentation)/shared/helpers/query-client.helpers';
import { useMutation } from '@tanstack/react-query';
import { useGetCurrentUser } from '@/(presentation)/shared/hooks/useGetCurrentUser';
import { toast } from 'react-toastify';
import { ReactQueryKeys } from '@/(presentation)/shared/constants/react-query-keys';
import { GetStrategyAction } from '@/(presentation)/strategy/actions/get-strategy.action';
import {
    UpdateEnemyTeamAction,
    updateEnemyTeamAction,
} from '@/(presentation)/strategy/actions/enemy-team/update-enemy-team.action';
import { QueryKey } from '@tanstack/query-core';

export function useUpdateEnemyTeamMutation(strategyId: string) {
    const queryClient = getQueryClient();
    const user = useGetCurrentUser();

    const strategyQueryKey: QueryKey = [ReactQueryKeys.STRATIGES, strategyId];
    const strategiesQueryKey: QueryKey = [
        user.data?.id,
        ReactQueryKeys.STRATIGES,
    ];

    const { mutate } = useMutation({
        mutationFn: async (formData: FormData) => {
            formData.set('userId', user.data?.id ?? '');
            formData.set('strategyId', strategyId);

            return await updateEnemyTeamAction(formData);
        },
        onSuccess: data => {
            cacheUpdate([ReactQueryKeys.STRATIGES, strategyId], data);

            queryClient.invalidateQueries({
                queryKey: strategiesQueryKey,
            });
        },
        onError: error => {
            queryClient.invalidateQueries({
                queryKey: strategyQueryKey,
            });

            console.error('useUpdateEnemyTeamMutation', error);
            toast.error(
                error.message ?? '알 수 없는 오류로 적 팀 수정에 실패했습니다.'
            );
        },
    });

    const cacheUpdate = (queryKey: QueryKey, data: UpdateEnemyTeamAction) => {
        queryClient.setQueryData<GetStrategyAction>(queryKey, oldStrategy => {
            if (!oldStrategy) {
                return undefined;
            }

            return {
                ...oldStrategy,
                enemyTeams: oldStrategy.enemyTeams.map(enemyTeam => {
                    if (enemyTeam.id === data.id) {
                        return {
                            id: data.id,
                            teamLabel: data.teamLabel,
                            position: data.position,
                        };
                    }

                    return enemyTeam;
                }),
            };
        });
    };

    return {
        updateEnemyTeam: mutate,
    };
}

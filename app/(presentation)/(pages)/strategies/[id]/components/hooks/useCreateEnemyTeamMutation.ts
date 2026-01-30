import { getQueryClient } from '@/(presentation)/shared/helpers/query-client.helpers';
import { useMutation } from '@tanstack/react-query';
import { useGetCurrentUser } from '@/(presentation)/shared/hooks/useGetCurrentUser';
import { toast } from 'react-toastify';
import { ReactQueryKeys } from '@/(presentation)/shared/constants/react-query-keys';
import { GetStrategyAction } from '@/(presentation)/strategy/actions/get-strategy.action';
import {
    AddEnemyTeamAction,
    addEnemyTeamAction,
} from '@/(presentation)/strategy/actions/enemy-team/add-enemy-team.action';
import { QueryKey } from '@tanstack/query-core';

export function useCreateEnemyTeamMutation(strategyId: string) {
    const queryClient = getQueryClient();
    const user = useGetCurrentUser();

    const { mutate } = useMutation({
        mutationFn: async (formData: FormData) => {
            formData.set('userId', user.data?.id ?? '');
            formData.set('strategyId', strategyId);

            return await addEnemyTeamAction(formData);
        },
        onSuccess: data => {
            optimisticUpdate([ReactQueryKeys.STRATIGES, strategyId], data);

            queryClient.invalidateQueries({
                queryKey: [user.data?.id, ReactQueryKeys.STRATIGES],
            });
        },
        onError: error => {
            console.error('useCreateEnemyTeamMutation', error);
            toast.error(
                error.message ?? '알 수 없는 오류로 적 팀 생성에 실패했습니다.'
            );
        },
    });

    const optimisticUpdate = (queryKey: QueryKey, data: AddEnemyTeamAction) => {
        queryClient.setQueryData<GetStrategyAction>(queryKey, oldStrategy => {
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
        });
    };

    return {
        createEnemyTeam: mutate,
    };
}

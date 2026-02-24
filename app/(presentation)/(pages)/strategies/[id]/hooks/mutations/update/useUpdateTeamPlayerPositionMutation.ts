import { getQueryClient } from '@/(presentation)/shared/helpers/query-client.helpers';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { ReactQueryKeys } from '@/(presentation)/shared/constants/react-query-keys';
import { GetStrategyAction } from '@/(presentation)/strategy/actions/strategy/get-strategy.action';
import { QueryKey } from '@tanstack/query-core';
import {
    updateTeamPlayerPositionAction,
    UpdateTeamPlayerPositionAction,
} from '@/(presentation)/strategy/actions/team-player/update-team-player-position.action';
import { useGetCurrentUser } from '@/(presentation)/shared/hooks/useGetCurrentUser';

export function useUpdateTeamPlayerPositionMutation(strategyId: string) {
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

            return await updateTeamPlayerPositionAction(formData);
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

            console.error('useUpdateTeamPlayerPositionMutation', error);
            toast.error(
                error.message ??
                    '알 수 없는 오류로 팀 플레이어 수정에 실패했습니다.'
            );
        },
    });

    const cacheUpdate = (
        queryKey: QueryKey,
        data: UpdateTeamPlayerPositionAction
    ) => {
        queryClient.setQueryData<GetStrategyAction>(queryKey, oldStrategy => {
            if (!oldStrategy) {
                return undefined;
            }

            return {
                ...oldStrategy,
                teamPlayers: oldStrategy.teamPlayers.map(teamPlayer => {
                    if (teamPlayer.id === data.id) {
                        return {
                            ...teamPlayer,
                            id: data.id,
                            position: data.position,
                        };
                    }

                    return teamPlayer;
                }),
            };
        });
    };

    return {
        updateTeamPlayerPosition: mutate,
    };
}

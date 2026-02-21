import { getQueryClient } from '@/(presentation)/shared/helpers/query-client.helpers';
import { useMutation } from '@tanstack/react-query';
import {
    AddTeamPlayerAction,
    addTeamPlayerAction,
} from '@/(presentation)/strategy/actions/team-player/add-team-player.action';
import { toast } from 'react-toastify';
import { ReactQueryKeys } from '@/(presentation)/shared/constants/react-query-keys';
import { GetStrategyAction } from '@/(presentation)/strategy/actions/strategy/get-strategy.action';
import { QueryKey } from '@tanstack/query-core';

export function useCreateTeamPlayerMutation(strategyId: string) {
    const queryClient = getQueryClient();

    const strategyQueryKey: QueryKey = [ReactQueryKeys.STRATIGES, strategyId];
    const strategiesQueryKey: QueryKey = [ReactQueryKeys.STRATIGES_ALL];

    const { mutate } = useMutation({
        mutationFn: async (formData: FormData) => {
            formData.set('strategyId', strategyId);

            return await addTeamPlayerAction(formData);
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

            console.error('useCreateTeamPlayerMutation', error);
            toast.error(
                error.message ??
                    '알 수 없는 오류로 팀 플레이어 생성에 실패했습니다.'
            );
        },
    });

    const cacheUpdate = (queryKey: QueryKey, data: AddTeamPlayerAction) => {
        queryClient.setQueryData<GetStrategyAction>(queryKey, oldStrategy => {
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
        });
    };

    return {
        createTeamPlayer: mutate,
    };
}

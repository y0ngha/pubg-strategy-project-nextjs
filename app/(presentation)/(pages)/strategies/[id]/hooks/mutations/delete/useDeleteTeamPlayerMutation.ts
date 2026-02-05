import { getQueryClient } from '@/(presentation)/shared/helpers/query-client.helpers';
import { useMutation } from '@tanstack/react-query';
import { useGetCurrentUser } from '@/(presentation)/shared/hooks/useGetCurrentUser';
import { ReactQueryKeys } from '@/(presentation)/shared/constants/react-query-keys';
import { GetStrategyAction } from '@/(presentation)/strategy/actions/get-strategy.action';
import { toast } from 'react-toastify';
import { QueryKey } from '@tanstack/query-core';
import { parseFormData } from '@/(presentation)/shared/helpers/form-data.helper';
import { deleteTeamPlayerAction } from '@/(presentation)/strategy/actions/team-player/delete-team-player.action';

export function useDeleteTeamPlayerMutation(strategyId: string) {
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

            return await deleteTeamPlayerAction(formData);
        },
        onMutate: variables => {
            const previousStrategy =
                queryClient.getQueryData<GetStrategyAction>(strategyQueryKey);

            const { teamPlayerId } = parseFormData(variables, [
                {
                    key: 'teamPlayerId',
                    type: 'string',
                    error: '삭제한 팀 플레이어 고유 식별자를 불러오지 못했습니다.',
                },
            ] as const);

            optimisticUpdate(strategyQueryKey, teamPlayerId);

            return { previousStrategy };
        },
        onError: (error, _, onMutateResult) => {
            if (onMutateResult?.previousStrategy) {
                queryClient.setQueryData(
                    strategyQueryKey,
                    onMutateResult.previousStrategy
                );
            }

            console.error('useDeleteTeamPlayerMutation', error);
            toast.error(
                error.message ??
                    '알 수 없는 오류로 팀 플레이어 삭제에 실패했습니다.'
            );
        },
        onSettled: () => {
            queryClient.invalidateQueries({
                queryKey: strategyQueryKey,
            });

            queryClient.invalidateQueries({
                queryKey: strategiesQueryKey,
            });
        },
    });

    const optimisticUpdate = (queryKey: QueryKey, teamPlayerId: string) => {
        queryClient.setQueryData<GetStrategyAction>(queryKey, oldStrategy => {
            if (!oldStrategy) {
                return undefined;
            }

            return {
                ...oldStrategy,
                teamPlayers: oldStrategy.teamPlayers.filter(
                    teamPlayer => teamPlayer.id !== teamPlayerId
                ),
            };
        });
    };

    return {
        deleteTeamPlayer: mutate,
    };
}

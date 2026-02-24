import { getQueryClient } from '@/(presentation)/shared/helpers/query-client.helpers';
import { useMutation } from '@tanstack/react-query';
import { ReactQueryKeys } from '@/(presentation)/shared/constants/react-query-keys';
import { GetStrategyAction } from '@/(presentation)/strategy/actions/strategy/get-strategy.action';
import { toast } from 'react-toastify';
import { QueryKey } from '@tanstack/query-core';
import { parseFormData } from '@/(presentation)/shared/helpers/form-data.helper';
import { deleteWaypointAction } from '@/(presentation)/strategy/actions/waypoint/delete-waypoint.action';
import { TeamPlayerResponseDto } from '@/application/strategy/dto/strategy/get-strategy.dto';
import { useGetCurrentUser } from '@/(presentation)/shared/hooks/useGetCurrentUser';

export function useDeleteWaypointMutation(strategyId: string) {
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

            return await deleteWaypointAction(formData);
        },
        onMutate: variables => {
            const previousStrategy =
                queryClient.getQueryData<GetStrategyAction>(strategyQueryKey);

            const { teamPlayerId } = parseFormData(variables, [
                {
                    key: 'teamPlayerId',
                    type: 'string',
                    error: '삭제한 웨이포인트의 팀 플레이어 고유 식별자를 불러오지 못했습니다.',
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

            console.error('useDeleteWaypointMutation', error);
            toast.error(
                error.message ??
                    '알 수 없는 오류로 웨이포인트 삭제에 실패했습니다.'
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

    const generateNewTeamPlayers = (
        teamPlayerId: string,
        teamPlayers: TeamPlayerResponseDto[]
    ) => {
        return teamPlayers.map(player => {
            if (teamPlayerId !== player.id) {
                return player;
            }

            return {
                ...player,
                waypoint: undefined,
            };
        });
    };

    const optimisticUpdate = (queryKey: QueryKey, teamPlayerId: string) => {
        queryClient.setQueryData<GetStrategyAction>(queryKey, oldStrategy => {
            if (!oldStrategy) {
                return undefined;
            }

            return {
                ...oldStrategy,
                teamPlayers: generateNewTeamPlayers(
                    teamPlayerId,
                    oldStrategy.teamPlayers
                ),
            };
        });
    };

    return {
        deleteWaypoint: mutate,
    };
}

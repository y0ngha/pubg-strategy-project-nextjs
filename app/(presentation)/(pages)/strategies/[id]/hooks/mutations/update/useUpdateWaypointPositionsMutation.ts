import { getQueryClient } from '@/(presentation)/shared/helpers/query-client.helpers';
import { useMutation } from '@tanstack/react-query';
import { ReactQueryKeys } from '@/(presentation)/shared/constants/react-query-keys';
import { toast } from 'react-toastify';
import { QueryKey } from '@tanstack/query-core';
import { GetStrategyAction } from '@/(presentation)/strategy/actions/strategy/get-strategy.action';
import {
    UpdateWaypointPositionsAction,
    updateWaypointPositionsAction,
} from '@/(presentation)/strategy/actions/waypoint/update-waypoint-positions.action';
import { TeamPlayerResponseDto } from '@/application/strategy/dto/strategy/get-strategy.dto';
import { useGetCurrentUser } from '@/(presentation)/shared/hooks/useGetCurrentUser';

export function useUpdateWaypointPositionsMutation(strategyId: string) {
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

            return await updateWaypointPositionsAction(formData);
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

            console.error('useUpdateWaypointPositionsMutation', error);
            toast.error(
                error.message ??
                    '알 수 없는 오류로 웨이포인트 생성에 실패했습니다.'
            );
        },
    });

    const generateNewTeamPlayers = (
        data: UpdateWaypointPositionsAction,
        teamPlayers: TeamPlayerResponseDto[]
    ) => {
        const { teamPlayerId } = data;

        return teamPlayers.map(player => {
            if (teamPlayerId !== player.id) {
                return player;
            }

            if (!player.waypoint) {
                return player;
            }

            return {
                ...player,
                waypoint: {
                    ...player.waypoint,
                    positions: data.positions,
                },
            };
        });
    };

    const cacheUpdate = (
        queryKey: QueryKey,
        data: UpdateWaypointPositionsAction
    ) => {
        queryClient.setQueryData<GetStrategyAction>(queryKey, oldStrategy => {
            if (!oldStrategy) {
                return undefined;
            }

            return {
                ...oldStrategy,
                teamPlayers: [
                    ...generateNewTeamPlayers(data, oldStrategy.teamPlayers),
                ],
            };
        });
    };

    return {
        updateWaypointPositions: mutate,
    };
}

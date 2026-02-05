import { getQueryClient } from '@/(presentation)/shared/helpers/query-client.helpers';
import { useGetCurrentUser } from '@/(presentation)/shared/hooks/useGetCurrentUser';
import { useMutation } from '@tanstack/react-query';
import { ReactQueryKeys } from '@/(presentation)/shared/constants/react-query-keys';
import { toast } from 'react-toastify';
import { QueryKey } from '@tanstack/query-core';
import { GetStrategyAction } from '@/(presentation)/strategy/actions/get-strategy.action';
import {
    UpdateWaypointAction,
    updateWaypointAction,
} from '@/(presentation)/strategy/actions/waypoint/update-waypoint.action';
import { TeamPlayerResponseDto } from '@/application/strategy/dto/strategy/get-strategy.dto';

export function useUpdateWaypointMutation(strategyId: string) {
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

            return await updateWaypointAction(formData);
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

            console.error('useUpdateWaypointMutation', error);
            toast.error(
                error.message ??
                    '알 수 없는 오류로 웨이포인트 생성에 실패했습니다.'
            );
        },
    });

    const generateNewTeamPlayers = (
        data: UpdateWaypointAction,
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

    const cacheUpdate = (queryKey: QueryKey, data: UpdateWaypointAction) => {
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
        updateWaypoint: mutate,
    };
}

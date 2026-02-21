import { getQueryClient } from '@/(presentation)/shared/helpers/query-client.helpers';
import { useMutation } from '@tanstack/react-query';
import { ReactQueryKeys } from '@/(presentation)/shared/constants/react-query-keys';
import { toast } from 'react-toastify';
import { QueryKey } from '@tanstack/query-core';
import { GetStrategyAction } from '@/(presentation)/strategy/actions/strategy/get-strategy.action';
import {
    AddWaypointAction,
    addWaypointAction,
} from '@/(presentation)/strategy/actions/waypoint/add-waypoint.action';
import { TeamPlayerResponseDto } from '@/application/strategy/dto/strategy/get-strategy.dto';

export function useCreateWaypointMutation(strategyId: string) {
    const queryClient = getQueryClient();

    const strategyQueryKey: QueryKey = [ReactQueryKeys.STRATIGIES, strategyId];
    const strategiesQueryKey: QueryKey = [ReactQueryKeys.STRATEGIES_ALL];

    const { mutate } = useMutation({
        mutationFn: async (formData: FormData) => {
            formData.set('strategyId', strategyId);

            return await addWaypointAction(formData);
        },
        onSuccess: data => {
            cacheUpdate([ReactQueryKeys.STRATIGIES, strategyId], data);

            queryClient.invalidateQueries({
                queryKey: strategiesQueryKey,
            });
        },
        onError: error => {
            queryClient.invalidateQueries({
                queryKey: strategyQueryKey,
            });

            console.error('useCreateWaypointMutation', error);
            toast.error(
                error.message ??
                    '알 수 없는 오류로 웨이포인트 생성에 실패했습니다.'
            );
        },
    });

    const findTeamPlayerIndexById = (
        teamPlayers: TeamPlayerResponseDto[],
        id: string
    ) => {
        const index = teamPlayers.findIndex(teamPlayer => teamPlayer.id === id);

        if (index === -1) {
            return null;
        }

        return index;
    };

    const generateNewTeamPlayers = (
        data: AddWaypointAction,
        teamPlayers: TeamPlayerResponseDto[]
    ) => {
        const { teamPlayerId } = data;

        const teamPlayerIndex = findTeamPlayerIndexById(
            teamPlayers,
            teamPlayerId
        );

        if (teamPlayerIndex === null) {
            return teamPlayers;
        }

        return teamPlayers.map((player, index) => {
            if (index !== teamPlayerIndex) {
                return player;
            }
            return {
                ...player,
                waypoint: {
                    id: data.id,
                    positions: data.positions,
                },
            };
        });
    };

    const cacheUpdate = (queryKey: QueryKey, data: AddWaypointAction) => {
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
        createWaypoint: mutate,
    };
}

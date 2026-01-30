import { getQueryClient } from '@/(presentation)/shared/helpers/query-client.helpers';
import { useGetCurrentUser } from '@/(presentation)/shared/hooks/useGetCurrentUser';
import { useMutation } from '@tanstack/react-query';
import { ReactQueryKeys } from '@/(presentation)/shared/constants/react-query-keys';
import { toast } from 'react-toastify';
import { QueryKey } from '@tanstack/query-core';
import { GetStrategyAction } from '@/(presentation)/strategy/actions/get-strategy.action';
import {
    AddWaypointAction,
    addWaypointAction,
} from '@/(presentation)/strategy/actions/waypoint/add-waypoint.action';
import { TeamPlayerResponseDto } from '@/application/strategy/dto/strategy/get-strategy.dto';

export function useCreateWaypointMutation(strategyId: string) {
    const queryClient = getQueryClient();
    const user = useGetCurrentUser();

    const { mutate } = useMutation({
        mutationFn: async (formData: FormData) => {
            formData.set('userId', user.data?.id ?? '');
            formData.set('strategyId', strategyId);

            return await addWaypointAction(formData);
        },
        onSuccess: data => {
            optimisticUpdate([ReactQueryKeys.STRATIGES, strategyId], data);

            queryClient.invalidateQueries({
                queryKey: [user.data?.id, ReactQueryKeys.STRATIGES],
            });
        },
        onError: error => {
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

    const optimisticUpdate = (queryKey: QueryKey, data: AddWaypointAction) => {
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

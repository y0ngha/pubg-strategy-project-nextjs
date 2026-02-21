import { getQueryClient } from '@/(presentation)/shared/helpers/query-client.helpers';
import { useMutation } from '@tanstack/react-query';
import { ReactQueryKeys } from '@/(presentation)/shared/constants/react-query-keys';
import { toast } from 'react-toastify';
import { QueryKey } from '@tanstack/query-core';
import { GetStrategyAction } from '@/(presentation)/strategy/actions/strategy/get-strategy.action';
import { TeamPlayerResponseDto } from '@/application/strategy/dto/strategy/get-strategy.dto';
import {
    UpdateMarkerPositionAction,
    updateMarkerPositionAction,
} from '@/(presentation)/strategy/actions/marker/update-marker-position.action';

export function useUpdateMarkerPositionMutation(strategyId: string) {
    const queryClient = getQueryClient();

    const strategyQueryKey: QueryKey = [ReactQueryKeys.STRATIGIES, strategyId];
    const strategiesQueryKey: QueryKey = [ReactQueryKeys.STRATEGIES_ALL];

    const { mutate } = useMutation({
        mutationFn: async (formData: FormData) => {
            formData.set('strategyId', strategyId);

            return await updateMarkerPositionAction(formData);
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

            console.error('useUpdateMarkerPositionMutation', error);
            toast.error(
                error.message ?? '알 수 없는 오류로 마커 수정에 실패했습니다.'
            );
        },
    });

    const generateNewTeamPlayers = (
        data: UpdateMarkerPositionAction,
        teamPlayers: TeamPlayerResponseDto[]
    ) => {
        const { teamPlayerId } = data;

        return teamPlayers.map(player => {
            if (teamPlayerId !== player.id) {
                return player;
            }

            if (!player.marker) {
                return player;
            }

            return {
                ...player,
                marker: {
                    ...player.marker,
                    position: data.position,
                },
            };
        });
    };

    const cacheUpdate = (
        queryKey: QueryKey,
        data: UpdateMarkerPositionAction
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
        updateMarkerPosition: mutate,
    };
}

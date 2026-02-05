import { getQueryClient } from '@/(presentation)/shared/helpers/query-client.helpers';
import { useMutation } from '@tanstack/react-query';
import { useGetCurrentUser } from '@/(presentation)/shared/hooks/useGetCurrentUser';
import { ReactQueryKeys } from '@/(presentation)/shared/constants/react-query-keys';
import { GetStrategyAction } from '@/(presentation)/strategy/actions/get-strategy.action';
import { toast } from 'react-toastify';
import { QueryKey } from '@tanstack/query-core';
import { parseFormData } from '@/(presentation)/shared/helpers/form-data.helper';
import { deleteMarkerAction } from '@/(presentation)/strategy/actions/marker/delete-marker.action';
import { TeamPlayerResponseDto } from '@/application/strategy/dto/strategy/get-strategy.dto';

export function useDeleteMarkerMutation(strategyId: string) {
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

            return await deleteMarkerAction(formData);
        },
        onMutate: variables => {
            const previousStrategy =
                queryClient.getQueryData<GetStrategyAction>(strategyQueryKey);

            const { teamPlayerId } = parseFormData(variables, [
                {
                    key: 'teamPlayerId',
                    type: 'string',
                    error: '삭제한 마커의 팀 플레이어 고유 식별자를 불러오지 못했습니다.',
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

            console.error('useDeleteMarkerMutation', error);
            toast.error(
                error.message ?? '알 수 없는 오류로 마커 삭제에 실패했습니다.'
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
                marker: undefined,
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
        deleteMarker: mutate,
    };
}

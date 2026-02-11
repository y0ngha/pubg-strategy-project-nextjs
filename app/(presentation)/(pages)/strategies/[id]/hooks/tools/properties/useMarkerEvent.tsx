import { useCreateMarkerMutation } from '@/(presentation)/(pages)/strategies/[id]/hooks/mutations/create/useCreateMarkerMutation';
import { toast } from 'react-toastify';
import { useUpdateMarkerMutation } from '@/(presentation)/(pages)/strategies/[id]/hooks/mutations/update/useUpdateMarkerMutation';
import { TeamPlayerResponseDto } from '@/application/strategy/dto/strategy/get-strategy.dto';
import { useDeleteMarkerMutation } from '@/(presentation)/(pages)/strategies/[id]/hooks/mutations/delete/useDeleteMarkerMutation';
import { useState } from 'react';
import { PropertyClickPayload } from '@/(presentation)/(pages)/strategies/[id]/components/body/strategy-body.component';
import MarkerProperty from '@/(presentation)/(pages)/strategies/[id]/components/tools/properties/marker-property.component';

export function useMarkerEvent(
    strategyId: string,
    teamPlayers: TeamPlayerResponseDto[],
    selectedTeamPlayerId?: string
) {
    const { createMarker: createMarkerMutation } =
        useCreateMarkerMutation(strategyId);
    const { updateMarker: updateMarkerMutation } =
        useUpdateMarkerMutation(strategyId);
    const { deleteMarker: deleteMarkerMutation } =
        useDeleteMarkerMutation(strategyId);

    const [selectedMarkerId, setSelectedMarkerId] = useState<
        | {
              teamPlayerId: string;
              id: string;
          }
        | undefined
    >(undefined);

    const selectedTeamPlayer = teamPlayers.find(
        player => player.id === selectedTeamPlayerId
    );

    const marker = selectedTeamPlayer?.marker;

    const ensureSelectedTeamPlayerId = () => {
        if (selectedTeamPlayerId === undefined) {
            throw new Error(
                "'선택 및 이동' 도구로 팀 플레이어를 먼저 선택하고, 마커를 이용해주세요."
            );
        }
    };

    const toggleSelectedMarkerId = (data?: {
        teamPlayerId: string;
        id: string;
    }) => {
        setSelectedMarkerId(prevState => {
            if (data === undefined) {
                return undefined;
            }

            if (prevState?.id === data.id) {
                return undefined;
            }

            return {
                teamPlayerId: data.teamPlayerId,
                id: data.id,
            };
        });
    };

    const saveMarker = (position: { x: number; y: number }) => {
        try {
            ensureSelectedTeamPlayerId();

            const formData = new FormData();
            formData.set('position', JSON.stringify(position));

            if (marker) {
                formData.set('markerId', marker.id);

                updateMarkerMutation(formData);
            } else {
                createMarkerMutation(formData);
            }
        } catch (error) {
            if (error instanceof Error) {
                toast.error(
                    error.message ??
                        '알 수 없는 오류로 마커 생성에 실패했습니다.'
                );
            } else {
                toast.error('알 수 없는 오류로 마커 생성에 실패했습니다.');
            }
        }
    };

    const moveMarker = (
        teamPlayerId: string,
        markerId: string,
        deltaPosition: { x: number; y: number }
    ) => {
        const teamPlayer = teamPlayers.find(
            teamPlayer => teamPlayer.id === teamPlayerId
        );

        if (!teamPlayer) {
            throw new Error('팀 플레이어 ID로 팀 플레이어를 찾을 수 없습니다.');
        }

        if (!teamPlayer.marker) {
            throw new Error('팀 플레이어의 마커를 찾을 수 없습니다.');
        }

        const position = {
            x: teamPlayer.marker.position.x + deltaPosition.x,
            y: teamPlayer.marker.position.y + deltaPosition.y,
        };

        const formData = new FormData();
        formData.set('teamPlayerId', teamPlayerId);
        formData.set('markerId', markerId);
        formData.set('position', JSON.stringify(position));

        updateMarkerMutation(formData);
    };

    const deleteMarker = (teamPlayerId: string, markerId: string) => {
        const formData = new FormData();
        formData.set('teamPlayerId', teamPlayerId);
        formData.set('markerId', markerId);

        deleteMarkerMutation(formData);
    };

    const isMarkerSelected = (teamPlayerId: string, markerId: string) => {
        return (
            selectedMarkerId?.teamPlayerId === teamPlayerId &&
            selectedMarkerId?.id === markerId
        );
    };

    const Layer = ({
        isSelectable,
        handlePropertyClick,
    }: {
        isSelectable: boolean;
        handlePropertyClick: (props: PropertyClickPayload) => void;
    }) =>
        teamPlayers.map(({ id, color, priority, marker }) => {
            if (!marker) {
                return <></>;
            }

            return (
                <MarkerProperty
                    key={`tp-${id}-marker`}
                    color={color}
                    priority={priority}
                    x={marker.position.x}
                    y={marker.position.y}
                    isSelectable={isSelectable}
                    isSelected={isMarkerSelected(id, marker.id)}
                    id={marker.id}
                    teamPlayerId={id}
                    onMove={moveMarker}
                    onDelete={deleteMarker}
                    onClick={handlePropertyClick}
                />
            );
        });

    return {
        toggleSelectedMarkerId,
        selectedMarkerId,
        saveMarker,
        moveMarker,
        deleteMarker,
        MarkersLayer: Layer,
    };
}

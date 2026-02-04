import { useCreateWaypointMutation } from '@/(presentation)/(pages)/strategies/[id]/hooks/mutations/create/useCreateWaypointMutation';
import { toast } from 'react-toastify';
import { useUpdateWaypointMutation } from '@/(presentation)/(pages)/strategies/[id]/hooks/mutations/update/useUpdateWaypointMutation';
import { TeamPlayerResponseDto } from '@/application/strategy/dto/strategy/get-strategy.dto';
import { useEffect, useEffectEvent, useState } from 'react';

export function useWaypointEvent(
    strategyId: string,
    teamPlayers: TeamPlayerResponseDto[],
    selectedTeamPlayerId?: string
) {
    const maxWaypoint = 6;

    const { createWaypoint } = useCreateWaypointMutation(strategyId);
    const { updateWaypoint } = useUpdateWaypointMutation(strategyId);

    const [keydownAlt, setKeydownAlt] = useState<boolean>(false);
    const [isDrawing, setIsDrawing] = useState<boolean>(false);

    const [clickedPositions, setClickedPositions] = useState<
        { x: number; y: number }[]
    >([]);

    const selectedTeamPlayer = teamPlayers.find(
        player => player.id === selectedTeamPlayerId
    );

    const existingWaypoint = selectedTeamPlayer?.waypoint !== undefined;

    const windowAltKeyCode = 'Alt';
    const macAltKeyCode = 'Meta';

    const waypointCreate = (position: { x: number; y: number }) => {
        try {
            ensureSelectedTeamPlayerId();
            ensurePressAltKey();

            setClickedPositions(prevState => {
                if (prevState.length === maxWaypoint) {
                    return prevState;
                }

                return [...prevState, position];
            });

            setIsDrawing(true);
        } catch (error) {
            if (error instanceof Error) {
                toast.error(
                    error.message ??
                        '알 수 없는 오류로 웨이포인트 생성에 실패했습니다.'
                );
            } else {
                toast.error(
                    '알 수 없는 오류로 웨이포인트 생성에 실패했습니다.'
                );
            }
        }
    };

    const confirm = (positions: { x: number; y: number }[]) => {
        const formData = new FormData();
        formData.set('positions', JSON.stringify(positions));

        if (existingWaypoint) {
            updateWaypoint(formData);
        } else {
            createWaypoint(formData);
        }
    };

    const altKeydownHandler = useEffectEvent((event: KeyboardEvent) => {
        if (event.key === windowAltKeyCode || event.key === macAltKeyCode) {
            setKeydownAlt(true);
            setClickedPositions([]);
        }
    });

    const altKeyupHandler = useEffectEvent((event: KeyboardEvent) => {
        if (event.key === windowAltKeyCode || event.key === macAltKeyCode) {
            setKeydownAlt(false);
            setIsDrawing(false);

            if (isDrawing && clickedPositions.length > 0) {
                confirm(clickedPositions);
            }
        }
    });

    const ensureSelectedTeamPlayerId = () => {
        if (selectedTeamPlayerId === undefined) {
            throw new Error(
                "'선택 및 이동' 도구로 팀 플레이어를 먼저 선택하고, 웨이포인트를 이용해주세요."
            );
        }
    };

    const ensurePressAltKey = () => {
        if (!keydownAlt) {
            throw new Error('Alt(Command)키를 누르고 웨이포인트를 그려주세요.');
        }
    };

    useEffect(() => {
        window.addEventListener('keydown', altKeydownHandler);
        window.addEventListener('keyup', altKeyupHandler);

        return () => {
            window.removeEventListener('keydown', altKeydownHandler);
            window.removeEventListener('keyup', altKeyupHandler);
        };
    }, []);

    return {
        waypointCreate,
        isDrawing,
        clickedPositions,
    };
}

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

    const { createWaypoint: createWaypointMutation } =
        useCreateWaypointMutation(strategyId);
    const { updateWaypoint: updateWaypointMutation } =
        useUpdateWaypointMutation(strategyId);

    const [keydownAlt, setKeydownAlt] = useState<boolean>(false);
    const [isDrawing, setIsDrawing] = useState<boolean>(false);

    const [clickedPositions, setClickedPositions] = useState<
        { x: number; y: number }[]
    >([]);

    const selectedTeamPlayer = teamPlayers.find(
        player => player.id === selectedTeamPlayerId
    );

    const waypoint = selectedTeamPlayer?.waypoint;

    const windowAltKeyCode = 'Alt';
    const macAltKeyCode = 'Meta';

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

    const createWaypoint = (position: { x: number; y: number }) => {
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

    const saveWaypoint = (positions: { x: number; y: number }[]) => {
        try {
            ensureSelectedTeamPlayerId();

            const formData = new FormData();

            formData.set('positions', JSON.stringify(positions));

            if (waypoint) {
                formData.set('waypointId', waypoint.id);

                updateWaypointMutation(formData);
            } else {
                createWaypointMutation(formData);
            }
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

    const moveWaypoint = (
        teamPlayerId: string,
        waypointId: string,
        deltaPosition: { x: number; y: number }
    ) => {
        const teamPlayer = teamPlayers.find(
            teamPlayer => teamPlayer.id === teamPlayerId
        );

        if (!teamPlayer) {
            throw new Error('팀 플레이어 ID로 팀 플레이어를 찾을 수 없습니다.');
        }

        if (!teamPlayer.waypoint) {
            throw new Error('팀 플레이어의 웨이포인트를 찾을 수 없습니다.');
        }

        const positions = teamPlayer.waypoint?.positions.map(position => {
            return {
                x: position.x + deltaPosition.x,
                y: position.y + deltaPosition.y,
            };
        });

        const formData = new FormData();
        formData.set('teamPlayerId', teamPlayerId);
        formData.set('waypointId', waypointId);
        formData.set('positions', JSON.stringify(positions));

        updateWaypointMutation(formData);
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
                saveWaypoint(clickedPositions);
            }
        }
    });

    useEffect(() => {
        window.addEventListener('keydown', altKeydownHandler);
        window.addEventListener('keyup', altKeyupHandler);

        return () => {
            window.removeEventListener('keydown', altKeydownHandler);
            window.removeEventListener('keyup', altKeyupHandler);
        };
    }, []);

    return {
        createWaypoint,
        isDrawing,
        clickedPositions,
        moveWaypoint,
    };
}

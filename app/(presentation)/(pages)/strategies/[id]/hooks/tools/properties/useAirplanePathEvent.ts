import { useState } from 'react';
import { useCreateAirplanePathMutation } from '@/(presentation)/(pages)/strategies/[id]/hooks/mutations/create/useCreateAirplanePathMutation';
import { useUpdateAirplanePathMutation } from '@/(presentation)/(pages)/strategies/[id]/hooks/mutations/update/useUpdateAirplanePathMutation';
import { AirplanePathResponseDto } from '@/application/strategy/dto/strategy/get-strategy.dto';
import { useDeleteAirplanePathMutation } from '@/(presentation)/(pages)/strategies/[id]/hooks/mutations/delete/useDeleteAirplanePathMutation';

export function useAirplanePathEvent(
    strategyId: string,
    airplanePath?: AirplanePathResponseDto
) {
    const { createAirplanePath: createAirplanePathMutation } =
        useCreateAirplanePathMutation(strategyId);
    const { updateAirplanePath: updateAirplanePathMutation } =
        useUpdateAirplanePathMutation(strategyId);
    const { deleteAirplanePath: deleteAirplanePathMutation } =
        useDeleteAirplanePathMutation(strategyId);

    const [startPosition, setStartPosition] = useState<
        | {
              x: number;
              y: number;
          }
        | undefined
    >(airplanePath?.startPosition);

    const [endPosition, setEndPosition] = useState<
        | {
              x: number;
              y: number;
          }
        | undefined
    >(airplanePath?.endPosition);

    const ensureHaveAirplanePath = () => {
        if (!airplanePath) {
            throw new Error('비행기 동선이 존재하지 않습니다.');
        }
    };

    const confirmOnSuccessCallbackHandler = (data: {
        startPosition: { x: number; y: number };
        endPosition: { x: number; y: number };
    }) => {
        setStartPosition(data.startPosition);
        setEndPosition(data.endPosition);
    };

    const confirmOnErrorCallbackHandler = () => {
        setStartPosition(airplanePath?.startPosition);
        setEndPosition(airplanePath?.endPosition);
    };

    const callbackOption = {
        onSuccess: confirmOnSuccessCallbackHandler,
        onError: confirmOnErrorCallbackHandler,
    };

    const createAirplanePath = (
        startPosition: {
            x: number;
            y: number;
        },
        endPosition: {
            x: number;
            y: number;
        }
    ) => {
        const formData = new FormData();
        formData.set('startPosition', JSON.stringify(startPosition));
        formData.set('endPosition', JSON.stringify(endPosition));

        createAirplanePathMutation(formData, callbackOption);
    };

    const updateAirplanePath = (
        airplanePathId: string,
        startPosition: {
            x: number;
            y: number;
        },
        endPosition: {
            x: number;
            y: number;
        }
    ) => {
        ensureHaveAirplanePath();

        const formData = new FormData();
        formData.set('airplanePathId', airplanePathId);
        formData.set('startPosition', JSON.stringify(startPosition));
        formData.set('endPosition', JSON.stringify(endPosition));

        updateAirplanePathMutation(formData, callbackOption);
    };

    const clickAirplanePath = (position: { x: number; y: number }) => {
        if (!startPosition || (startPosition && endPosition)) {
            setEndPosition(undefined);
            setStartPosition(position);

            return;
        }

        if (startPosition && !endPosition) {
            setEndPosition(position);
            if (airplanePath) {
                updateAirplanePath(airplanePath.id, startPosition, position);
            } else {
                createAirplanePath(startPosition, position);
            }
        }
    };

    const moveAirplanePath = (deltaPosition: { x: number; y: number }) => {
        ensureHaveAirplanePath();

        const startPosition = {
            x: airplanePath!.startPosition.x + deltaPosition.x,
            y: airplanePath!.startPosition.y + deltaPosition.y,
        };

        const endPosition = {
            x: airplanePath!.endPosition.x + deltaPosition.x,
            y: airplanePath!.endPosition.y + deltaPosition.y,
        };

        setStartPosition(startPosition);
        setEndPosition(endPosition);

        updateAirplanePath(airplanePath!.id, startPosition, endPosition);
    };

    const deleteAirplanePath = () => {
        ensureHaveAirplanePath();

        const formData = new FormData();
        formData.set('airplanePathId', airplanePath!.id);

        deleteAirplanePathMutation(formData);
    };

    return {
        startPosition,
        endPosition,
        clickAirplanePath,
        moveAirplanePath,
        deleteAirplanePath,
    };
}

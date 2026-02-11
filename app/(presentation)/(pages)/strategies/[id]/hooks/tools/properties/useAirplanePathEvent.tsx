import React, { useState } from 'react';
import { useCreateAirplanePathMutation } from '@/(presentation)/(pages)/strategies/[id]/hooks/mutations/create/useCreateAirplanePathMutation';
import { useUpdateAirplanePathMutation } from '@/(presentation)/(pages)/strategies/[id]/hooks/mutations/update/useUpdateAirplanePathMutation';
import { AirplanePathResponseDto } from '@/application/strategy/dto/strategy/get-strategy.dto';
import { useDeleteAirplanePathMutation } from '@/(presentation)/(pages)/strategies/[id]/hooks/mutations/delete/useDeleteAirplanePathMutation';
import { PropertyClickPayload } from '@/(presentation)/(pages)/strategies/[id]/components/body/strategy-body.component';
import AirplanePathLayer from '@/(presentation)/(pages)/strategies/[id]/components/tools/properties/airplane-path-property.component';

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

    const [selectedAirplanePathId, setSelectedAirplanePathId] = useState<
        string | undefined
    >(undefined);

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

    const toggleSelectedAirplanePathId = (id?: string) => {
        setSelectedAirplanePathId(prevState => {
            if (prevState === id) {
                return undefined;
            }

            return id;
        });
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

    const moveAirplanePath = (
        airplanePathId: string,
        deltaPosition: { x: number; y: number }
    ) => {
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

        updateAirplanePath(airplanePathId, startPosition, endPosition);
    };

    const deleteAirplanePath = (airplanePathId: string) => {
        ensureHaveAirplanePath();

        const formData = new FormData();
        formData.set('airplanePathId', airplanePathId);

        deleteAirplanePathMutation(formData);
    };

    const Layer = ({
        isSelectable,
        handlePropertyClick,
    }: {
        isSelectable: boolean;
        handlePropertyClick: (props: PropertyClickPayload) => void;
    }) => (
        <AirplanePathLayer
            id={airplanePath?.id}
            isSelectable={isSelectable}
            selectedAirplanePathId={selectedAirplanePathId}
            onClick={handlePropertyClick}
            startPosition={startPosition}
            endPosition={endPosition}
            onMove={moveAirplanePath}
            onDelete={deleteAirplanePath}
        />
    );

    return {
        toggleSelectedAirplanePathId,
        clickAirplanePath,
        AirplanePathLayer: Layer,
    };
}

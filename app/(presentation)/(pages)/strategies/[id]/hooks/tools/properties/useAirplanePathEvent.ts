import { useState } from 'react';
import { useCreateAirplanePathMutation } from '@/(presentation)/(pages)/strategies/[id]/hooks/mutations/create/useCreateAirplanePathMutation';
import { useUpdateAirplanePathMutation } from '@/(presentation)/(pages)/strategies/[id]/hooks/mutations/update/useUpdateAirplanePathMutation';

export function useAirplanePathEvent(
    strategyId: string,
    initialPosition?: {
        startPosition: {
            x: number;
            y: number;
        };
        endPosition: {
            x: number;
            y: number;
        };
    }
) {
    const { createAirplanePath } = useCreateAirplanePathMutation(strategyId);
    const { updateAirplanePath } = useUpdateAirplanePathMutation(strategyId);

    const isFirstCreate = initialPosition === undefined;

    const [startPosition, setStartPosition] = useState<
        | {
              x: number;
              y: number;
          }
        | undefined
    >(initialPosition?.startPosition);

    const [endPosition, setEndPosition] = useState<
        | {
              x: number;
              y: number;
          }
        | undefined
    >(initialPosition?.endPosition);

    const confirmOnSuccessCallbackHandler = (data: {
        startPosition: { x: number; y: number };
        endPosition: { x: number; y: number };
    }) => {
        setStartPosition(data.startPosition);
        setEndPosition(data.endPosition);
    };

    const confirmOnErrorCallbackHandler = () => {
        setStartPosition(initialPosition?.startPosition);
        setEndPosition(initialPosition?.endPosition);
    };

    const saveAirplanePath = (
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

        const callbackOption = {
            onSuccess: confirmOnSuccessCallbackHandler,
            onError: confirmOnErrorCallbackHandler,
        };

        if (isFirstCreate) {
            createAirplanePath(formData, callbackOption);
        } else {
            updateAirplanePath(formData, callbackOption);
        }
    };

    const clickAirplanePath = (position: { x: number; y: number }) => {
        if (!startPosition || (startPosition && endPosition)) {
            setEndPosition(undefined);
            setStartPosition(position);

            return;
        }

        if (startPosition && !endPosition) {
            setEndPosition(position);
            saveAirplanePath(startPosition, position);
        }
    };

    return {
        clickAirplanePath,
        startPosition,
        endPosition,
    };
}

import { useEffect, useState } from 'react';
import { useCreateAirplanePathMutation } from '@/(presentation)/(pages)/strategies/[id]/components/hooks/useCreateAirplanePathMutation';
import { useUpdateAirplanePathMutation } from '@/(presentation)/(pages)/strategies/[id]/components/hooks/useUpdateAirplanePathMutation';

const WAITING_FOR_START_POSITION = 0;
const WAITING_FOR_END_POSITION = 1;

type Step = typeof WAITING_FOR_START_POSITION | typeof WAITING_FOR_END_POSITION;

export function useAirplanePathEvent(
    strategyId: string,
    position?: {
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

    const [isFirstCreate, setIsFirstCreate] = useState<boolean>(
        position === undefined
    );

    const [startPosition, setStartPosition] = useState<
        | {
              x: number;
              y: number;
          }
        | undefined
    >(position?.startPosition);

    const [endPosition, setEndPosition] = useState<
        | {
              x: number;
              y: number;
          }
        | undefined
    >(position?.endPosition);

    const [step, setStep] = useState<Step>(WAITING_FOR_START_POSITION);

    const nextStep = () => {
        setStep(prevState =>
            prevState === WAITING_FOR_START_POSITION
                ? WAITING_FOR_END_POSITION
                : WAITING_FOR_START_POSITION
        );
    };

    const airplanePathCreate = () => {
        const formData = new FormData();
        formData.set('startPosition', JSON.stringify(startPosition));
        formData.set('endPosition', JSON.stringify(endPosition));

        if (isFirstCreate) {
            createAirplanePath(formData);
        } else {
            updateAirplanePath(formData);
        }
    };

    const clickAirplanePath = (position: { x: number; y: number }) => {
        if (step === WAITING_FOR_START_POSITION) {
            setEndPosition(undefined);
            setStartPosition(position);
        } else if (step === WAITING_FOR_END_POSITION) {
            setEndPosition(position);
            airplanePathCreate();
        }

        nextStep();
    };

    useEffect(() => {
        setIsFirstCreate(position === undefined);
    }, [position]);

    return {
        clickAirplanePath,
        startPosition,
        endPosition,
    };
}

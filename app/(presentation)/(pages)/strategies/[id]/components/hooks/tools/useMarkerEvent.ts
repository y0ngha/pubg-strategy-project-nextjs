import { useCreateMarkerMutation } from '@/(presentation)/(pages)/strategies/[id]/components/hooks/useCreateMarkerMutation';
import { toast } from 'react-toastify';

export function useMarkerEvent(
    strategyId: string,
    selectedTeamPlayerId?: string
) {
    const { createMarker } = useCreateMarkerMutation(strategyId);

    const markerCreate = (position: { x: number; y: number }) => {
        try {
            ensureSelectedTeamPlayerId();

            const formData = new FormData();
            formData.set('position', JSON.stringify(position));

            createMarker(formData);
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

    const ensureSelectedTeamPlayerId = () => {
        if (selectedTeamPlayerId === undefined) {
            throw new Error(
                "'선택 및 이동' 도구로 팀 플레이어를 먼저 선택하고, 마커를 이용해주세요."
            );
        }
    };

    return {
        markerCreate,
    };
}

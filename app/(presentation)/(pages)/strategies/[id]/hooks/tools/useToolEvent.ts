import { CanvasTool } from '@/(presentation)/(pages)/strategies/[id]/hooks/tools/useToolbar';
import { useCircleEvent } from '@/(presentation)/(pages)/strategies/[id]/hooks/tools/properties/useCircleEvent';
import { useAirplanePathEvent } from '@/(presentation)/(pages)/strategies/[id]/hooks/tools/properties/useAirplanePathEvent';
import { useEnemyTeamEvent } from '@/(presentation)/(pages)/strategies/[id]/hooks/tools/properties/useEnemyTeamEvent';
import { useTeamPlayerEvent } from '@/(presentation)/(pages)/strategies/[id]/hooks/tools/properties/useTeamPlayerEvent';
import { useTagEvent } from '@/(presentation)/(pages)/strategies/[id]/hooks/tools/properties/useTagEvent';
import { useMarkerEvent } from '@/(presentation)/(pages)/strategies/[id]/hooks/tools/properties/useMarkerEvent';
import { useWaypointEvent } from '@/(presentation)/(pages)/strategies/[id]/hooks/tools/properties/useWaypointEvent';
import { useCommentEvent } from '@/(presentation)/(pages)/strategies/[id]/hooks/tools/properties/useCommentEvent';
import {
    CommentResponseDto,
    TeamPlayerResponseDto,
} from '@/application/strategy/dto/strategy/get-strategy.dto';

export function useToolEvent(
    strategyId: string,
    selectedTool: CanvasTool,
    properties: {
        airplanePath?: {
            startPosition: {
                x: number;
                y: number;
            };
            endPosition: {
                x: number;
                y: number;
            };
        };
        teamPlayers: TeamPlayerResponseDto[];
        comments: CommentResponseDto[];
    }
) {
    const circleEvent = useCircleEvent(strategyId);

    const airplanePathEvent = useAirplanePathEvent(
        strategyId,
        properties.airplanePath
    );

    const enemyTeamEvent = useEnemyTeamEvent(strategyId);

    const teamPlayerEvent = useTeamPlayerEvent(strategyId);

    const tagEvent = useTagEvent(strategyId);

    const markerEvent = useMarkerEvent(
        strategyId,
        properties.teamPlayers,
        teamPlayerEvent.selectedTeamPlayerId
    );

    const waypointEvent = useWaypointEvent(
        strategyId,
        properties.teamPlayers,
        teamPlayerEvent.selectedTeamPlayerId
    );

    const commentEvent = useCommentEvent(strategyId, properties.comments);

    return {
        circle: circleEvent,
        airplane: airplanePathEvent,
        enemyTeam: enemyTeamEvent,
        teamPlayer: teamPlayerEvent,
        tag: tagEvent,
        marker: markerEvent,
        waypoint: waypointEvent,
        comment: commentEvent,
        isSelectable: selectedTool === 'select',
    };
}

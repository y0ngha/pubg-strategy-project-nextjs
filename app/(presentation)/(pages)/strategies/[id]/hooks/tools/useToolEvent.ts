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
    AirplanePathResponseDto,
    CircleResponseDto,
    CommentResponseDto,
    EnemyTeamResponseDto,
    TagResponseDto,
    TeamPlayerResponseDto,
} from '@/application/strategy/dto/strategy/get-strategy.dto';

export function useToolEvent(
    strategyId: string,
    selectedTool: CanvasTool,
    properties: {
        circles: CircleResponseDto[];
        airplanePath?: AirplanePathResponseDto;
        enemyTeams: EnemyTeamResponseDto[];
        teamPlayers: TeamPlayerResponseDto[];
        tags: TagResponseDto[];
        comments: CommentResponseDto[];
    }
) {
    const circleEvent = useCircleEvent(strategyId, properties.circles);

    const airplanePathEvent = useAirplanePathEvent(
        strategyId,
        properties.airplanePath
    );

    const enemyTeamEvent = useEnemyTeamEvent(strategyId, properties.enemyTeams);

    const teamPlayerEvent = useTeamPlayerEvent(
        strategyId,
        properties.teamPlayers
    );

    const tagEvent = useTagEvent(strategyId, properties.tags);

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

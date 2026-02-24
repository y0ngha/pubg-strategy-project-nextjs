'use client';

import {
    CANVAS_TOOLS,
    CanvasTool,
    useToolbar,
} from '@/(presentation)/strategies/hooks/tools/useToolbar';
import { useLucideIconToSvgUrl } from '@/(presentation)/shared/hooks/useLucideIconToSvgUrl';
import StrategyToolbar from '@/(presentation)/strategies/components/[id]/tools/strategy-toolbar.component';
import StrategyCanvas from '@/(presentation)/strategies/components/[id]/body/strategy-canvas.component';
import StrategyMapImage from '@/(presentation)/strategies/components/[id]/body/map/strategy-map-image.component';
import Konva from 'konva';
import React, { Ref } from 'react';
import {
    AirplanePathResponseDto,
    CircleResponseDto,
    CommentResponseDto,
    EnemyTeamResponseDto,
    TagResponseDto,
    TeamPlayerResponseDto,
} from '@/application/strategy/dto/strategy/get-strategy.dto';
import { useKonvaHandleMouseClick } from '@/(presentation)/strategies/hooks/konvas/useKonvaHandleMouseClick';
import { useToolEvent } from '@/(presentation)/strategies/hooks/tools/useToolEvent';
import { Layer } from 'react-konva';

interface SimplePropertyClickProps {
    id: string;
}

interface InTeamPlayerPropertyClickProps {
    teamPlayerId: string;
    id: string;
}

type InTeamPlayerProperties =
    | typeof CANVAS_TOOLS.marker
    | typeof CANVAS_TOOLS.waypoint;

type PropertyClickProps<T extends CanvasTool> = T extends InTeamPlayerProperties
    ? InTeamPlayerPropertyClickProps
    : SimplePropertyClickProps;

export type PropertyClickPayload = {
    [K in CanvasTool]: { type: K } & PropertyClickProps<K>;
}[CanvasTool];

export interface StrategyBodyProps {
    id: string;
    mapImage: string;
    stageRef: Ref<Konva.Stage>;
    handleMouseMove: () => void;
    circles: CircleResponseDto[];
    airplanePath?: AirplanePathResponseDto;
    enemyTeams: EnemyTeamResponseDto[];
    teamPlayers: TeamPlayerResponseDto[];
    tags: TagResponseDto[];
    comments: CommentResponseDto[];
}

function StrategyBody({
    id,
    mapImage,
    stageRef,
    handleMouseMove,
    circles,
    airplanePath,
    enemyTeams,
    teamPlayers,
    tags,
    comments,
}: StrategyBodyProps) {
    const {
        canvasToolGroup,
        canvasToolNames,
        canvasToolIcons,
        canvasToolCursor,
        changeTool,
        selectedTool,
        iconSize,
    } = useToolbar();

    const { url, center } = useLucideIconToSvgUrl(
        canvasToolCursor[selectedTool]
    );

    const {
        circle,
        airplane,
        enemyTeam,
        teamPlayer,
        tag,
        marker,
        waypoint,
        comment,
        isSelectable,
    } = useToolEvent(id, selectedTool, {
        circles: circles,
        airplanePath: airplanePath,
        enemyTeams: enemyTeams,
        teamPlayers: teamPlayers,
        tags: tags,
        comments: comments,
    });

    const { PhaseSelectModal, CirclesLayer } = circle;
    const { AirplanePathLayer } = airplane;
    const { EnterTeamLabelModal, EnemyTeamsLayer } = enemyTeam;
    const { TeamPlayersLayer } = teamPlayer;
    const { EnterTagContentModal, TagsLayer } = tag;
    const { MarkersLayer } = marker;
    const { WaypointsLayer } = waypoint;
    const { StrategyCommentWindow, CommentsLayer } = comment;

    const onMapClick = (
        clickPosition: { x: number; y: number },
        windowPosition: { x: number; y: number }
    ) => {
        switch (selectedTool) {
            case 'circle':
                return circle.phaseSelectModalOpen(clickPosition);
            case 'airplane':
                return airplane.drawAirplanePathPoint(clickPosition);
            case 'enemy':
                return enemyTeam.enterEnemyTeamLabelModalOpen(clickPosition);
            case 'team':
                return teamPlayer.createTeamPlayer(clickPosition);
            case 'marker':
                return marker.saveMarker(clickPosition);
            case 'waypoint':
                return waypoint.createWaypoint(clickPosition);
            case 'tag':
                return tag.enterTagContentModalOpen(clickPosition);
            case 'comment':
                return comment.commentWindowOpen(windowPosition, clickPosition);
        }
    };

    const disposeAllPropertySelected = () => {
        circle.toggleSelectedCircleId(undefined);
        airplane.toggleSelectedAirplanePathId(undefined);
        enemyTeam.toggleSelectedEnemyTeamId(undefined);
        teamPlayer.toggleSelectedTeamPlayerId(undefined);
        marker.toggleSelectedMarkerId(undefined);
        waypoint.toggleSelectedWaypointId(undefined);
        tag.toggleSelectedTagId(undefined);
        comment.toggleSelectedCommentId(undefined);
    };

    const handlePropertyClick = (props: PropertyClickPayload) => {
        disposeAllPropertySelected();

        switch (props.type) {
            case 'circle':
                return circle.toggleSelectedCircleId(props.id);
            case 'airplane':
                return airplane.toggleSelectedAirplanePathId(props.id);
            case 'enemy':
                return enemyTeam.toggleSelectedEnemyTeamId(props.id);
            case 'team':
                return teamPlayer.toggleSelectedTeamPlayerId(props.id);
            case 'marker':
                return marker.toggleSelectedMarkerId(props);
            case 'waypoint':
                return waypoint.toggleSelectedWaypointId(props);
            case 'tag':
                return tag.toggleSelectedTagId(props.id);
            case 'comment':
                return comment.toggleSelectedCommentId(props.id);
        }
    };

    const { handleClick } = useKonvaHandleMouseClick(
        (_, clickPosition, windowPosition) => {
            onMapClick(clickPosition, windowPosition);
            disposeAllPropertySelected();
        }
    );

    return (
        <div
            className={'flex h-full flex-1 flex-row'}
            style={{ cursor: `url('${url}') ${center} ${center}, auto` }}
        >
            <StrategyToolbar
                canvasToolGroup={canvasToolGroup}
                canvasToolNames={canvasToolNames}
                canvasToolIcons={canvasToolIcons}
                changeTool={changeTool}
                selectedTool={selectedTool}
                iconSize={iconSize}
            />

            <StrategyCanvas
                stageRef={stageRef}
                handleMouseMove={handleMouseMove}
                isDraggable={selectedTool === 'select'}
                map={
                    <Layer imageSmoothingEnabled={true}>
                        <StrategyMapImage src={mapImage} />
                    </Layer>
                }
                properties={
                    <Layer>
                        <CirclesLayer
                            isSelectable={isSelectable}
                            handlePropertyClick={handlePropertyClick}
                        />
                        <AirplanePathLayer
                            isSelectable={isSelectable}
                            handlePropertyClick={handlePropertyClick}
                        />
                        <EnemyTeamsLayer
                            isSelectable={isSelectable}
                            handlePropertyClick={handlePropertyClick}
                        />
                        <TeamPlayersLayer
                            isSelectable={isSelectable}
                            handlePropertyClick={handlePropertyClick}
                        />
                        <MarkersLayer
                            isSelectable={isSelectable}
                            handlePropertyClick={handlePropertyClick}
                        />
                        <WaypointsLayer
                            isSelectable={isSelectable}
                            handlePropertyClick={handlePropertyClick}
                        />
                        <TagsLayer
                            isSelectable={isSelectable}
                            handlePropertyClick={handlePropertyClick}
                        />
                        <CommentsLayer isSelectable={isSelectable} />
                    </Layer>
                }
                onMapClick={handleClick}
            />

            <EnterTagContentModal />
            <PhaseSelectModal />
            <EnterTeamLabelModal />
            <StrategyCommentWindow />
        </div>
    );
}

StrategyBody.displayName = 'StrategyBody';

export default React.memo(StrategyBody);

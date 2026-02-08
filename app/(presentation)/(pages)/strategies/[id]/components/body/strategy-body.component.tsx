'use client';

import {
    CANVAS_TOOLS,
    CanvasTool,
    useToolbar,
} from '@/(presentation)/(pages)/strategies/[id]/hooks/tools/useToolbar';
import { useLucideIconToSvgUrl } from '@/(presentation)/(pages)/strategies/[id]/hooks/utils/useLucideIconToSvgUrl';
import StrategyToolbar from '@/(presentation)/(pages)/strategies/[id]/components/tools/strategy-toolbar.component';
import StrategyCanvas from '@/(presentation)/(pages)/strategies/[id]/components/body/strategy-canvas.component';
import StrategyMapImage from '@/(presentation)/(pages)/strategies/[id]/components/body/map/strategy-map-image.component';
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
import PhaseSelectModal from '@/(presentation)/(pages)/strategies/[id]/components/modals/phase-select.modal';
import { useKonvaHandleMouseClick } from '@/(presentation)/(pages)/strategies/[id]/hooks/konvas/useKonvaHandleMouseClick';
import EnterTeamLabelModal from '@/(presentation)/(pages)/strategies/[id]/components/modals/enter-team-label.modal';
import EnterTagContentModal from '@/(presentation)/(pages)/strategies/[id]/components/modals/enter-tag-content.modal';
import CirclesLayer from '@/(presentation)/(pages)/strategies/[id]/components/tools/properties/circle-property.component';
import AirplanePathLayer from '@/(presentation)/(pages)/strategies/[id]/components/tools/properties/airplane-path-property.component';
import EnemyTeamsLayer from '@/(presentation)/(pages)/strategies/[id]/components/tools/properties/enemy-team-property.component';
import TeamPlayersLayer from '@/(presentation)/(pages)/strategies/[id]/components/tools/properties/team-player-property.component';
import TagsLayer from '@/(presentation)/(pages)/strategies/[id]/components/tools/properties/tag-property.component';
import CommentsLayer from '@/(presentation)/(pages)/strategies/[id]/components/tools/properties/comment-property.component';
import StrategyCommentWindow from '@/(presentation)/(pages)/strategies/[id]/components/modals/strategy-comment-window.modal';
import { useToolEvent } from '@/(presentation)/(pages)/strategies/[id]/hooks/tools/useToolEvent';
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

    const onMapClick = (
        clickPosition: { x: number; y: number },
        windowPosition: { x: number; y: number }
    ) => {
        switch (selectedTool) {
            case 'circle':
                return circle.phaseSelectModalOpen(clickPosition);
            case 'airplane':
                return airplane.clickAirplanePath(clickPosition);
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
                            selectedCircleId={circle.selectedCircleId}
                            onClick={handlePropertyClick}
                            circles={circles}
                            onMove={circle.moveCircle}
                            onDelete={circle.deleteCircle}
                        />
                        <AirplanePathLayer
                            id={airplanePath?.id}
                            isSelectable={isSelectable}
                            selectedAirplanePathId={
                                airplane.selectedAirplanePathId
                            }
                            onClick={handlePropertyClick}
                            startPosition={airplane.startPosition}
                            endPosition={airplane.endPosition}
                            onMove={airplane.moveAirplanePath}
                            onDelete={airplane.deleteAirplanePath}
                        />
                        <EnemyTeamsLayer
                            isSelectable={isSelectable}
                            selectedEnemyTeamId={enemyTeam.selectedEnemyTeamId}
                            onClick={handlePropertyClick}
                            enemyTeams={enemyTeams}
                            onMove={enemyTeam.moveEnemyTeam}
                            onDelete={enemyTeam.deleteEnemyTeam}
                        />
                        <TeamPlayersLayer
                            isSelectable={isSelectable}
                            teamPlayers={teamPlayers}
                            selectedTeamPlayerId={
                                teamPlayer.selectedTeamPlayerId
                            }
                            selectedMarkerId={marker.selectedMarkerId}
                            selectedWaypointId={waypoint.selectedWaypointId}
                            isWaypointDrawing={waypoint.isDrawing}
                            waypointClickedPositions={waypoint.clickedPositions}
                            onClick={handlePropertyClick}
                            onMarkerClick={handlePropertyClick}
                            onWaypointClick={handlePropertyClick}
                            onMove={teamPlayer.moveTeamPlayer}
                            onMarkerMove={marker.moveMarker}
                            onWaypointMove={waypoint.moveWaypoint}
                            onDelete={teamPlayer.deleteTeamPlayer}
                            onMarkerDelete={marker.deleteMarker}
                            onWaypointDelete={waypoint.deleteWaypoint}
                        />
                        <TagsLayer
                            isSelectable={isSelectable}
                            selectedTagId={tag.selectedTagId}
                            onClick={handlePropertyClick}
                            tags={tags}
                            onMove={tag.moveTag}
                            onDelete={tag.deleteTag}
                        />
                        <CommentsLayer
                            isSelectable={isSelectable}
                            comments={comments}
                            onClick={comment.commentClick}
                            onMove={comment.moveComment}
                        />
                    </Layer>
                }
                onMapClick={handleClick}
            />

            <PhaseSelectModal
                isOpen={circle.isPhaseSelectModalOpen}
                onClose={circle.phaseSelectModalClose}
                onConfirm={circle.createCircle}
            />

            <EnterTeamLabelModal
                isOpen={enemyTeam.isEnterEnemyTeamLabelModalOpen}
                onClose={enemyTeam.enterEnemyTeamLabelModalClose}
                onConfirm={enemyTeam.createEnemyTeam}
            />

            <EnterTagContentModal
                isOpen={tag.isEnterTagContentModalOpen}
                onClose={tag.enterTagContentModalClose}
                onConfirm={tag.createTag}
            />

            <StrategyCommentWindow
                key={JSON.stringify(comment.windowPosition)}
                isOpen={comment.isCommentWindowOpen}
                onClose={comment.commentWindowClose}
                comments={comment.filteredComments}
                onAddComment={comment.createComment}
                onUpdateComment={comment.updateComment}
                position={comment.windowPosition}
            />
        </div>
    );
}

StrategyBody.displayName = 'StrategyBody';

export default React.memo(StrategyBody);

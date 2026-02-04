'use client';

import { useToolbar } from '@/(presentation)/(pages)/strategies/[id]/hooks/tools/useToolbar';
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
        airplanePath: airplanePath,
        teamPlayers: teamPlayers,
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
                return teamPlayer.teamPlayerCreate(clickPosition);
            case 'marker':
                return marker.markerClick(clickPosition);
            case 'waypoint':
                return waypoint.waypointCreate(clickPosition);
            case 'tag':
                return tag.enterTagContentModalOpen(clickPosition);
            case 'comment':
                return comment.commentWindowOpen(windowPosition, clickPosition);
        }
    };

    const { handleClick } = useKonvaHandleMouseClick(
        (_, clickPosition, windowPosition) => {
            onMapClick(clickPosition, windowPosition);
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
                selectedTool={selectedTool}
                map={<StrategyMapImage src={mapImage} />}
                properties={
                    <>
                        <CirclesLayer
                            isSelectable={isSelectable}
                            circles={circles}
                        />
                        <AirplanePathLayer
                            isSelectable={isSelectable}
                            startPosition={airplane.startPosition}
                            endPosition={airplane.endPosition}
                        />
                        <EnemyTeamsLayer
                            isSelectable={isSelectable}
                            enemyTeams={enemyTeams}
                        />
                        <TeamPlayersLayer
                            isSelectable={isSelectable}
                            teamPlayers={teamPlayers}
                            selectedTeamPlayerId={
                                teamPlayer.selectedTeamPlayerId
                            }
                            changeSelectedTeamPlayerId={
                                teamPlayer.changeSelectedTeamPlayerId
                            }
                            isWaypointDrawing={waypoint.isDrawing}
                            waypointClickedPositions={waypoint.clickedPositions}
                        />
                        <TagsLayer isSelectable={isSelectable} tags={tags} />
                        <CommentsLayer
                            isSelectable={isSelectable}
                            comments={comments}
                            onClick={comment.commentClick}
                        />
                    </>
                }
                onMapClick={handleClick}
            />

            <PhaseSelectModal
                isOpen={circle.isPhaseSelectModalOpen}
                onClose={circle.phaseSelectModalClose}
                onConfirm={circle.circleCreate}
            />

            <EnterTeamLabelModal
                isOpen={enemyTeam.isEnterEnemyTeamLabelModalOpen}
                onClose={enemyTeam.enterEnemyTeamLabelModalClose}
                onConfirm={enemyTeam.enemyTeamCreate}
            />

            <EnterTagContentModal
                isOpen={tag.isEnterTagContentModalOpen}
                onClose={tag.enterTagContentModalClose}
                onConfirm={tag.tagCreate}
            />

            <StrategyCommentWindow
                key={JSON.stringify(comment.windowPosition)}
                isOpen={comment.isCommentWindowOpen}
                onClose={comment.commentWindowClose}
                comments={comment.filteredComments}
                onAddComment={comment.commentCreate}
                onUpdateComment={comment.commentUpdate}
                position={comment.windowPosition}
            />
        </div>
    );
}

StrategyBody.displayName = 'StrategyBody';

export default React.memo(StrategyBody);

'use client';

import { useToolbar } from '@/(presentation)/(pages)/strategies/[id]/components/hooks/tools/useToolbar';
import { useLucideIconToSvgUrl } from '@/(presentation)/(pages)/strategies/[id]/components/hooks/utils/useLucideIconToSvgUrl';
import StrategyToolbar from '@/(presentation)/(pages)/strategies/[id]/components/strategy-toolbar.component';
import StrategyCanvas from '@/(presentation)/(pages)/strategies/[id]/components/strategy-canvas.component';
import StrategyMapImage from '@/(presentation)/(pages)/strategies/[id]/components/strategy-map-image.component';
import Konva from 'konva';
import React, { Ref } from 'react';
import { useCircleEvent } from '@/(presentation)/(pages)/strategies/[id]/components/hooks/tools/useCircleEvent';
import {
    AirplanePathResponseDto,
    CircleResponseDto,
    EnemyTeamResponseDto,
    TeamPlayerResponseDto,
} from '@/application/strategy/dto/strategy/get-strategy.dto';
import PhaseSelectModal from '@/(presentation)/(pages)/strategies/[id]/components/modals/phase-select.modal';
import { useKonvaHandleMouseClick } from '@/(presentation)/(pages)/strategies/[id]/components/hooks/konvas/useKonvaHandleMouseClick';
import { useAirplanePathEvent } from '@/(presentation)/(pages)/strategies/[id]/components/hooks/tools/useAirplanePathEvent';
import EnterTeamLabelModal from '@/(presentation)/(pages)/strategies/[id]/components/modals/enter-team-label.modal';
import { useEnemyTeamEvent } from '@/(presentation)/(pages)/strategies/[id]/components/hooks/tools/useEnemyTeamEvent';
import { useTeamPlayerEvent } from '@/(presentation)/(pages)/strategies/[id]/components/hooks/tools/useTeamPlayerEvent';
import { useMarkerEvent } from '@/(presentation)/(pages)/strategies/[id]/components/hooks/tools/useMarkerEvent';
import { useWaypointEvent } from '@/(presentation)/(pages)/strategies/[id]/components/hooks/tools/useWaypointEvent';
import EnterTagContentModal from '@/(presentation)/(pages)/strategies/[id]/components/modals/enter-tag-content.modal';
import { useTagEvent } from '@/(presentation)/(pages)/strategies/[id]/components/hooks/tools/useTagEvent';
import CirclesLayer from '@/(presentation)/(pages)/strategies/[id]/components/properties/circle-property.component';
import AirplanePathLayer from '@/(presentation)/(pages)/strategies/[id]/components/properties/airplane-path-property.component';
import EnemyTeamsLayer from '@/(presentation)/(pages)/strategies/[id]/components/properties/enemy-team-property.component';
import TeamPlayersLayer from '@/(presentation)/(pages)/strategies/[id]/components/properties/team-player-property.component';

export interface StrategyBodyProps {
    id: string;
    mapImage: string;
    stageRef: Ref<Konva.Stage>;
    handleMouseMove: () => void;
    circles: CircleResponseDto[];
    airplanePath?: AirplanePathResponseDto;
    enemyTeams: EnemyTeamResponseDto[];
    teamPlayers: TeamPlayerResponseDto[];
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
        isPhaseSelectModalOpen,
        phaseSelectModalOpen,
        phaseSelectModalClose,
        circleCreate,
    } = useCircleEvent(id);

    const { clickAirplanePath, startPosition, endPosition } =
        useAirplanePathEvent(id, airplanePath);

    const {
        isEnterEnemyTeamLabelModalOpen,
        enterEnemyTeamLabelModalOpen,
        enterEnemyTeamLabelModalClose,
        enemyTeamCreate,
    } = useEnemyTeamEvent(id);

    const {
        teamPlayerCreate,
        selectedTeamPlayerId,
        isClickableTeamPlayer,
        changeSelectedTeamPlayerId,
    } = useTeamPlayerEvent(id, selectedTool);

    const {
        isEnterTagContentModalOpen,
        enterTagContentModalOpen,
        enterTagContentModalClose,
        tagCreate,
    } = useTagEvent(id);

    const { markerClick } = useMarkerEvent(
        id,
        teamPlayers,
        selectedTeamPlayerId
    );

    const {
        waypointCreate,
        isDrawing: isWaypointDrawing,
        clickedPositions: waypointClickedPositions,
    } = useWaypointEvent(id, teamPlayers, selectedTeamPlayerId);

    const onMapClick = (clickPosition: { x: number; y: number }) => {
        switch (selectedTool) {
            case 'circle':
                return phaseSelectModalOpen(clickPosition);
            case 'airplane':
                return clickAirplanePath(clickPosition);
            case 'enemy':
                return enterEnemyTeamLabelModalOpen(clickPosition);
            case 'team':
                return teamPlayerCreate(clickPosition);
            case 'marker':
                return markerClick(clickPosition);
            case 'waypoint':
                return waypointCreate(clickPosition);
            case 'tag':
                return enterTagContentModalOpen(clickPosition);
        }
    };

    const { handleClick } = useKonvaHandleMouseClick((_, clickPosition) => {
        onMapClick(clickPosition);
    });

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
                        <CirclesLayer circles={circles} />
                        <AirplanePathLayer
                            startPosition={startPosition}
                            endPosition={endPosition}
                        />
                        <EnemyTeamsLayer enemyTeams={enemyTeams} />
                        <TeamPlayersLayer
                            teamPlayers={teamPlayers}
                            clickable={isClickableTeamPlayer}
                            selectedTeamPlayerId={selectedTeamPlayerId}
                            changeSelectedTeamPlayerId={
                                changeSelectedTeamPlayerId
                            }
                            isWaypointDrawing={isWaypointDrawing}
                            waypointClickedPositions={waypointClickedPositions}
                        />
                    </>
                }
                onMapClick={handleClick}
            />

            <PhaseSelectModal
                isOpen={isPhaseSelectModalOpen}
                onClose={phaseSelectModalClose}
                onConfirm={circleCreate}
            />

            <EnterTeamLabelModal
                isOpen={isEnterEnemyTeamLabelModalOpen}
                onClose={enterEnemyTeamLabelModalClose}
                onConfirm={enemyTeamCreate}
            />

            <EnterTagContentModal
                isOpen={isEnterTagContentModalOpen}
                onClose={enterTagContentModalClose}
                onConfirm={tagCreate}
            />
        </div>
    );
}

StrategyBody.displayName = 'StrategyBody';

export default React.memo(StrategyBody);

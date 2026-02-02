'use client';

import { useToolbar } from '@/(presentation)/(pages)/strategies/[id]/components/hooks/tools/useToolbar';
import { useLucideIconToSvgUrl } from '@/(presentation)/(pages)/strategies/[id]/components/hooks/utils/useLucideIconToSvgUrl';
import StrategyToolbar from '@/(presentation)/(pages)/strategies/[id]/components/strategy-toolbar.component';
import StrategyCanvas from '@/(presentation)/(pages)/strategies/[id]/components/strategy-canvas.component';
import StrategyMapImage from '@/(presentation)/(pages)/strategies/[id]/components/strategy-map-image.component';
import Konva from 'konva';
import React, { Ref } from 'react';
import CircleProperty from '@/(presentation)/(pages)/strategies/[id]/components/properties/circle-property.component';
import { Layer } from 'react-konva';
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
import AirplanePathProperty from '@/(presentation)/(pages)/strategies/[id]/components/properties/airplane-path-property.component';
import EnterTeamLabelModal from '@/(presentation)/(pages)/strategies/[id]/components/modals/enter-team-label.modal';
import { useEnemyTeamEvent } from '@/(presentation)/(pages)/strategies/[id]/components/hooks/tools/useEnemyTeamEvent';
import EnemyTeamProperty from '@/(presentation)/(pages)/strategies/[id]/components/properties/enemy-team-property.component';
import TeamPlayerProperty from '@/(presentation)/(pages)/strategies/[id]/components/properties/team-player-property.component';
import { useTeamPlayerEvent } from '@/(presentation)/(pages)/strategies/[id]/components/hooks/tools/useTeamPlayerEvent';
import MarkerProperty from '@/(presentation)/(pages)/strategies/[id]/components/properties/marker-property.component';
import { useMarkerEvent } from '@/(presentation)/(pages)/strategies/[id]/components/hooks/tools/useMarkerEvent';
import WaypointProperty from '@/(presentation)/(pages)/strategies/[id]/components/properties/waypoint-property.component';
import { useWaypointEvent } from '@/(presentation)/(pages)/strategies/[id]/components/hooks/tools/useWaypointEvent';

interface StrategyBodyProps {
    id: string;
    mapImage: string;
    stageRef: Ref<Konva.Stage>;
    handleMouseMove: () => void;
    circles: CircleResponseDto[];
    airplanePath?: AirplanePathResponseDto;
    enemyTeams: EnemyTeamResponseDto[];
    teamPlayers: TeamPlayerResponseDto[];
}

function CirclesLayer({ circles }: Pick<StrategyBodyProps, 'circles'>) {
    return (
        <Layer>
            {circles.map(field => (
                <CircleProperty
                    key={field.phase}
                    color={field.color}
                    radius={field.radius}
                    x={field.centerPosition.x}
                    y={field.centerPosition.y}
                />
            ))}
        </Layer>
    );
}

function AirplanePathLayer({
    startPosition,
    endPosition,
}: {
    startPosition?: { x: number; y: number };
    endPosition?: { x: number; y: number };
}) {
    return (
        <Layer>
            <AirplanePathProperty
                startPosition={startPosition}
                endPosition={endPosition}
            />
        </Layer>
    );
}

function EnemyTeamsLayer({
    enemyTeams,
}: Pick<StrategyBodyProps, 'enemyTeams'>) {
    return (
        <Layer>
            {enemyTeams.map(field => (
                <EnemyTeamProperty
                    key={field.id}
                    x={field.position.x}
                    y={field.position.y}
                    teamLabel={field.teamLabel}
                />
            ))}
        </Layer>
    );
}

function TeamPlayersLayer({
    teamPlayers,
    clickable,
    selectedTeamPlayerId,
    changeSelectedTeamPlayerId,
    isWaypointDrawing,
    waypointClickedPositions,
}: {
    clickable: boolean;
    selectedTeamPlayerId?: string;
    changeSelectedTeamPlayerId: (id: string) => void;
    isWaypointDrawing: boolean;
    waypointClickedPositions: { x: number; y: number }[];
} & Pick<StrategyBodyProps, 'teamPlayers'>) {
    return (
        <Layer>
            {teamPlayers.map(field => (
                <React.Fragment key={`tp-${field.id}`}>
                    <TeamPlayerProperty
                        id={field.id}
                        x={field.position.x}
                        y={field.position.y}
                        priority={field.priority}
                        color={field.color}
                        clickable={clickable}
                        isClicked={field.id === selectedTeamPlayerId}
                        onClick={id => {
                            changeSelectedTeamPlayerId(id);
                        }}
                    />
                    {field.marker && (
                        <MarkerProperty
                            color={field.color}
                            priority={field.priority}
                            x={field.marker.position.x}
                            y={field.marker.position.y}
                        />
                    )}
                    {field.waypoint && (
                        <WaypointProperty
                            positions={
                                isWaypointDrawing
                                    ? waypointClickedPositions
                                    : field.waypoint.positions
                            }
                            color={field.color}
                            priority={field.priority}
                            isDrawing={isWaypointDrawing}
                        />
                    )}
                </React.Fragment>
            ))}
        </Layer>
    );
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
        </div>
    );
}

StrategyBody.displayName = 'StrategyBody';

export default React.memo(StrategyBody);

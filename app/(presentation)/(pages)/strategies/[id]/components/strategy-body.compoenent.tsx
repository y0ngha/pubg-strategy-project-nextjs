'use client';

import { useToolbar } from '@/(presentation)/(pages)/strategies/[id]/components/hooks/tools/useToolbar';
import { useLucideIconToSvgUrl } from '@/(presentation)/(pages)/strategies/[id]/components/hooks/utils/useLucideIconToSvgUrl';
import StrategyToolbar from '@/(presentation)/(pages)/strategies/[id]/components/strategy-toolbar.component';
import StrategyCanvas from '@/(presentation)/(pages)/strategies/[id]/components/strategy-canvas.component';
import StrategyMapImage from '@/(presentation)/(pages)/strategies/[id]/components/strategy-map-image.component';
import Konva from 'konva';
import { Ref } from 'react';
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
    scale,
}: { scale: number } & Pick<StrategyBodyProps, 'enemyTeams'>) {
    return (
        <Layer>
            {enemyTeams.map(field => (
                <EnemyTeamProperty
                    key={field.id}
                    x={field.position.x}
                    y={field.position.y}
                    teamLabel={field.teamLabel}
                    scale={scale}
                />
            ))}
        </Layer>
    );
}

function TeamPlayersLayer({
    teamPlayers,
    scale,
    clickable,
    selectedTeamPlayerId,
    changeSelectedTeamPlayerId,
}: {
    scale: number;
    clickable: boolean;
    selectedTeamPlayerId?: string;
    changeSelectedTeamPlayerId: (id: string) => void;
} & Pick<StrategyBodyProps, 'teamPlayers'>) {
    return (
        <Layer>
            {teamPlayers.map(field => (
                <TeamPlayerProperty
                    key={field.id}
                    id={field.id}
                    x={field.position.x}
                    y={field.position.y}
                    priorty={field.priority}
                    color={field.color}
                    scale={scale}
                    clickable={clickable}
                    isClicked={field.id === selectedTeamPlayerId}
                    onClick={id => {
                        changeSelectedTeamPlayerId(id);
                    }}
                />
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
                properties={({ scale }) => {
                    return (
                        <>
                            <CirclesLayer circles={circles} />
                            <AirplanePathLayer
                                startPosition={startPosition}
                                endPosition={endPosition}
                            />
                            <EnemyTeamsLayer
                                enemyTeams={enemyTeams}
                                scale={scale}
                            />
                            <TeamPlayersLayer
                                teamPlayers={teamPlayers}
                                scale={scale}
                                clickable={isClickableTeamPlayer}
                                selectedTeamPlayerId={selectedTeamPlayerId}
                                changeSelectedTeamPlayerId={
                                    changeSelectedTeamPlayerId
                                }
                            />
                        </>
                    );
                }}
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

export default StrategyBody;

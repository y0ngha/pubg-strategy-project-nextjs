import {
    CircleDashed,
    Eraser,
    LucideIcon,
    MapPin,
    MessageSquareText,
    MousePointer2,
    Plane,
    Route,
    Shield,
    Swords,
    Tag,
} from 'lucide-react';
import { useState } from 'react';

export const CANVAS_TOOLS = {
    select: 'select',
    circle: 'circle',
    airplane: 'airplane',
    enemy: 'enemy',
    team: 'team',
    marker: 'marker',
    waypoint: 'waypoint',
    tag: 'tag',
    comment: 'comment',
    eraser: 'eraser',
} as const;

export type CanvasTool = (typeof CANVAS_TOOLS)[keyof typeof CANVAS_TOOLS];

export function useToolbar() {
    const [selectedTool, setSelectedTool] = useState<CanvasTool>('select');

    const iconSize = 20;

    const canvasToolGroup: CanvasTool[][] = [
        [CANVAS_TOOLS.select],
        [CANVAS_TOOLS.airplane, CANVAS_TOOLS.circle],
        [CANVAS_TOOLS.enemy, CANVAS_TOOLS.team],
        [CANVAS_TOOLS.marker, CANVAS_TOOLS.waypoint],
        [CANVAS_TOOLS.tag, CANVAS_TOOLS.comment],
        [CANVAS_TOOLS.eraser],
    ];

    const canvasToolNames: Record<CanvasTool, string> = {
        select: '선택 및 이동',
        circle: '자기장',
        airplane: '비행기 동선',
        enemy: '적 팀',
        team: '아군',
        marker: '마커',
        waypoint: '웨이포인트',
        tag: '태그',
        comment: '댓글',
        eraser: '지우개',
    };

    const canvasToolIcons: Record<CanvasTool, LucideIcon> = {
        select: MousePointer2,
        circle: CircleDashed,
        airplane: Plane,
        enemy: Swords,
        team: Shield,
        marker: MapPin,
        waypoint: Route,
        tag: Tag,
        comment: MessageSquareText,
        eraser: Eraser,
    };

    const changeTool = (tool: CanvasTool) => {
        setSelectedTool(tool);
    };

    return {
        canvasToolGroup,
        canvasToolNames,
        canvasToolIcons,
        changeTool,
        selectedTool,
        iconSize,
    };
}

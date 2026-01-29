'use client';

import ToolButton from '@/(presentation)/(pages)/strategies/[id]/components/tool-button.component';
import ToolDivider from '@/(presentation)/(pages)/strategies/[id]/components/tool-divider.component';
import { CanvasTool } from '@/(presentation)/(pages)/strategies/[id]/components/hooks/useToolbar';
import { LucideIcon } from 'lucide-react';

interface StrategyToolbarProps {
    canvasToolGroup: CanvasTool[][];
    canvasToolNames: Record<CanvasTool, string>;
    canvasToolIcons: Record<CanvasTool, LucideIcon>;
    changeTool: (tool: CanvasTool) => void;
    selectedTool: CanvasTool;
    iconSize: number;
}

function StrategyToolbar({
    canvasToolGroup,
    canvasToolNames,
    canvasToolIcons,
    changeTool,
    selectedTool,
    iconSize,
}: StrategyToolbarProps) {
    return (
        <div
            className={
                'flex h-full w-20 flex-col items-center justify-start gap-3 p-2'
            }
        >
            {canvasToolGroup.map((tools: CanvasTool[], index: number) => {
                return [
                    ...tools.map(tool => {
                        const IconComponent = canvasToolIcons[tool];
                        const tooltip = canvasToolNames[tool];
                        const isActive = selectedTool === tool;

                        return (
                            <ToolButton
                                key={tool}
                                icon={<IconComponent size={iconSize} />}
                                tooltip={tooltip}
                                active={isActive}
                                onClick={() => changeTool(tool)}
                            />
                        );
                    }),
                    <ToolDivider key={`tool-group-${index}`} />,
                ];
            })}
        </div>
    );
}

StrategyToolbar.displayName = 'StrategyToolbar';

export default StrategyToolbar;

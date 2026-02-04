'use client';

import StrategyToolButton from '@/(presentation)/(pages)/strategies/[id]/components/tools/strategy-tool-button.component';
import StrategyToolDivider from '@/(presentation)/(pages)/strategies/[id]/components/tools/strategy-tool-divider.component';
import { CanvasTool } from '@/(presentation)/(pages)/strategies/[id]/hooks/tools/useToolbar';
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
                            <StrategyToolButton
                                key={tool}
                                icon={<IconComponent size={iconSize} />}
                                tooltip={tooltip}
                                active={isActive}
                                onClick={() => changeTool(tool)}
                            />
                        );
                    }),
                    <StrategyToolDivider key={`tool-group-${index}`} />,
                ];
            })}
        </div>
    );
}

StrategyToolbar.displayName = 'StrategyToolbar';

export default StrategyToolbar;

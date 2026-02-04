interface StrategyFooterProps {
    mousePosition: { x: number; y: number };
}
function StrategyFooter({ mousePosition }: StrategyFooterProps) {
    return (
        <div className={'h-[32] w-full p-2'}>
            <span className={'text-foreground text-sm font-bold'}>
                Mouse: ({mousePosition.x}, {mousePosition.y})
            </span>
        </div>
    );
}

StrategyFooter.displayName = 'StrategyFooter';

export default StrategyFooter;

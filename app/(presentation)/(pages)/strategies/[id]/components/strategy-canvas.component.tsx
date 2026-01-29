'use client';

import { PubgMap } from '@domain/strategy/enums/map.enum';
import StrategyMapCanvas from '@/(presentation)/(pages)/strategies/[id]/components/strategy-map-canvas.component';

function StrategyCanvas() {
    return <StrategyMapCanvas map={PubgMap.ERANGEL} />;
}

StrategyCanvas.displayName = 'StrategyCanvas';

export default StrategyCanvas;

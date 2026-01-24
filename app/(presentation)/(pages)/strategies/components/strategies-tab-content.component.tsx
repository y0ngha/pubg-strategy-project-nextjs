import { ReactNode } from 'react';

function StrategiesTabContent({ children }: { children: ReactNode }) {
    return <div className={'h-full w-full'}>{children}</div>;
}

StrategiesTabContent.displayName = 'StrategiesTabContent';

export default StrategiesTabContent;

import { ReactNode } from 'react';

interface StrategiesHeaderLayoutProps {
    header: ReactNode;
    strategyCreate: ReactNode;
}

function StrategiesHeaderLayout({
    header,
    strategyCreate,
}: StrategiesHeaderLayoutProps) {
    return (
        <div
            className={
                'flex flex-col justify-between gap-4 md:flex-row md:items-center'
            }
        >
            {header}
            {strategyCreate}
        </div>
    );
}

StrategiesHeaderLayout.displayName = 'StrategiesHeaderLayout';

export default StrategiesHeaderLayout;

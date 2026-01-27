import { ReactNode } from 'react';

interface StrategiesPageLayoutProps {
    headerLayout: ReactNode;
    tabs: ReactNode;
    content: ReactNode;
}
function StrategiesPageLayout({
    headerLayout,
    tabs,
    content,
}: StrategiesPageLayoutProps) {
    return (
        <div className={'flex h-full w-full flex-col space-y-4 p-6'}>
            {headerLayout}
            {tabs}
            {content}
        </div>
    );
}

StrategiesPageLayout.displayName = 'StrategiesPageLayout';

export default StrategiesPageLayout;

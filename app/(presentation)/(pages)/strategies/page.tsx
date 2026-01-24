import * as React from 'react';
import StrategiesTabs from '@/(presentation)/(pages)/strategies/components/strategies-tabs.component';
import {
    StrategiesHeader,
    StrategiesHeaderLayout,
    StrategiyCreateButton,
} from '@/(presentation)/(pages)/strategies/components/strategies-header.component';
import StrategiesTabContent from '@/(presentation)/(pages)/strategies/components/strategies-tab-content.component';
import MyStrategies from '@/(presentation)/(pages)/strategies/components/my-strategies.component';
import ShareStrategies from '@/(presentation)/(pages)/strategies/components/shared-strategies.component';

interface StrategyDashboardPageProps {
    searchParams: Promise<{ [key: string]: string | undefined }>;
}

export default async function StrategyDashboardPage({
    searchParams,
}: StrategyDashboardPageProps) {
    const tabQueryParameterKey = 'strategy';

    const tabs = [
        {
            value: 'my-stratiges',
            label: '내가 쓴 전술',
        },
        {
            value: 'share-stratiges',
            label: '공유 받은 전술',
        },
    ];

    const query = await searchParams;
    const activeTab = query[tabQueryParameterKey] ?? tabs[0].value;

    return (
        <div className={'h-screen w-full space-y-8 p-4 py-10'}>
            <StrategiesHeaderLayout
                header={<StrategiesHeader />}
                buttons={<StrategiyCreateButton />}
            />
            <StrategiesTabs
                tabs={tabs}
                queryParameterKey={tabQueryParameterKey}
            />
            <StrategiesTabContent>
                {activeTab === tabs[0].value && <MyStrategies />}
                {activeTab === tabs[1].value && <ShareStrategies />}
            </StrategiesTabContent>
        </div>
    );
}

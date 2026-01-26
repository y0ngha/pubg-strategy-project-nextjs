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
import StrategiesDehydrate from '@/dehydrate-components/strategies-dehydrate.component';

interface StrategyDashboardPageProps {
    searchParams: Promise<{ [key: string]: string | undefined }>;
}

const STRATEGIES_PAGE_TABS = [
    {
        value: 'my-stratiges',
        label: '내가 쓴 전술',
    },
    {
        value: 'share-stratiges',
        label: '공유 받은 전술',
    },
];

const tabQueryParameterKey = 'strategy';

export default async function StrategyDashboardPage({
    searchParams,
}: StrategyDashboardPageProps) {
    const query = await searchParams;

    const activeTab =
        query[tabQueryParameterKey] ?? STRATEGIES_PAGE_TABS[0].value;

    return (
        <StrategiesDehydrate>
            <div className={'flex h-full w-full flex-col space-y-4 p-6'}>
                <StrategiesHeaderLayout
                    header={<StrategiesHeader />}
                    buttons={<StrategiyCreateButton />}
                />
                <StrategiesTabs
                    tabs={STRATEGIES_PAGE_TABS}
                    queryParameterKey={tabQueryParameterKey}
                />
                <StrategiesTabContent>
                    {activeTab === STRATEGIES_PAGE_TABS[0].value && (
                        <MyStrategies />
                    )}
                    {activeTab === STRATEGIES_PAGE_TABS[1].value && (
                        <ShareStrategies />
                    )}
                </StrategiesTabContent>
            </div>
        </StrategiesDehydrate>
    );
}

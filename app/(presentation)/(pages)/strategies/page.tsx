import * as React from 'react';
import StrategiesTabs from '@/(presentation)/(pages)/strategies/components/strategies-tabs.component';
import {
    StrategiesHeader,
    StrategiesHeaderLayout,
    StrategiyCreateButton,
} from '@/(presentation)/(pages)/strategies/components/strategies-header.component';
import MyStrategies from '@/(presentation)/(pages)/strategies/components/my-strategies.component';
import StrategiesDehydrate from '@/dehydrate-components/strategies-dehydrate.component';
import StrategiesPageLayout from '@/(presentation)/(pages)/strategies/components/strategies-page-layout.component';
import SharedStrategies from '@/(presentation)/(pages)/strategies/components/shared-strategies.component';

interface StrategyDashboardPageProps {
    searchParams: Promise<{ [key: string]: string | undefined }>;
}

interface Tabs {
    value: string;
    label: string;
}

const STRATEGIES_PAGE_TABS: Tabs[] = [
    {
        value: 'my-strategies',
        label: '내가 쓴 전술',
    },
    {
        value: 'share-strategies',
        label: '공유 받은 전술',
    },
] as const;

const tabQueryParameterKey = 'strategy';

function StrategiesTabContent({ activeTab }: { activeTab: string }) {
    switch (activeTab) {
        case STRATEGIES_PAGE_TABS[0].value:
            return <MyStrategies />;
        case STRATEGIES_PAGE_TABS[1].value:
            return <SharedStrategies />;
        default:
            return <></>;
    }
}

export default async function StrategyDashboardPage({
    searchParams,
}: StrategyDashboardPageProps) {
    const query = await searchParams;

    const activeTab =
        query[tabQueryParameterKey] ?? STRATEGIES_PAGE_TABS[0].value;

    return (
        <StrategiesDehydrate>
            <StrategiesPageLayout
                headerLayout={
                    <StrategiesHeaderLayout
                        header={<StrategiesHeader />}
                        buttons={<StrategiyCreateButton />}
                    />
                }
                tabs={
                    <StrategiesTabs
                        tabs={STRATEGIES_PAGE_TABS}
                        queryParameterKey={tabQueryParameterKey}
                    />
                }
                content={<StrategiesTabContent activeTab={activeTab} />}
            />
        </StrategiesDehydrate>
    );
}

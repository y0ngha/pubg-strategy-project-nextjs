import MyStrategies from '@/(presentation)/strategies/components/root/my-strategies.component';
import StrategiesDehydrate from '@/(presentation)/dehydrates/strategies-dehydrate.component';
import SharedStrategies from '@/(presentation)/strategies/components/root/shared-strategies.component';
import StrategyCreateModalController from '@/(presentation)/strategies/modals/root/strategy-create-modal-controller.component';
import StrategyCreateModal from '@/(presentation)/strategies/modals/root/strategy-create-modal.component';
import StrategiesTabs from '@/(presentation)/(pages)/strategies/_components/strategies-tabs.component';
import StrategiesTabContent from '@/(presentation)/(pages)/strategies/_components/strategies-tabs-content.component';
import PageLayout from '@/(presentation)/(pages)/strategies/_components/page-layout.component';
import HeaderLayout from '@/(presentation)/(pages)/strategies/_components/header-layout.component';
import Header from '@/(presentation)/(pages)/strategies/_components/header.component';
import CreateButton from '@/(presentation)/(pages)/strategies/_components/create-button.component';

interface StrategyDashboardProps {
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

function TabsContent({ activeTab }: { activeTab: string }) {
    switch (activeTab) {
        case STRATEGIES_PAGE_TABS[0].value:
            return <MyStrategies />;
        case STRATEGIES_PAGE_TABS[1].value:
            return <SharedStrategies />;
        default:
            return <></>;
    }
}

export default async function StrategyDashboard({
    searchParams,
}: StrategyDashboardProps) {
    const query = await searchParams;

    const activeTab =
        query[tabQueryParameterKey] ?? STRATEGIES_PAGE_TABS[0].value;

    return (
        <StrategiesDehydrate>
            <PageLayout
                headerLayout={
                    <HeaderLayout
                        header={<Header />}
                        strategyCreate={
                            <StrategyCreateModalController
                                trigger={<CreateButton />}
                                modal={<StrategyCreateModal />}
                            />
                        }
                    />
                }
                tabs={
                    <StrategiesTabs
                        tabs={STRATEGIES_PAGE_TABS}
                        queryParameterKey={tabQueryParameterKey}
                    />
                }
                content={
                    <StrategiesTabContent>
                        <TabsContent activeTab={activeTab} />
                    </StrategiesTabContent>
                }
            />
        </StrategiesDehydrate>
    );
}

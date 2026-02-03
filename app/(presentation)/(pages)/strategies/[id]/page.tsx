import StrategyPageLayout from '@/(presentation)/(pages)/strategies/[id]/components/strategy-page-layout.component';
import StrategyPageContent from '@/(presentation)/(pages)/strategies/[id]/components/strategy-page-content.component';

export default async function Strategy({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;

    return <StrategyPageLayout content={<StrategyPageContent id={id} />} />;
}

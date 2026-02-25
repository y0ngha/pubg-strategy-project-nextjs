import StrategyPageContent from '@/(presentation)/strategies/components/[id]/body/strategy-page-content.component';
import PageLayout from '@/(presentation)/(pages)/strategies/[id]/_components/page-layout.component';

export default async function Strategy({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;

    return <PageLayout content={<StrategyPageContent id={id} />} />;
}

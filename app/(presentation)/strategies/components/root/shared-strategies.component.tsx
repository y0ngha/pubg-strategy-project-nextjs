'use client';

import StrategiesTable from '@/(presentation)/strategies/components/root/strategies-table.component';
import { useGetSharedStrategies } from '@/(presentation)/strategies/hooks/queries/useGetSharedStrategies';

function SharedStrategies() {
    const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
        useGetSharedStrategies(15);

    return (
        <StrategiesTable
            data={data}
            fetchNextPage={fetchNextPage}
            hasNextPage={hasNextPage}
            isFetchingNextPage={isFetchingNextPage}
            isOwned={false}
        />
    );
}

SharedStrategies.displayName = 'SharedStrategies';

export default SharedStrategies;

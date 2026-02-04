'use client';

import StrategiesTable from '@/(presentation)/(pages)/strategies/components/tables/strategies-table.component';
import { useGetSharedStrategies } from '@/(presentation)/shared/hooks/useGetSharedStrategies';

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

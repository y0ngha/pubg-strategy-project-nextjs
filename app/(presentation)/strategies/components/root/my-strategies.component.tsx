'use client';

import { useGetOwnedStrategies } from '@/(presentation)/strategies/hooks/queries/useGetOwnedStrategies';
import StrategiesTable from '@/(presentation)/strategies/components/root/strategies-table.component';

function MyStrategies() {
    const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
        useGetOwnedStrategies(15);

    return (
        <StrategiesTable
            data={data}
            fetchNextPage={fetchNextPage}
            hasNextPage={hasNextPage}
            isFetchingNextPage={isFetchingNextPage}
            isOwned={true}
        />
    );
}

MyStrategies.displayName = 'MyStrategies';

export default MyStrategies;

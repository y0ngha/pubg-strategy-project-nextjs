'use client';

import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { getQueryClient } from '@/(presentation)/shared/helpers/query-client.helpers';

function ReactQueryProviders({ children }: { children: React.ReactNode }) {
    const queryClient = getQueryClient();

    return (
        <QueryClientProvider client={queryClient}>
            {children}
            {process.env.NEXT_PUBLIC_ENV === 'local' && <ReactQueryDevtools />}
        </QueryClientProvider>
    );
}

ReactQueryProviders.displayName = 'ReactQueryProviders';

export default ReactQueryProviders;

import React, { useContext } from 'react';

export function useSafetyContext<T>(
    baseContext: React.Context<T>,
    errorMessage: string
) {
    const context = useContext(baseContext);

    if (!context) throw new Error(errorMessage);

    return context;
}

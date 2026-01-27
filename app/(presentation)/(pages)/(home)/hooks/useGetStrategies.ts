import { useGetSharedStrategies } from '@/(presentation)/shared/hooks/useGetSharedStrategies';
import { useGetOwnedStrategies } from '@/(presentation)/shared/hooks/useGetOwnedStrategies';
import { InfiniteData } from '@tanstack/query-core';
import { GetStrategyResponseDto } from '@/application/strategy/dto/strategy/get-strategy.dto';

export function useGetStrategies(limit: number) {
    const { data: ownedStrategiesData, isPending: isOwnedStrategiesPending } =
        useGetOwnedStrategies(limit);
    const { data: sharedStrtegiesData, isPending: isSharedStrategiesPending } =
        useGetSharedStrategies(limit);

    const ownedStrategies =
        flattenInfiniteData<GetStrategyResponseDto>(ownedStrategiesData);

    const sharedStrtegies =
        flattenInfiniteData<GetStrategyResponseDto>(sharedStrtegiesData);

    const strategies = [...ownedStrategies, ...sharedStrtegies]
        .sort(sortingStrategies)
        .slice(0, limit);

    return {
        strategies,
        isPending: isOwnedStrategiesPending || isSharedStrategiesPending,
    };
}

function flattenInfiniteData<
    T extends {
        id: string;
        map: string;
        title: string;
        ownerEmail: string;
        updatedAt: Date;
    },
>(data?: InfiniteData<{ hasNextPage: boolean; data: T[] }, unknown>) {
    return data?.pages.flatMap(page => page.data) ?? [];
}

function sortingStrategies(
    a: GetStrategyResponseDto,
    b: GetStrategyResponseDto
) {
    const timeDescending = orderByDescendingTheUpdatedAt(a, b);

    if (timeDescending !== 0) {
        return timeDescending;
    }

    return orderByAscendingTheTitle(a, b);
}

function orderByDescendingTheUpdatedAt(
    a: GetStrategyResponseDto,
    b: GetStrategyResponseDto
) {
    return b.createdAt.getTime() - a.createdAt.getTime();
}

function orderByAscendingTheTitle(
    a: GetStrategyResponseDto,
    b: GetStrategyResponseDto
) {
    return a.title.localeCompare(b.title);
}

'use client';

import Table from '@/(presentation)/shared/components/table.component';
import MapBadge from '@/(presentation)/shared/components/map-badge.component';
import { cn } from '@/(presentation)/shared/utils/class-names.util';
import StrategyActionMenu from '@/(presentation)/(pages)/strategies/components/strategy-action-menu.component';
import {
    StrategiesBoardMap,
    StrategyPost,
} from '@/(presentation)/shared/types/strategy';
import { useEffect, useRef } from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';
import {
    FetchNextPageOptions,
    InfiniteData,
    InfiniteQueryObserverResult,
} from '@tanstack/query-core';
import { toYyyyMmDdHhMmString } from '@/(presentation)/shared/helpers/date.helper';

const CellStyles = {
    title: 'flex items-center flex-3',
    map: 'flex items-center flex-1',
    author: 'flex items-center flex-1',
    updatedAt: 'flex items-center flex-1',
    manage: 'flex items-center',
};

type Data<T> = { hasNextPage: boolean; data: T[] };

interface StrategiesTableProps<T> {
    data: InfiniteData<Data<T>, unknown> | undefined;
    fetchNextPage: (
        options?: FetchNextPageOptions
    ) => Promise<
        InfiniteQueryObserverResult<InfiniteData<Data<T>, unknown>, Error>
    >;
    hasNextPage: boolean;
    isFetchingNextPage: boolean;
    isOwned: boolean;
}

function StrategiesTable<
    T extends {
        id: string;
        map: string;
        title: string;
        ownerEmail: string;
        updatedAt: Date;
    },
>({
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isOwned,
}: StrategiesTableProps<T>) {
    const tableContainerRef = useRef<HTMLDivElement>(null);

    const strategies: StrategyPost[] = data
        ? data.pages.flatMap(page => {
              return page.data.map(item => {
                  return {
                      id: item.id,
                      map: item.map as StrategiesBoardMap,
                      title: item.title,
                      author: item.ownerEmail,
                      updatedAt: toYyyyMmDdHhMmString(item.updatedAt),
                  };
              });
          })
        : [];

    const virtualizer = useVirtualizer({
        count: strategies.length,
        estimateSize: () => 73,
        getScrollElement: () => tableContainerRef.current,
        overscan: 5,
        measureElement:
            typeof window !== 'undefined' &&
            navigator.userAgent.indexOf('Firefox') === -1
                ? element => element.getBoundingClientRect().height
                : undefined,
    });

    const items = virtualizer.getVirtualItems();

    const bodyHeight = 73;

    useEffect(() => {
        const lastItem = items[items.length - 3];
        if (!lastItem) return;

        const isNeedNextPageFetch = lastItem.index >= strategies.length - 3;

        if (isNeedNextPageFetch && !isFetchingNextPage && hasNextPage) {
            fetchNextPage().then();
        }
    }, [
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        items,
        strategies.length,
    ]);

    return (
        <Table
            containerRef={tableContainerRef}
            className={'flex flex-col'}
            containerClassName={'h-[75vh] min-h-125 [overflow-anchor:none]'}
        >
            <Table.Header className={'flex'}>
                <Table.Row isHeading={true} className={`flex flex-1`}>
                    <Table.Head className={`${CellStyles.title} `}>
                        제목
                    </Table.Head>
                    <Table.Head className={`${CellStyles.map} `}>맵</Table.Head>
                    <Table.Head className={`${CellStyles.author} `}>
                        작성자
                    </Table.Head>
                    <Table.Head className={`${CellStyles.updatedAt} `}>
                        업데이트 날짜
                    </Table.Head>
                    {isOwned && (
                        <Table.Head className={`${CellStyles.manage} `}>
                            관리
                        </Table.Head>
                    )}
                </Table.Row>
            </Table.Header>

            <Table.Body
                className={`relative flex flex-col`}
                style={{ height: `${bodyHeight}px` }}
            >
                {items.map(item => {
                    const strategy = strategies[item.index];

                    return (
                        <Table.Row
                            key={strategy.id}
                            className={`flex`}
                            data-index={item.index}
                            ref={virtualizer.measureElement}
                            style={{
                                transform: `translateY(${item.start}px)`,
                            }}
                        >
                            <Table.Cell
                                className={`${CellStyles.title} font-medium`}
                            >
                                {strategy.title}
                            </Table.Cell>
                            <Table.Cell className={CellStyles.map}>
                                <MapBadge
                                    className={cn('font-normal')}
                                    map={strategy.map}
                                >
                                    {strategy.map.toUpperCase()}
                                </MapBadge>
                            </Table.Cell>
                            <Table.Cell
                                className={`${CellStyles.author} text-muted-foreground text-sm`}
                            >
                                {strategy.author}
                            </Table.Cell>
                            <Table.Cell
                                className={`${CellStyles.updatedAt} text-muted-foreground text-sm`}
                            >
                                {strategy.updatedAt}
                            </Table.Cell>
                            {isOwned && (
                                <Table.Cell className={CellStyles.manage}>
                                    <StrategyActionMenu />
                                </Table.Cell>
                            )}
                        </Table.Row>
                    );
                })}
            </Table.Body>
        </Table>
    );
}

StrategiesTable.displayName = 'StrategiesTable';

export default StrategiesTable;

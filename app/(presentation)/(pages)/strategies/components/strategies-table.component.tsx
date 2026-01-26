'use client';

import Table from '@/(presentation)/shared/components/table.component';
import MapBadge from '@/(presentation)/shared/components/map-badge.component';
import { cn } from '@/(presentation)/shared/utils/class-names.util';
import StrategyActionMenu from '@/(presentation)/(pages)/strategies/components/strategy-action-menu.component';
import { StrategyPost } from '@/(presentation)/shared/types/strategy';
import { Ref } from 'react';
import { VirtualItem } from '@tanstack/virtual-core';

const CellStyles = {
    title: 'flex items-center flex-3',
    map: 'flex items-center flex-1',
    author: 'flex items-center flex-1',
    updatedAt: 'flex items-center flex-1',
    manage: 'flex items-center',
};

interface StrategiesTableProps {
    strategies: StrategyPost[];
    containerRef: Ref<HTMLDivElement>;
    bodyHeight: number;
    virtualItems: VirtualItem[];
}

function StrategiesTable({
    strategies,
    containerRef,
    bodyHeight,
    virtualItems,
}: StrategiesTableProps) {
    return (
        <Table
            containerRef={containerRef}
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
                    <Table.Head className={`${CellStyles.manage} `}>
                        관리
                    </Table.Head>
                </Table.Row>
            </Table.Header>

            <Table.Body
                className={`relative flex flex-col`}
                style={{ height: `${bodyHeight}px` }}
            >
                {virtualItems.map(item => {
                    const strategy = strategies[item.index];

                    return (
                        <Table.Row
                            key={strategy.id}
                            className={`flex`}
                            data-id={item.index}
                            style={{
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                width: '100%',
                                height: `${item.size}px`,
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
                            <Table.Cell className={CellStyles.manage}>
                                <StrategyActionMenu />
                            </Table.Cell>
                        </Table.Row>
                    );
                })}
            </Table.Body>
        </Table>
    );
}

StrategiesTable.displayName = 'StrategiesTable';

export default StrategiesTable;

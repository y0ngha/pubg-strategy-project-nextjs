'use client';

import Table from '@/(presentation)/shared/components/table.component';
import MapBadge from '@/(presentation)/shared/components/map-badge.component';
import { cn } from '@/(presentation)/shared/utils/class-names.util';
import StrategyActionMenu from '@/(presentation)/(pages)/strategies/components/strategy-action-menu.component';
import { StrategyPost } from '@/(presentation)/shared/types/strategy';

interface StrategiesTableProps {
    strategies: StrategyPost[];
}

function StrategiesTable({ strategies }: StrategiesTableProps) {
    return (
        <Table>
            <Table.Header>
                <Table.Row isHeading={true}>
                    <Table.Head className="w-100">제목</Table.Head>
                    <Table.Head className="w-32">맵</Table.Head>
                    <Table.Head className="w-37.5">작성자</Table.Head>
                    <Table.Head className="w-37.5">업데이트 날짜</Table.Head>
                    <Table.Head className="w-25 text-right">관리</Table.Head>
                </Table.Row>
            </Table.Header>

            <Table.Body>
                {strategies.map(strategy => {
                    return (
                        <Table.Row key={strategy.id}>
                            <Table.Cell className={'font-medium'}>
                                <div className={'flex flex-col'}>
                                    <span className={'text-base'}>
                                        {strategy.title}
                                    </span>
                                </div>
                            </Table.Cell>
                            <Table.Cell>
                                <MapBadge
                                    className={cn('font-normal')}
                                    map={strategy.map}
                                >
                                    {strategy.map.toUpperCase()}
                                </MapBadge>
                            </Table.Cell>
                            <Table.Cell
                                className={'text-muted-foreground text-sm'}
                            >
                                {strategy.author}
                            </Table.Cell>
                            <Table.Cell
                                className={'text-muted-foreground text-sm'}
                            >
                                {strategy.updatedAt}
                            </Table.Cell>
                            <Table.Cell className={'text-right'}>
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

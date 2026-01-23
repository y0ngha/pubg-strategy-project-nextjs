import Card from '@/(presentation)/shared/components/card.component';
import { ArrowRight, FileText } from 'lucide-react';
import Link from 'next/link';
import MapBadge from '@/(presentation)/shared/components/map-badge.component';
import { ReactNode } from 'react';
import { Route } from '@/(presentation)/shared/constants/route';

type StrategiesBoardMap =
    | 'erangel'
    | 'miramar'
    | 'sanhok'
    | 'taego'
    | 'vikendi'
    | 'rondo'
    | 'karakin'
    | 'haven'
    | 'deston';

interface Strategy {
    id: string;
    map: StrategiesBoardMap;
    title: string;
    author: string;
}

interface StrategiesBoardProps {
    strategies: Strategy[];
}

function StrategiesBoardTitle({ children }: { children: ReactNode }) {
    return (
        <Card.Title className={'flex items-center gap-2 text-lg font-bold'}>
            <FileText className={'text-primary h-4 w-4'} />
            {children}
        </Card.Title>
    );
}

function StrategiesBoardMoreLink({ children }: { children: ReactNode }) {
    return (
        <Link
            href={Route.STRATEGIES}
            className={
                'text-muted-foreground hover:text-primary flex cursor-pointer items-center text-xs'
            }
        >
            {children}
        </Link>
    );
}

function StrategiesBoardHeader() {
    return (
        <Card.Header
            className={'flex flex-row items-center justify-between pb-2'}
        >
            <StrategiesBoardTitle>My Strategies</StrategiesBoardTitle>
            <StrategiesBoardMoreLink>
                더보기 <ArrowRight className={'ml-1 h-3 w-3'} />
            </StrategiesBoardMoreLink>
        </Card.Header>
    );
}

function StrategiesBoardMapCell({ map }: Pick<Strategy, 'map'>) {
    return (
        <div className={'w-1/5'}>
            <MapBadge map={map} className={'text-sm'}>
                {map}
            </MapBadge>
        </div>
    );
}

function StrategiesBoardTitleCell({ children }: { children: ReactNode }) {
    return (
        <span
            className={
                'group-hover:text-primary line-clamp-1 w-3/5 content-center text-sm leading-snug font-medium transition-colors'
            }
        >
            {children}
        </span>
    );
}

function StrategiesBoardAuthorCell({ children }: { children: ReactNode }) {
    return (
        <span
            className={
                'text-muted-foreground w-1/5 content-center text-right text-sm leading-snug font-medium'
            }
        >
            {children}
        </span>
    );
}

/**
 * TODO 나중에 Link 보낼 때 id 써서 전략 상세로 보내기
 */
function StrategiesBoardRow({ id, map, title, author }: Strategy) {
    return (
        <li
            className={
                'group hover:bg-muted/50 border-border/40 flex cursor-pointer flex-row gap-2 border-b px-6 py-3 transition-colors last:border-0'
            }
        >
            <StrategiesBoardMapCell map={map} />
            <StrategiesBoardTitleCell>{title}</StrategiesBoardTitleCell>
            <StrategiesBoardAuthorCell>{author}</StrategiesBoardAuthorCell>
        </li>
    );
}

function StrategiesBoardContent({ children }: { children: ReactNode }) {
    return (
        <Card.Content
            className={'flex-1 cursor-pointer overflow-hidden px-0 pb-0'}
        >
            <ul className={'flex h-full flex-col'}>{children}</ul>
        </Card.Content>
    );
}

function StrategiesEmpty() {
    return (
        <div className={'flex h-full w-full items-center justify-center'}>
            공유 받거나, 작성한 전략이 없어요.
        </div>
    );
}

function StrategiesBoard({ strategies }: StrategiesBoardProps) {
    return (
        <Card
            className={
                'border-border/50 bg-background/50 flex h-full flex-col backdrop-blur-sm'
            }
        >
            <StrategiesBoardHeader />

            <StrategiesBoardContent>
                {strategies.length === 0 && <StrategiesEmpty />}
                {strategies.map(({ id, map, title, author }) => {
                    return (
                        <StrategiesBoardRow
                            id={id}
                            author={author}
                            map={map}
                            title={title}
                            key={id}
                        />
                    );
                })}
            </StrategiesBoardContent>
        </Card>
    );
}

StrategiesBoardTitle.displayName = 'StrategiesBoardTitle';
StrategiesBoardMoreLink.displayName = 'StrategiesBoardMoreLink';
StrategiesBoardHeader.displayName = 'StrategiesBoardHeader';
StrategiesBoardMapCell.displayName = 'StrategiesBoardMapCell';
StrategiesBoardTitleCell.displayName = 'StrategiesBoardTitleCell';
StrategiesBoardAuthorCell.displayName = 'StrategiesBoardAuthorCell';
StrategiesBoardRow.displayName = 'StrategiesBoardRow';
StrategiesBoardContent.displayName = 'StrategiesBoardContent';
StrategiesBoard.displayName = 'StrategiesBoard';

export default StrategiesBoard;

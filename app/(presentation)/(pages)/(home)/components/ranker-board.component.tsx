import Link from 'next/link';
import { ArrowRight, Trophy } from 'lucide-react';
import { cn } from '@/(presentation)/shared/utils/class-names.util';
import Card from '@/(presentation)/shared/components/card.component';
import { HTMLAttributes, ReactNode } from 'react';
import { cva, VariantProps } from 'class-variance-authority';
import ServerIcon from '@/(presentation)/shared/icons/server-icon.component';
import { Route } from '@/(presentation)/shared/constants/route';

type PubgServer = 'steam' | 'kakao';

interface RankerBoardKDProps
    extends
        HTMLAttributes<HTMLSpanElement>,
        VariantProps<typeof RankerBoardKDVariants> {}

interface Ranker {
    rank: number;
    server: PubgServer;
    playerName: string;
    rp: number;
    kd: number;
}

interface RankerBoardRankProps
    extends
        HTMLAttributes<HTMLSpanElement>,
        VariantProps<typeof RankerBoardRankVariants> {}

interface RankerBoardProps {
    rankers: Ranker[];
}

function RankerBoardTitle({ children }: { children: ReactNode }) {
    return (
        <Card.Title className={'m-0 flex items-center gap-2 text-lg font-bold'}>
            <Trophy className={'h-4 w-4 text-yellow-500'} />
            {children}
        </Card.Title>
    );
}

function RankerBoardMoreLink({ children }: { children: ReactNode }) {
    return (
        <Link
            href={Route.LEADERBOARD}
            className={
                'text-muted-foreground hover:text-primary flex items-center text-xs'
            }
        >
            {children}
        </Link>
    );
}

function RankerBoardHeader() {
    return (
        <Card.Header
            className={'flex flex-row items-center justify-between pb-2'}
        >
            <RankerBoardTitle>Top 10 Players</RankerBoardTitle>
            <RankerBoardMoreLink>
                더보기 <ArrowRight className={'ml-1 h-3 w-3'} />
            </RankerBoardMoreLink>
        </Card.Header>
    );
}

const RankerBoardRankVariants = cva('w-4 text-center text-sm font-bold', {
    variants: {
        rank: {
            1: 'scale-110 text-yellow-500',
            2: 'scale-110 text-slate-400',
            3: 'scale-110 text-orange-500',
            others: 'text-muted-foreground',
        },
    },
    defaultVariants: {
        rank: 'others',
    },
});

function RankerBoardRank({ rank, children, ...props }: RankerBoardRankProps) {
    return (
        <span className={cn(RankerBoardRankVariants({ rank }))} {...props}>
            {children}
        </span>
    );
}

function RankerBoardServer({
    children,
    ...props
}: HTMLAttributes<HTMLDivElement>) {
    return (
        <div className={'flex items-center gap-3'}>
            <div
                className={
                    'group-hover:text-primary flex flex-col items-center justify-center text-xs leading-none font-medium transition-colors'
                }
                {...props}
            >
                {children}
            </div>
        </div>
    );
}

function RankerBoardPlayerName({
    children,
    ...props
}: HTMLAttributes<HTMLSpanElement>) {
    return (
        <div className={'flex items-center'}>
            <div className={'flex flex-col'}>
                <span
                    className={
                        'group-hover:text-primary text-sm leading-none font-medium transition-colors'
                    }
                    {...props}
                >
                    {children}
                </span>
            </div>
        </div>
    );
}

function RankerBoardRankPoint({
    children,
    ...props
}: HTMLAttributes<HTMLSpanElement>) {
    return (
        <span className={'text-foreground text-sm font-bold'} {...props}>
            {children}
        </span>
    );
}

const RankerBoardKDVariants = cva('', {
    variants: {
        kd: {
            up4: 'text-red-500',
            up3: 'text-purple-500',
            others: 'text-zinc-400',
        },
    },
});

function RankerBoardKD({ children, kd, ...props }: RankerBoardKDProps) {
    return (
        <div className={'text-muted-foreground text-[10px]'}>
            KD{' '}
            <span className={cn(RankerBoardKDVariants({ kd }))} {...props}>
                {children}
            </span>
        </div>
    );
}

/**
 * TODO 나중에 Link 보낼 때 playerName, server 써서 전적 검색으로 보내기
 */
function RankerBoardRow({ rank, server, playerName, rp, kd }: Ranker) {
    const rankProps =
        rank === 1 ? rank : rank === 2 ? rank : rank === 3 ? rank : 'others';

    const kdProps = kd >= 4.0 ? 'up4' : kd >= 3.0 ? 'up3' : 'others';

    return (
        <li
            className={
                'group hover:bg-muted/50 border-border/40 flex cursor-pointer items-center justify-between border-b px-6 py-3 transition-colors last:border-0'
            }
        >
            <div className={'flex items-center gap-4'}>
                <RankerBoardRank rank={rankProps}>{rank}</RankerBoardRank>
                <RankerBoardServer>
                    <ServerIcon
                        width={24}
                        height={24}
                        server={server.toLowerCase()}
                        kakaoColor={'#FEE500'}
                    />
                    {server.toUpperCase()}
                </RankerBoardServer>
                <RankerBoardPlayerName>{playerName}</RankerBoardPlayerName>
            </div>

            <div className={'text-right'}>
                <RankerBoardRankPoint>
                    {rp.toLocaleString()}
                </RankerBoardRankPoint>
                <RankerBoardKD kd={kdProps}>{kd}</RankerBoardKD>
            </div>
        </li>
    );
}

function RankerBoardContent({ children }: { children: ReactNode }) {
    return (
        <Card.Content className={'flex-1 overflow-hidden px-0 pb-0'}>
            <ul className={'flex h-full flex-col'}>{children}</ul>
        </Card.Content>
    );
}

function RankerBoard({ rankers }: RankerBoardProps) {
    return (
        <Card className={'flex h-full flex-col backdrop-blur-sm'}>
            <RankerBoardHeader />

            <RankerBoardContent>
                {rankers.map(({ rank, playerName, rp, kd, server }) => {
                    return (
                        <RankerBoardRow
                            rank={rank}
                            kd={kd}
                            rp={rp}
                            playerName={playerName}
                            server={server}
                            key={`${server}-${playerName}`}
                        />
                    );
                })}
            </RankerBoardContent>
        </Card>
    );
}

RankerBoardTitle.displayName = 'RankerBoardTitle';
RankerBoardMoreLink.displayName = 'RankerBoardMoreLink';
RankerBoardHeader.displayName = 'RankerBoardHeader';
RankerBoardRank.displayName = 'RankerBoardRank';
RankerBoardServer.displayName = 'RankerBoardServer';
RankerBoardPlayerName.displayName = 'RankerBoardPlayerName';
RankerBoardRankPoint.displayName = 'RankerBoardRankPoint';
RankerBoardKD.displayName = 'RankerBoardKD';
RankerBoardRow.displayName = 'RankerBoardRow';
RankerBoardContent.displayName = 'RankerBoardContent';
RankerBoard.displayName = 'RankerBoard';

export default RankerBoard;

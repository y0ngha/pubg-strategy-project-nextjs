import Link from 'next/link';
import { ArrowRight, Trophy } from 'lucide-react';
import { cn } from '@/(presentation)/shared/utils/class-names.util';
import Card from '@/(presentation)/shared/components/card.component';
import { HTMLAttributes, ReactNode } from 'react';
import { cva, VariantProps } from 'class-variance-authority';
import ServerIcon from '@/(presentation)/shared/icons/server-icon.component';

interface RankerBoardTitleProps {
    children: ReactNode;
}

function RankerBoardTitle({ children }: RankerBoardTitleProps) {
    return (
        <Card.Title className={'flex items-center gap-2 text-lg font-bold'}>
            <Trophy className={'h-4 w-4 text-yellow-500'} />
            {children}
        </Card.Title>
    );
}

interface RankerBoardMoreLinkProps {
    children: ReactNode;
}

function RankerBoardMoreLink({ children }: RankerBoardMoreLinkProps) {
    return (
        <Link
            href={'/leaderboard'}
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

interface RankerBoardRankProps
    extends
        HTMLAttributes<HTMLSpanElement>,
        VariantProps<typeof RankerBoardRankVariants> {}

function RankerBoardRank({ rank, children, ...props }: RankerBoardRankProps) {
    return (
        <span className={cn(RankerBoardRankVariants({ rank }))} {...props}>
            {children}
        </span>
    );
}

type RankerBoardServerProps = HTMLAttributes<HTMLDivElement>;

function RankerBoardServer({ children, ...props }: RankerBoardServerProps) {
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

type RankerBoardPlayerNameProps = HTMLAttributes<HTMLSpanElement>;

function RankerBoardPlayerName({
    children,
    ...props
}: RankerBoardPlayerNameProps) {
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

type RankerBoardRankPointProps = HTMLAttributes<HTMLSpanElement>;
// DIV

function RankerBoardRankPoint({
    children,
    ...props
}: RankerBoardRankPointProps) {
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

interface RankerBoardKDProps
    extends
        HTMLAttributes<HTMLSpanElement>,
        VariantProps<typeof RankerBoardKDVariants> {}

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

interface RankerBoardRowProps {
    rank: number;
    server: string;
    playerName: string;
    rp: number;
    kd: number;
}

function RankerBoardRow({
    rank,
    server,
    playerName,
    rp,
    kd,
}: RankerBoardRowProps) {
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
                        server={server}
                        kakaoColor={'#FEE500'}
                    />
                    {server}
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

interface RankerBoardContentProps {
    children: ReactNode;
}

function RankerBoardContent({ children }: RankerBoardContentProps) {
    return (
        <Card.Content className={'px-0 pb-0'}>
            <ul className={'flex flex-col'}>{children}</ul>
        </Card.Content>
    );
}

interface RankerBoardProps {
    rankers: {
        rank: number;
        kd: number;
        rp: number;
        name: string;
        server: string;
    }[];
}

function RankerBoard({ rankers }: RankerBoardProps) {
    return (
        <Card
            className={
                'border-border/50 bg-background/50 h-full backdrop-blur-sm'
            }
        >
            <RankerBoardHeader />

            <RankerBoardContent>
                {rankers.map(({ rank, name, rp, kd, server }) => {
                    return (
                        <RankerBoardRow
                            rank={rank}
                            kd={kd}
                            rp={rp}
                            playerName={name}
                            server={server}
                            key={`${server}-${name}`}
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

import HomePageLayout from '@/(presentation)/(pages)/(home)/components/home-page-layout.component';
import HomeHero from '@/(presentation)/(pages)/(home)/components/home-hero.component';
import RankerBoard from '@/(presentation)/(pages)/(home)/components/ranker-board.component';
import StrategiesBoard from '@/(presentation)/(pages)/(home)/components/strategies-board.component';
import StrategiesDehydrate from '@/dehydrate-components/strategies-dehydrate.component';

/**
 * Test용 Fixture
 */
const TOP_RANKERS: {
    rank: number;
    kd: number;
    rp: number;
    playerName: string;
    server: 'steam' | 'kakao';
}[] = [
    {
        rank: 1,
        playerName: 'Player1',
        server: 'kakao',
        rp: 4520,
        kd: 4.2,
    },
    {
        rank: 2,
        playerName: 'Player2',
        server: 'kakao',
        rp: 4480,
        kd: 3.8,
    },
    {
        rank: 3,
        playerName: 'Player3',
        server: 'steam',
        rp: 4350,
        kd: 3.5,
    },
    {
        rank: 4,
        playerName: 'Player4',
        server: 'steam',
        rp: 4210,
        kd: 3.1,
    },
    {
        rank: 5,
        playerName: 'Player5',
        server: 'kakao',
        rp: 4100,
        kd: 2.9,
    },
    {
        rank: 6,
        playerName: 'Player6',
        server: 'kakao',
        rp: 4100,
        kd: 2.9,
    },
    {
        rank: 7,
        playerName: 'Player7',
        server: 'kakao',
        rp: 4100,
        kd: 2.9,
    },
    {
        rank: 8,
        playerName: 'Player8',
        server: 'kakao',
        rp: 4100,
        kd: 2.9,
    },
    {
        rank: 9,
        playerName: 'Player9',
        server: 'kakao',
        rp: 4100,
        kd: 2.9,
    },
    {
        rank: 10,
        playerName: 'Player10',
        server: 'kakao',
        rp: 4100,
        kd: 2.9,
    },
];

export default function Home() {
    return (
        <HomePageLayout
            hero={<HomeHero />}
            main={
                <>
                    <div className={'flex-1'}>
                        <RankerBoard rankers={TOP_RANKERS} />
                    </div>
                    <div className={'flex-1'}>
                        <StrategiesDehydrate>
                            <StrategiesBoard />
                        </StrategiesDehydrate>
                    </div>
                </>
            }
        />
    );
}

import HomePageLayout from '@/(presentation)/(pages)/(home)/components/home-page-layout.component';
import HomeHero from '@/(presentation)/(pages)/(home)/components/home-hero.component';
import RankerBoard from '@/(presentation)/(pages)/(home)/components/ranker-board.component';

const TOP_RANKERS = [
    {
        rank: 1,
        name: 'Player1',
        server: 'Kakao',
        rp: 4520,
        kd: 4.2,
    },
    {
        rank: 2,
        name: 'Player2',
        server: 'Kakao',
        rp: 4480,
        kd: 3.8,
    },
    {
        rank: 3,
        name: 'Player3',
        server: 'Steam',
        rp: 4350,
        kd: 3.5,
    },
    {
        rank: 4,
        name: 'Player4',
        server: 'Steam',
        rp: 4210,
        kd: 3.1,
    },
    {
        rank: 5,
        name: 'Player5',
        server: 'Kakao',
        rp: 4100,
        kd: 2.9,
    },
    {
        rank: 6,
        name: 'Player6',
        server: 'Kakao',
        rp: 4100,
        kd: 2.9,
    },
    {
        rank: 7,
        name: 'Player7',
        server: 'Kakao',
        rp: 4100,
        kd: 2.9,
    },
    {
        rank: 8,
        name: 'Player8',
        server: 'Kakao',
        rp: 4100,
        kd: 2.9,
    },
    {
        rank: 9,
        name: 'Player9',
        server: 'Kakao',
        rp: 4100,
        kd: 2.9,
    },
    {
        rank: 10,
        name: 'Player10',
        server: 'Kakao',
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
                    <div className={'flex-1'}></div>
                </>
            }
        />
    );
}

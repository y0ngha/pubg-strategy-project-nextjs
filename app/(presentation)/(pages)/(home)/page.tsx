import RankerBoard from '@/(presentation)/(pages)/(home)/_components/ranker-board.component';
import StrategiesBoard from '@/(presentation)/(pages)/(home)/_components/strategies-board.component';
import StrategiesDehydrate from '@/(presentation)/dehydrates/strategies-dehydrate.component';
import Hero from '@/(presentation)/(pages)/(home)/_components/hero.component';
import PageLayout from '@/(presentation)/(pages)/(home)/_components/page-layout.component';

export default function Home() {
    return (
        <PageLayout
            hero={<Hero />}
            main={
                <>
                    <div className={'flex-1'}>
                        <RankerBoard rankers={[]} />
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

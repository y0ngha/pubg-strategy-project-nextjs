import PlayerSearch from '@/(presentation)/shared/components/player-search.component';
import HeroImage from '@/(presentation)/(pages)/(home)/_components/hero-image.component';

function Hero() {
    return (
        <div className={'relative h-full w-full'}>
            <HeroImage />
            <PlayerSearch />
        </div>
    );
}

Hero.displayName = 'Hero';

export default Hero;

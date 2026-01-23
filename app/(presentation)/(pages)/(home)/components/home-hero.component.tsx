import HomeHeroImage from '@/(presentation)/(pages)/(home)/components/home-hero-image.component';
import PlayerSearch from '@/(presentation)/shared/components/player-search.component';

function HomeHero() {
    return (
        <div className={'relative h-full w-full'}>
            <HomeHeroImage />
            <PlayerSearch />
        </div>
    );
}

HomeHero.displayName = 'HomeHero';

export default HomeHero;

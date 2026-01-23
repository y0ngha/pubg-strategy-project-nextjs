import Image from 'next/image';

function HomeHeroImage() {
    return (
        <Image
            src={'/images/home-hero.webp'}
            alt={'Hero Background'}
            className={'-z-10 object-cover opacity-50'}
            fill
            priority
        />
    );
}

HomeHeroImage.displayName = 'HomeHeroImage';

export default HomeHeroImage;

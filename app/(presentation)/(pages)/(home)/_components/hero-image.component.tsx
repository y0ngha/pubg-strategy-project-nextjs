import Image from 'next/image';

function HeroImage() {
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

HeroImage.displayName = 'HeroImage';

export default HeroImage;

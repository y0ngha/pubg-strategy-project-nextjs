import Link from 'next/link';
import { ReactNode } from 'react';
import Logo from '@/(presentation)/shared/components/logo.component';
import {
    LegalItems,
    NavigationItems,
} from '@/(presentation)/shared/constants/navigation';

interface LegalProps {
    legals: {
        href: string;
        children: ReactNode;
    }[];
}

interface NavigationItemProps {
    href: string;
    children: ReactNode;
}

function FooterCopyright() {
    return (
        <div className={'border-border/50 mt-12 border-t pt-8'}>
            <p
                className={
                    'text-muted-foreground text-center text-xs sm:text-left'
                }
            >
                &copy; 2026 PUBG.OP. All rights reserved.
            </p>
            <div
                className={
                    'mt-4 text-center text-[10px] leading-relaxed text-zinc-500 sm:text-left'
                }
            >
                <p>
                    PUBG, PLAYERUNKNOWN’S BATTLEGROUNDS and KRAFTON are
                    registered trademarks of KRAFTON, Inc.
                </p>
                <p className={'mt-1'}>
                    This website is a fan-made project and is not affiliated
                    with, endorsed by, or sponsored by KRAFTON, Inc. Data
                    provided by PUBG Official API.
                </p>
            </div>
        </div>
    );
}

function FooterIntroduce() {
    return (
        <div className={'md:col-span-2 lg:col-span-2'}>
            <Logo />

            <p
                className={
                    'text-muted-foreground max-w-xs text-sm leading-relaxed'
                }
            >
                데이터로 증명하는 승리의 방정식. <br />
                PUBG.OP에서 당신의 플레이를 분석하고, <br />
                최고의 전략을 수립하세요.
            </p>
        </div>
    );
}

function FooterNavigationHeader({ children }: { children: ReactNode }) {
    return (
        <h3 className={'text-sm font-semibold tracking-wide'}>{children}</h3>
    );
}

function FooterNavigationItemWrapper({ children }: { children: ReactNode }) {
    return (
        <ul className={'text-muted-foreground flex flex-col gap-2 text-sm'}>
            {children}
        </ul>
    );
}

function FooterNavigationItem({ href, children }: NavigationItemProps) {
    return (
        <li>
            <Link
                href={href}
                className={'hover:text-foreground transition-colors'}
            >
                {children}
            </Link>
        </li>
    );
}

interface FooterNavigationProps {
    title: string;
    navigationItems: {
        href: string;
        name: string;
    }[];
}

function FooterNavigation({ title, navigationItems }: FooterNavigationProps) {
    return (
        <div className={'flex flex-col gap-4'}>
            <FooterNavigationHeader>{title}</FooterNavigationHeader>
            <FooterNavigationItemWrapper>
                {navigationItems.map(navigation => {
                    return (
                        <FooterNavigationItem
                            href={navigation.href}
                            key={navigation.href}
                        >
                            {navigation.name}
                        </FooterNavigationItem>
                    );
                })}
            </FooterNavigationItemWrapper>
        </div>
    );
}

function FooterContainer({ children }: { children: ReactNode }) {
    return <div className={'container px-4 py-12 md:px-8'}>{children}</div>;
}

function FooterGrid({ children }: { children: ReactNode }) {
    return (
        <div className={'grid grid-cols-1 gap-8 md:grid-cols-4 lg:grid-cols-5'}>
            {children}
        </div>
    );
}

function FooterLegal({ legals }: LegalProps) {
    return (
        <div className={'flex flex-col gap-4'}>
            <h3 className={'text-sm font-semibold tracking-wide'}>Legal</h3>
            <ul className={'text-muted-foreground flex flex-col gap-2 text-sm'}>
                {legals.map(legal => {
                    return (
                        <li key={legal.href}>
                            <Link
                                href={legal.href}
                                className={
                                    'hover:text-foreground transition-colors'
                                }
                            >
                                {legal.children}
                            </Link>
                        </li>
                    );
                })}
            </ul>
        </div>
    );
}

function Footer() {
    return (
        <footer
            className={
                'bg-background/95 supports-backdrop-filter:bg-background/60 w-full border-t backdrop-blur'
            }
        >
            <FooterContainer>
                <FooterGrid>
                    <FooterIntroduce />
                    <FooterNavigation
                        title={'Product'}
                        navigationItems={NavigationItems}
                    />
                    <FooterNavigation
                        title={'Legal'}
                        navigationItems={LegalItems}
                    />
                </FooterGrid>

                <FooterCopyright />
            </FooterContainer>
        </footer>
    );
}

FooterLegal.displayName = 'FooterLegal';
FooterCopyright.displayName = 'FooterCopyright';
FooterIntroduce.displayName = 'FooterIntroduce';
FooterNavigationHeader.displayName = 'FooterNavigationHeader';
FooterNavigationItemWrapper.displayName = 'FooterNavigationItemWrapper';
FooterNavigationItem.displayName = 'FooterNavigationItem';
FooterNavigation.displayName = 'FooterNavigation';
FooterContainer.displayName = 'FooterContainer';
FooterGrid.displayName = 'FooterGrid';
Footer.displayName = 'Footer';

export default Footer;

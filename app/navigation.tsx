import Link from 'next/link';
import { Search } from 'lucide-react';
import Button from '@/(presentation)/shared/components/button.component';
import { ReactNode } from 'react';
import Logo from '@/(presentation)/shared/components/logo.component';
import { isAuthenticationComplete } from '@/(presentation)/shared/helpers/authentication.helper';
import { NavigationItems } from '@/(presentation)/shared/constants/navigation';
import { Routes } from '@/(presentation)/shared/constants/routes';

function NavigationBar({ children }: { children: ReactNode }) {
    return (
        <header
            className={
                'scroll border-border/40 bg-background/80 sticky top-0 z-50 w-full border-b backdrop-blur-md transition-all duration-300'
            }
        >
            <div
                className={
                    'container flex h-16 max-w-screen-2xl items-center justify-between px-4 sm:px-8'
                }
            >
                {children}
            </div>
        </header>
    );
}

function NavigationBarContainer({ children }: { children: ReactNode }) {
    return <div className={'flex items-center gap-2 md:gap-4'}>{children}</div>;
}

function NavigationBarItemNavWrapper({ children }: { children: ReactNode }) {
    return (
        <nav
            className={'hidden items-center gap-6 text-sm font-medium md:flex'}
        >
            {children}
        </nav>
    );
}

interface ItemProps {
    href: string;
    children: ReactNode;
}

function NavigationBarItem({ href, children }: ItemProps) {
    return (
        <Link
            href={href}
            className={
                'text-muted-foreground hover:text-primary transition-colors'
            }
        >
            {children}
        </Link>
    );
}

function NavigationBarOpenSearch() {
    return (
        <Button
            variant={'ghost'}
            className={'text-muted-foreground hover:text-foreground'}
            aria-label={'검색 열기'}
        >
            <Search className={'h-5 w-5'} />
        </Button>
    );
}

function NavigationBarMyPage() {
    return (
        <Link href={Routes.MYPAGE}>
            <Button size={'sm'} className={'hidden font-bold sm:flex'}>
                MyPage
            </Button>
        </Link>
    );
}

function NavigationBarLogin() {
    return (
        <Link href={Routes.LOGIN}>
            <Button size={'sm'} className={'hidden font-bold sm:flex'}>
                로그인
            </Button>
        </Link>
    );
}

async function Navigation() {
    return (
        <NavigationBar>
            <NavigationBarContainer>
                <Logo />
                <NavigationBarItemNavWrapper>
                    {NavigationItems.map(navigation => {
                        return (
                            <NavigationBarItem
                                href={navigation.href}
                                key={navigation.href}
                            >
                                {navigation.name}
                            </NavigationBarItem>
                        );
                    })}
                </NavigationBarItemNavWrapper>
            </NavigationBarContainer>

            <NavigationBarContainer>
                <NavigationBarOpenSearch />
                {(await isAuthenticationComplete()) ? (
                    <NavigationBarMyPage />
                ) : (
                    <NavigationBarLogin />
                )}
            </NavigationBarContainer>
        </NavigationBar>
    );
}

Navigation.displayName = 'Navigation';
NavigationBar.displayName = 'NavigationBar';
NavigationBarContainer.displayName = 'NavigationBar-Container';
NavigationBarItemNavWrapper.displayName = 'NavigationBar-ItemNavWrapper';
NavigationBarItem.displayName = 'NavigationBar-Item';
NavigationBarOpenSearch.displayName = 'NavigationBar-OpenSearch';
NavigationBarLogin.displayName = 'NavigationBar-Login';
NavigationBarMyPage.displayName = 'NavigationBar-MyPage';

export default Navigation;

import Link from 'next/link';
import { Search } from 'lucide-react';
import Button from '@/(presentation)/shared/components/button.component';
import { ReactNode } from 'react';

interface NavigationBarProps {
    children: ReactNode;
}

function NavigationBar({ children }: NavigationBarProps) {
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

interface ContainerProps {
    children: ReactNode;
}

function Container({ children }: ContainerProps) {
    return <div className={'flex items-center gap-2 md:gap-4'}>{children}</div>;
}

function Logo() {
    return (
        <Link href={'/public'} className={'group flex items-center gap-2'}>
            <span
                className={
                    'hidden text-xl font-black tracking-tighter italic sm:inline-block'
                }
            >
                PUBG<span className={'text-primary'}>.OP</span>
            </span>
        </Link>
    );
}

interface ItemNavWrapperProps {
    children: ReactNode;
}

function ItemNavWrapper({ children }: ItemNavWrapperProps) {
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

function Item({ href, children }: ItemProps) {
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

function OpenSearch() {
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

function MyPage() {
    return (
        <Link href={'/mypage'}>
            <Button size={'sm'} className={'hidden font-bold sm:flex'}>
                MyPage
            </Button>
        </Link>
    );
}

function Login() {
    return (
        <Link href={'/login'}>
            <Button size={'sm'} className={'hidden font-bold sm:flex'}>
                로그인
            </Button>
        </Link>
    );
}

NavigationBar.displayName = 'NavigationBar';
Container.displayName = 'NavigationBar-Container';
Logo.displayName = 'NavigationBar-Logo';
ItemNavWrapper.displayName = 'NavigationBar-ItemNavWrapper';
Item.displayName = 'NavigationBar-Item';
OpenSearch.displayName = 'NavigationBar-OpenSearch';
Login.displayName = 'NavigationBar-Login';
MyPage.displayName = 'NavigationBar-MyPage';

NavigationBar.Container = Container;
NavigationBar.Logo = Logo;
NavigationBar.ItemNavWrapper = ItemNavWrapper;
NavigationBar.Item = Item;
NavigationBar.OpenSearch = OpenSearch;
NavigationBar.Login = Login;
NavigationBar.MyPage = MyPage;

export default NavigationBar;

function Header() {
    return (
        <div>
            <h1 className={'text-3xl font-bold tracking-tight'}>나의 작전실</h1>
            <h2 className={'text-muted-foreground mt-1'}>
                전술을 수립하고, 데이터를 분석하여 치킨을 쟁취하세요.
            </h2>
        </div>
    );
}

Header.displayName = 'Header';

export default Header;

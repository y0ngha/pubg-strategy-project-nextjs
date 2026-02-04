'use client';

import { Tabs } from '@/(presentation)/shared/components/tabs.component';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

interface StrategiesTabsProps {
    tabs: {
        value: string;
        label: string;
    }[];
    queryParameterKey: string;
}

function StrategiesTabs({ tabs, queryParameterKey }: StrategiesTabsProps) {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const activeKey = searchParams.get(queryParameterKey) ?? tabs[0].value;

    const handleTabClick = (key: string) => {
        const currentParams = new URLSearchParams(searchParams.toString());

        currentParams.set(queryParameterKey, key);

        router.push(`${pathname}?${currentParams.toString()}`, {
            scroll: false,
        });
    };

    return (
        <Tabs
            onValueChange={handleTabClick}
            value={activeKey}
            className={'w-full'}
        >
            <Tabs.List>
                {tabs.map(tab => {
                    return (
                        <Tabs.Item value={tab.value} key={tab.value}>
                            {tab.label}
                        </Tabs.Item>
                    );
                })}
            </Tabs.List>
        </Tabs>
    );
}

export default StrategiesTabs;

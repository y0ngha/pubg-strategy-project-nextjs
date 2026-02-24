'use client';

import { Tabs } from '@/(presentation)/shared/components/tabs.component';

interface FriendsPageTabProps {
    activeTab: string;
    onTabChange: (activeTab: string) => void;
    tabs: { title: string; value: string }[];
}

function FriendsPageTab({ activeTab, onTabChange, tabs }: FriendsPageTabProps) {
    return (
        <Tabs
            value={activeTab}
            className={'w-full'}
            onValueChange={onTabChange}
        >
            <Tabs.List>
                {tabs.map(tab => {
                    return (
                        <Tabs.Item value={tab.value} key={tab.value}>
                            {tab.title}
                        </Tabs.Item>
                    );
                })}
            </Tabs.List>
        </Tabs>
    );
}

FriendsPageTab.displayName = 'FriendsPageTab';

export default FriendsPageTab;

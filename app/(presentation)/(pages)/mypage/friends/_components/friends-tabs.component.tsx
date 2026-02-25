'use client';

import { Tabs } from '@/(presentation)/shared/components/tabs.component';

interface FriendsTabsProps {
    activeTab: string;
    onTabChange: (activeTab: string) => void;
    tabs: { title: string; value: string }[];
}

function FriendsTabs({ activeTab, onTabChange, tabs }: FriendsTabsProps) {
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

FriendsTabs.displayName = 'FriendsTabs';

export default FriendsTabs;

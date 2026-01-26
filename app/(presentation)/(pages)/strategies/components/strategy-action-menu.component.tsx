'use client';

import Dropdown from '@/(presentation)/shared/components/dropdown.component';
import Button from '@/(presentation)/shared/components/button.component';
import { MoreHorizontal, Pencil, Share2, Trash2 } from 'lucide-react';

function StrategyActionMenu() {
    return (
        <Dropdown>
            <Dropdown.Trigger asChild>
                <Button variant={'ghost'} className={'h-8 w-8 p-0'}>
                    <span className={'sr-only'}>메뉴 열기</span>
                    <MoreHorizontal className={'h-4 w-4'} />
                </Button>
            </Dropdown.Trigger>
            <Dropdown.Content align={'end'}>
                <Dropdown.Label>Actions</Dropdown.Label>
                <Dropdown.Item className={'cursor-pointer'}>
                    <Pencil className={'mr-2 h-4 w-4'} /> 수정하기
                </Dropdown.Item>
                <Dropdown.Item className={'cursor-pointer'}>
                    <Share2 className={'mr-2 h-4 w-4'} /> 전략공유
                </Dropdown.Item>
                <Dropdown.Separator />
                <Dropdown.Item
                    className={
                        'text-destructive focus:text-destructive cursor-pointer'
                    }
                >
                    <Trash2 className={'mr-2 h-4 w-4'} /> 삭제하기
                </Dropdown.Item>
            </Dropdown.Content>
        </Dropdown>
    );
}

StrategyActionMenu.displayName = 'StrategyActionMenu';

export default StrategyActionMenu;

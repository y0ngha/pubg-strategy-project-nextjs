'use client';

import Input from '@/(presentation)/shared/components/input.component';
import Link from 'next/link';
import { Route } from '@/(presentation)/shared/constants/route';
import { ChevronLeft } from 'lucide-react';
import Button from '@/(presentation)/shared/components/button.component';
import { useUpdateStrategyMutation } from '@/(presentation)/(pages)/strategies/[id]/components/hooks/useUpdateStrategyMutation';
import { SubmitHandler, useForm } from 'react-hook-form';

interface StrategyUpdateFormInputs {
    title: string;
    map: string;
}

interface StrategyHeaderProps {
    id: string;
    title: string;
}

function StrategyHeader({ id, title }: StrategyHeaderProps) {
    const { updateStrategy } = useUpdateStrategyMutation(id);
    const { register, handleSubmit } = useForm<StrategyUpdateFormInputs>();

    const onSubmit: SubmitHandler<StrategyUpdateFormInputs> = data => {
        const formData = new FormData();
        formData.set('title', data.title);

        updateStrategy(formData);
    };

    return (
        <div className={'flex h-[60] w-full flex-row border-b border-amber-50'}>
            <div
                className={'flex h-full flex-1 items-center justify-start p-2'}
            >
                <Link href={Route.STRATEGIES}>
                    <div className={'flex flex-row gap-1'}>
                        <ChevronLeft />
                        뒤로가기
                    </div>
                </Link>
            </div>
            <form
                onSubmit={handleSubmit(onSubmit)}
                className={'flex h-full flex-9 flex-row'}
            >
                <div
                    className={
                        'flex h-full flex-8 items-center justify-start gap-4 p-2'
                    }
                >
                    <div className={'flex-1'}>
                        <Input {...register('title')} defaultValue={title} />
                    </div>
                </div>
                <div
                    className={
                        'flex h-full flex-1 items-center justify-start p-2'
                    }
                >
                    <Button
                        type={'submit'}
                        className={'w-full'}
                        variant={'primary'}
                    >
                        저장
                    </Button>
                </div>
            </form>
        </div>
    );
}

StrategyHeader.displayName = 'StrategyHeader';

export default StrategyHeader;

import Button from '@/(presentation)/shared/components/button.component';
import Select from '@/(presentation)/shared/components/select.component';

export default function Home() {
    return (
        <div className={'flex h-full w-full flex-col gap-4'}>
            <div className={'flex w-full flex-row gap-1'}>
                <Button variant={'primary'}>primary</Button>
                <Button variant={'secondary'}>secondary</Button>
                <Button variant={'ghost'}>ghost</Button>
                <Button variant={'outline'}>outline</Button>
                <Button variant={'danger'}>danger</Button>
            </div>

            {/*<div className={'flex w-full flex-row gap-1'}>*/}
            {/*    <div className={'flex w-full flex-row gap-1'}>*/}
            {/*        <Input label={'Label'} />*/}
            {/*        <Input*/}
            {/*            label={'Error'}*/}
            {/*            error={'Error Message'}*/}
            {/*            disabled={true}*/}
            {/*        />*/}
            {/*        <Input label={'Type Password'} type={'password'} />*/}
            {/*    </div>*/}
            {/*</div>*/}

            <div className={'flex w-full flex-row gap-1'}>
                <Select
                    disabled={true}
                    size={'sm'}
                    label={'size=sm'}
                    options={[
                        {
                            label: '1',
                            value: 2,
                        },
                    ]}
                />
                <Select
                    size={'lg'}
                    label={'size=lg, error'}
                    error={'Error Message'}
                    options={[
                        {
                            label: '1',
                            value: 2,
                        },
                    ]}
                />
                <Select
                    size={'normal'}
                    label={'size=normal'}
                    options={[
                        {
                            label: '1',
                            value: 2,
                        },
                    ]}
                />
            </div>
        </div>
    );
}

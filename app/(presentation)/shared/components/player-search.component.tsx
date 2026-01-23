'use client';

import Input from '@/(presentation)/shared/components/input.component';
import Select from '@/(presentation)/shared/components/select.component';

function PlayerSearch() {
    return (
        <div
            className={
                'relative z-10 flex h-full flex-row items-center justify-center gap-2 p-10 text-white'
            }
        >
            <Select onValueChange={() => {}} className={'w-32'}>
                <Select.Option value={'Steam'}>Steam</Select.Option>
                <Select.Option value={'Kakao'}>Kakao</Select.Option>
            </Select>
            <Input
                type={'text'}
                className={'w-96'}
                placeholder={'배틀그라운드 닉네임을 검색하세요.'}
            />
        </div>
    );
}

PlayerSearch.displayName = 'PlayerSearch';

export default PlayerSearch;

'use server';

import { DeleteTagUseCase } from '@/application/strategy/use-cases/tag/delete-tag.usecase';
import { initializeRequestServices } from '@global/di/server/get-server-dependency';
import { parseFormData } from '@/presentation/helpers/form-data.helper';

export async function deleteTagAction(_: unknown, formData: FormData) {
    const getService = initializeRequestServices();

    const { userId, strategyId, tagId } = parseFormData(formData, [
        {
            key: 'userId',
            error: '유저 고유 식별자를 불러올 수 없습니다.',
            type: 'string',
        },
        {
            key: 'strategyId',
            error: '전략 고유 식별자를 불러올 수 없습니다.',
            type: 'string',
        },
        {
            key: 'tagId',
            error: '태그 고유 식별자를 불러올 수 없습니다.',
            type: 'string',
        },
    ] as const);

    const useCase = getService(DeleteTagUseCase);

    const dto = {
        actorId: userId,
        strategyId: strategyId,
        tagId: tagId,
    };

    return await useCase.execute(dto);
}

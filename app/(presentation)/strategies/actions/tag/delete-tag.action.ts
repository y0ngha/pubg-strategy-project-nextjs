'use server';

import { DeleteTagUseCase } from '@/application/strategy/use-cases/tag/delete-tag.usecase';
import { initializeRequestServices } from '@global/di/server/get-server-dependency';
import { parseFormData } from '@/(presentation)/shared/helpers/form-data.helper';
import { ensureAuthentication } from '@/(presentation)/shared/helpers/authentication.helper';

export type DeleteTagAction = { tagId: string };

export async function deleteTagAction(
    formData: FormData
): Promise<DeleteTagAction> {
    await ensureAuthentication();

    const getService = initializeRequestServices();

    const { strategyId, tagId } = parseFormData(formData, [
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
        strategyId: strategyId,
        tagId: tagId,
    };

    return await useCase.execute(dto);
}

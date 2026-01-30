'use server';

import { CreateTagUseCase } from '@/application/strategy/use-cases/tag/create-tag.usecase';
import { initializeRequestServices } from '@global/di/server/get-server-dependency';
import { parseFormData } from '@/(presentation)/shared/helpers/form-data.helper';
import { Position } from '@/application/strategy/types/position';
import { ensureAuthentication } from '@/(presentation)/shared/helpers/authentication.helper';

export type CreateTagAction = {
    id: string;
    content: string;
    position: Position;
};

export async function createTagAction(
    formData: FormData
): Promise<CreateTagAction> {
    await ensureAuthentication();

    const getService = initializeRequestServices();

    const { userId, strategyId, content, position } = parseFormData(formData, [
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
            key: 'content',
            error: '태그 내용을 불러올 수 없습니다.',
            type: 'string',
        },
        {
            key: 'position',
            error: '자기장 위치를 불러올 수 없습니다.',
            type: 'position',
        },
    ] as const);

    const useCase = getService(CreateTagUseCase);

    const dto = {
        actorId: userId,
        strategyId: strategyId,
        content: content,
        position: position,
    };

    return await useCase.execute(dto);
}

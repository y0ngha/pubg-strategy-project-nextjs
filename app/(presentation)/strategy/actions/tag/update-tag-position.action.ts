'use server';

import { initializeRequestServices } from '@global/di/server/get-server-dependency';
import { parseFormData } from '@/(presentation)/shared/helpers/form-data.helper';
import { UpdateTagPositionUseCase } from '@/application/strategy/use-cases/tag/update-tag-position.usecase';
import { Position } from '@domain/strategy/models/position.model';

export type UpdateTagPositionAction = {
    id: string;
    position: Position;
};

export async function updateTagPositionAction(
    formData: FormData
): Promise<UpdateTagPositionAction> {
    const getService = initializeRequestServices();

    const { strategyId, tagId, position } = parseFormData(formData, [
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
        {
            key: 'position',
            error: '자기장 위치를 불러올 수 없습니다.',
            type: 'position',
        },
    ] as const);

    const useCase = getService(UpdateTagPositionUseCase);

    const dto = {
        strategyId: strategyId,
        tagId: tagId,
        position: position,
    };

    return await useCase.execute(dto);
}

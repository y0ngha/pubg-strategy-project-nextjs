'use server';

import { initializeRequestServices } from '@global/di/server/get-server-dependency';
import { parseFormData } from '@/(presentation)/shared/helpers/form-data.helper';
import { ensureAuthentication } from '@/(presentation)/shared/helpers/authentication.helper';
import { UpdateStrategyTitleUseCase } from '@/application/strategy/use-cases/strategy/update-strategy-title.usecase';

export type UpdateStrategyTitleAction = { strategyId: string; title: string };

export async function updateStrategyTitleAction(
    formData: FormData
): Promise<UpdateStrategyTitleAction> {
    await ensureAuthentication();

    const getService = initializeRequestServices();

    const { strategyId, title } = parseFormData(formData, [
        {
            key: 'strategyId',
            error: '전략 고유 식별자를 불러올 수 없습니다.',
            type: 'string',
        },
        {
            key: 'title',
            error: '전략 제목을 불러올 수 없습니다.',
            type: 'string',
        },
    ] as const);

    const useCase = getService(UpdateStrategyTitleUseCase);

    const dto = {
        strategyId: strategyId,
        title: title,
    };

    return await useCase.execute(dto);
}

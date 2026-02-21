'use server';

import { initializeRequestServices } from '@global/di/server/get-server-dependency';
import { parseFormData } from '@/(presentation)/shared/helpers/form-data.helper';
import { RevokeStrategyShareUseCase } from '@/application/strategy/use-cases/share/revoke-strategy-share.usecase';

export type RevokeStrategyShareAction = {
    strategyShareId: string;
};

export async function revokeStrategyShareAction(
    formData: FormData
): Promise<RevokeStrategyShareAction> {
    const getService = initializeRequestServices();

    const { strategyId, strategyShareId } = parseFormData(formData, [
        {
            key: 'strategyId',
            error: '전략 고유 식별자를 불러올 수 없습니다.',
            type: 'string',
        },
        {
            key: 'strategyShareId',
            error: '전략 공유 고유 식별자를 불러올 수 없습니다.',
            type: 'string',
        },
    ] as const);

    const useCase = getService(RevokeStrategyShareUseCase);

    const dto = {
        strategyId: strategyId,
        strategyShareId: strategyShareId,
    };

    await useCase.execute(dto);

    return {
        strategyShareId: strategyShareId,
    };
}

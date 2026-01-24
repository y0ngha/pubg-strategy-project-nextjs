import { GetStrategiesResponseDto } from '@/application/strategy/dto/strategy/get-strategy.dto';

export function sortingByNewestAndTitle(
    a: GetStrategiesResponseDto[number],
    b: GetStrategiesResponseDto[number]
): number {
    const timeDiff = b.createdAt.getTime() - a.createdAt.getTime();

    return timeDiff !== 0 ? timeDiff : a.title.localeCompare(b.title);
}

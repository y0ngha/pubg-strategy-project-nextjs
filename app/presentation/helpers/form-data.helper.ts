import { Position } from '@/application/strategy/types/position';

type FieldTypeMap = {
    string: string;
    number: number;
    position: Position;
};

interface Field {
    key: string;
    error?: string;
    type: keyof FieldTypeMap;
    allowUndefined?: boolean;
}

type Parsers = {
    [K in keyof FieldTypeMap]: (
        value: FormDataEntryValue,
        error?: string
    ) => FieldTypeMap[K];
};

type ParsedFormData<T extends readonly Field[]> = {
    [K in T[number] as K['key']]: K['allowUndefined'] extends true
        ? FieldTypeMap[K['type']] | undefined
        : FieldTypeMap[K['type']];
};

export function parseFormData<T extends readonly Field[]>(
    formData: FormData,
    fields: T
): ParsedFormData<T>;

export function parseFormData<T extends readonly Field[]>(
    formData: FormData,
    fields: T
) {
    const data: Record<string, string | number | Position> = {};

    for (const { key, error, type, allowUndefined } of fields) {
        const errorMessage = error ? error : `${key}를 불러올 수 없습니다.`;

        const value = formData.get(key);

        if (value == null) {
            if (allowUndefined) continue;

            throw new Error(errorMessage);
        }

        data[key] = parsers[type](value, errorMessage);
    }

    return data;
}

const parsers: Parsers = {
    string: (value: FormDataEntryValue) => value.toString(),

    number: (value: FormDataEntryValue, error?: string) =>
        safeParseNumber(value, error),

    position: (value: FormDataEntryValue, error?: string) => {
        try {
            const json = JSON.parse(value.toString());

            const x = safeParseNumber(json?.x, error);
            const y = safeParseNumber(json?.y, error);

            return { x, y };
        } catch {
            throw new Error(error);
        }
    },
};

function safeParseNumber(value: unknown, error?: string): number {
    const parsed = Number(value);
    if (Number.isNaN(parsed) || !Number.isFinite(parsed))
        throw new Error(error);

    return parsed;
}

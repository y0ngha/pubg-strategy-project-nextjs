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

type BaseType<T> = T extends 'number' ? number : string;

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
    const data: Record<string, string | number> = {};

    for (const { key, error, type, allowUndefined } of fields) {
        const errorMessage = error ? error : `${key}를 불러올 수 없습니다.`;

        const value = formData.get(key);

        if (value == null) {
            if (allowUndefined) continue;

            throw new Error(errorMessage);
        }

        switch (type) {
            case 'string':
                data[key] = value.toString();
                break;
            case 'number':
                data[key] = parseNumber(value, errorMessage);
                break;
        }
    }

    return data;
}

function parseNumber(value: FormDataEntryValue | null, error?: string): number {
    if (!value) {
        throw new Error(error);
    }

    const parsed = Number(value);

    if (Number.isNaN(parsed) || !Number.isFinite(parsed)) {
        throw new Error(error);
    }

    return parsed;
}

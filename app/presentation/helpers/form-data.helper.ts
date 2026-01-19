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
    isArray?: boolean;
}

type Parsers = {
    [K in keyof FieldTypeMap]: (
        value: unknown,
        error?: string
    ) => FieldTypeMap[K];
};

type ParsedFormData<T extends readonly Field[]> = {
    [K in T[number] as K['key']]: K['allowUndefined'] extends true
        ? BaseType<FieldTypeMap[K['type']], K['isArray']> | undefined
        : BaseType<FieldTypeMap[K['type']], K['isArray']>;
};

type BaseType<T, IsArray> = IsArray extends true ? T[] : T;

export function parseFormData<T extends readonly Field[]>(
    formData: FormData,
    fields: T
): ParsedFormData<T>;

export function parseFormData<T extends readonly Field[]>(
    formData: FormData,
    fields: T
) {
    const data: Record<
        string,
        FieldTypeMap[keyof FieldTypeMap] | FieldTypeMap[keyof FieldTypeMap][]
    > = {};

    for (const { key, error, type, allowUndefined, isArray } of fields) {
        const errorMessage = error ? error : `${key}를 불러올 수 없습니다.`;

        const value = formData.get(key);

        if (value == null) {
            if (allowUndefined) continue;

            throw new Error(errorMessage);
        }

        if (isArray) {
            try {
                const parsedArray = JSON.parse(value.toString());

                if (!Array.isArray(parsedArray)) {
                    throw new Error(errorMessage);
                }

                data[key] = parsedArray.map(item =>
                    parsers[type](item, errorMessage)
                );
            } catch {
                throw new Error(errorMessage);
            }
        } else {
            data[key] = parsers[type](value, errorMessage);
        }
    }

    return data;
}

const parsers: Parsers = {
    string: (value: unknown) => String(value),

    number: (value: unknown, error?: string) => safeParseNumber(value, error),

    position: (value: unknown, error?: string) => {
        try {
            const json =
                typeof value === 'string'
                    ? JSON.parse(value.toString())
                    : value;

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

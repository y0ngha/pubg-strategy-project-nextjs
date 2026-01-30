import { Position } from '@/application/strategy/types/position';

type FieldTypeMap = {
    string: string;
    number: number;
    boolean: boolean;
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
    const entries = fields.map(field => parseField(formData, field));

    return Object.fromEntries(entries);
}

function parseField(
    formData: FormData,
    field: Field
): [
    string,
    (
        | FieldTypeMap[keyof FieldTypeMap]
        | FieldTypeMap[keyof FieldTypeMap][]
        | undefined
    ),
] {
    const { key, error, type, allowUndefined, isArray } = field;
    const errorMessage = error ?? `${key}를 불러올 수 없습니다.`;

    const value = formData.get(key);

    if (value == null || value === '') {
        if (allowUndefined) return [key, undefined];
        throw new Error(errorMessage);
    }

    const parsedValue = isArray
        ? parseArrayValue(value, type, errorMessage)
        : parsers[type](value, errorMessage);

    return [key, parsedValue];
}

/**
 * 만약 파일 객체를 써야한다면, 해당 부분은 수정되어야함.
 */
function parseArrayValue(
    value: FormDataEntryValue,
    type: keyof FieldTypeMap,
    error: string
) {
    try {
        const parsedArray = JSON.parse(value.toString());

        if (!Array.isArray(parsedArray)) {
            throw new Error(error);
        }

        return parsedArray.map(item => parsers[type](item, error));
    } catch {
        throw new Error(error);
    }
}

const parsers: Parsers = {
    string: (value: unknown) => String(value),

    number: (value: unknown, error?: string) => safeParseNumber(value, error),

    boolean: (value: unknown, error?: string) => safeParseBoolean(value, error),

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
    if (value === '') throw new Error(error);

    const parsed = Number(value);
    if (Number.isNaN(parsed) || !Number.isFinite(parsed))
        throw new Error(error);

    return parsed;
}

function safeParseBoolean(value: unknown, error?: string): boolean {
    if (value === '') throw new Error(error);

    if (typeof value === 'boolean') return value;

    if (typeof value !== 'string') throw new Error(error);

    const lowercaseValue = value.toLowerCase();

    return lowercaseValue === 'true' || lowercaseValue === 'on';
}

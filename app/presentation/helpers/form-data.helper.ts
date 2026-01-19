interface Field {
    key: string;
    error: string;
    type: 'string' | 'number';
}

type ParsedFormData<T extends readonly Field[]> = {
    [K in T[number] as K['key']]: K['type'] extends 'number' ? number : string;
};

export function getRequiredFormData<T extends readonly Field[]>(
    formData: FormData,
    fields: T
): ParsedFormData<T>;

export function getRequiredFormData<T extends readonly Field[]>(
    formData: FormData,
    fields: T
) {
    const data: Record<string, string | number> = {};

    for (const { key, error, type } of fields) {
        const value = formData.get(key);

        if (value === null || value === undefined) {
            throw new Error(error);
        }

        switch (type) {
            case 'string':
                data[key] = value.toString();
                break;
            case 'number':
                data[key] = parseNumber(value, error);
                break;
        }
    }

    return data;
}

function parseNumber(value: FormDataEntryValue | null, error: string): number {
    if (!value) {
        throw new Error(error);
    }

    const parsed = Number(value);

    if (Number.isNaN(parsed) || !Number.isFinite(parsed)) {
        throw new Error(error);
    }

    return parsed;
}

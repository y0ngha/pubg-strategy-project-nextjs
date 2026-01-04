export function getRequiredFormData(
    formData: FormData,
    fields: { key: string; error: string }[]
) {
    const data: Record<string, string> = {};
    for (const { key, error } of fields) {
        const value = formData.get(key)?.toString();

        if (value === undefined) {
            throw new Error(error);
        }

        data[key] = value;
    }
    return data;
}

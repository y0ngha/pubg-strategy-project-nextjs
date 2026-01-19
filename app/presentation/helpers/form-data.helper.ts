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

    const parsed = Number(value);

    if (Number.isNaN(parsed) || !Number.isFinite(parsed)) {
        throw new Error(error);
    }

    return parsed;
}

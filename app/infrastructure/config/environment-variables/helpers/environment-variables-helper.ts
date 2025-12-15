import z from 'zod';

export function validateEnvironmentVariables<T extends z.ZodObject>(
    envSchema: T
): z.infer<T> {
    const parsed = envSchema.safeParse(process.env);

    if (!parsed.success) {
        throw new Error(
            `Invalid environment variables. Please check the configuration. > ${JSON.stringify(parsed.error.format(), null, 2)}`
        );
    }

    return parsed.data;
}

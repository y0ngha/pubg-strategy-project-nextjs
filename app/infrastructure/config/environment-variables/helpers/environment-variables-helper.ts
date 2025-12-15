import z from 'zod';

export function validateEnvironmentVariables<T extends z.ZodObject>(
    envSchema: T
): z.infer<T> {
    const parsed = envSchema.safeParse(process.env);

    if (!parsed.success) {
        console.error(
            '❌ Invalid environment variables:',
            JSON.stringify(parsed.error.format(), null, 2)
        );
        throw new Error(
            'Invalid environment variables. Please check the configuration.'
        );
    }

    return parsed.data;
}

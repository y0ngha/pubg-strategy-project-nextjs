import { z } from 'zod';

export const EnvironmentVariablesSchema: z.ZodObject = z.object({
    NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
    NEXT_PUBLIC_API_URL: z.url({
        message: 'NEXT_PUBLIC_API_URL must be a valid URL',
    }),
    NEXT_BACKEND_API_URL: z.url({
        message: 'NEXT_BACKEND_API_URL must be a valid URL',
    }),
    GOOGLE_CLIENT_ID: z.string().optional(),
    GOOGLE_CLIENT_SECRET: z.string().optional(),
    GOOGLE_REDIRECT_URI: z.url()
});

export type Env = z.infer<typeof EnvironmentVariablesSchema>;
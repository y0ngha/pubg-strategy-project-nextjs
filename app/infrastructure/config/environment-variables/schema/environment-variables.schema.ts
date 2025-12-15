import { z } from 'zod';

export const EnvironmentVariablesSchema = z
    .object({
        NODE_ENV: z
            .enum(['development', 'production', 'test'])
            .default('development'),
        NEXT_PUBLIC_API_URL: z.url({
            message: 'NEXT_PUBLIC_API_URL must be a valid URL',
        }),
        NEXT_BACKEND_API_URL: z.url({
            message: 'NEXT_BACKEND_API_URL must be a valid URL',
        }),
        GOOGLE_CLIENT_ID: z.string().optional(),
        GOOGLE_CLIENT_SECRET: z.string().optional(),
        GOOGLE_REDIRECT_URI: z.url().optional(),
    })
    .refine(
        data => {
            if (data.NODE_ENV === 'production') {
                return (
                    !!data.GOOGLE_CLIENT_ID &&
                    !!data.GOOGLE_CLIENT_SECRET &&
                    !!data.GOOGLE_REDIRECT_URI
                );
            }
            return true;
        },
        {
            message:
                '프로덕션 환경에서는 GOOGLE_CLIENT_ID && GOOGLE_CLIENT_SECRET && GOOGLE_REDIRECT_URI 이 필수입니다.',
            path: [
                'GOOGLE_CLIENT_ID',
                'GOOGLE_CLIENT_SECRET',
                'GOOGLE_REDIRECT_URI',
            ],
        }
    );

export type Env = z.infer<typeof EnvironmentVariablesSchema>;

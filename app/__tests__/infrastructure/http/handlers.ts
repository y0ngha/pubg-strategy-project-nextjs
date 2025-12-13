import { ApiError } from '@/infrastructure/http/api-errors';
import { http, HttpResponse } from 'msw';

export const handlers = [
    http.get('http://localhost:3001/api/users/:id', ({ params }) => {
        const { id } = params;
        if (id === '1') {
            return HttpResponse.json({ id: 1, name: 'Test User' }, { status: 200 });
        }
        return new HttpResponse(null, { status: 404 });
    }),


    http.post('http://localhost:3001/api/posts', async ({ request }) => {
        const newPost = await request.json() as { [key: string]: unknown };
        return HttpResponse.json({ id: 101, ...newPost }, { status: 201 });
    }),

    http.delete('http://localhost:3001/api/users/:id', ({ params }) => {
        const { id } = params;
        if (id === '1') {
            return new HttpResponse(null, { status: 204 });
        }
        return new HttpResponse(null, { status: 404 });
    }),

    http.put('http://localhost:3001/api/users/:id', async ({ params, request }) => {
        const { id } = params;
        if (id === '1') {
            const payload = await request.json() as { [key: string]: unknown };
            return HttpResponse.json({ id: 1, ...payload }, { status: 200 });
        }
        return new HttpResponse(null, { status: 404 });
    }),

    http.patch('http://localhost:3001/api/users/:id', async ({ params, request }) => {
        const { id } = params;
        if (id === '1') {
            const payload = await request.json() as { [key: string]: unknown };
            return HttpResponse.json({ id: 1, ...payload }, { status: 200 });
        }
        return new HttpResponse(null, { status: 404 });
    }),

    http.get('http://localhost:3001/api/protected', ({ request }) => {
        const authHeader = request.headers.get('authorization');

        if (authHeader) {
            if (authHeader === 'Bearer test-token-123') {
                return HttpResponse.json({ success: true }, { status: 200 });
            }
        }

        return HttpResponse.json(null, { status: 401, statusText: 'Unauthorized' });
    }),

    http.get('http://localhost:3001/api/error', () => {
        return HttpResponse.json(null, { status: 500, statusText: 'Internal Server Error' });
    }),

    http.get('http://localhost:3001/api/slow', async () => {
        await new Promise(resolve => setTimeout(resolve, 1000));
        return HttpResponse.json({ message: 'Delayed success' }, { status: 200 });
    }),
];
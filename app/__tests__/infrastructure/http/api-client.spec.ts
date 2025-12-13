import 'reflect-metadata';
import { http, HttpResponse } from 'msw';
import { ApiClient } from '@/infrastructure/http/api-client';
import { NotFoundError, UnauthorizedError, TimeoutError, NetworkError, ApiError } from '@/infrastructure/http/api-errors';
import { server } from './api-client.setup';

// 테스트를 위한 Base URL
const BASE_URL = 'http://localhost:3001';

jest.mock('next/headers', () => ({
    cookies: jest.fn(() => Promise.resolve({
        get: jest.fn((name: string) => {
            if (name === 'auth_token') {
                return { value: 'test-token-123' };
            }
            return undefined;
        }),
    })),
}));

describe('ApiClient', () => {
    let client: ApiClient;

    beforeEach(() => {
        // 테스트 케이스마다 새로운 인스턴스 생성
        client = new ApiClient(BASE_URL);
    });

    // --- 성공 케이스 테스트 ---

    test('GET 요청이 성공하고 데이터를 반환해야 한다', async () => {
        const user = await client.get<{ id: number; name: string }>('/api/users/1');

        expect(user).toEqual({ id: 1, name: 'Test User' });
    });

    test('POST 요청이 성공하고 생성된 데이터를 반환해야 한다', async () => {
        const payload = { title: 'New Post', body: 'Content' };
        const newPost = await client.post<{ id: number; title: string }, typeof payload>(
            '/api/posts',
            payload
        );

        expect(newPost).toEqual({ id: 101, title: 'New Post', body: 'Content' });
    });

    test('DELETE 요청이 성공해야 하고, 204 No Content 응답 시 undefined를 반환해야 한다.', async () => {
        const result = await client.delete('/api/users/1',);
        expect(result).toBeUndefined();
    });

    test('PUT 요청이 성공하고 생성된 데이터를 반환해야 한다', async () => {
        const payload = { name: 'Test User2' };
        const result = await client.put<{ id: number; name: string }, typeof payload>(
            '/api/users/1',
            payload
        );

        expect(result).toEqual({ id: 1, ...payload });
    });

    test('PATCH 요청이 성공하고 생성된 데이터를 반환해야 한다', async () => {
        const payload = { name: 'Test User3' }
        const result = await client.patch<{ id: number; name: string }, typeof payload>(
            '/api/users/1',
            payload
        );

        expect(result).toEqual({ id: 1, ...payload });
    });

    test('204 No Content 응답 시 undefined를 반환해야 한다', async () => {
        server.use(
            http.delete(`${BASE_URL}/api/resource/5`, () => {
                return new HttpResponse(null, { status: 204 });
            })
        );

        const result = await client.delete('/api/resource/5');

        expect(result).toBeUndefined();
    });

    test('Authorizaiton Header를 자동으로 추가하여 전송해야한다.', async () => {


        // Mocking 검증:
        // (await cookies()).get('auth_token')?.value; 이 구문이 이제 정상적으로 작동할 것입니다.

        const result = await client.get<{ success: boolean }>('/api/protected', {
            withAuthorizationHeader: true,
        });

        expect(result).not.toBeUndefined();
        expect(result?.success).toBe(true);

    })

    // --- 에러/예외 케이스 테스트 ---
    test('404 Not Found 응답 시 NotFoundError를 throw 해야 한다', async () => {
        await expect(client.get('/api/users/999')).rejects.toThrow(NotFoundError);
    });

    test('401 Unauthorized 응답 시 UnauthorizedError를 throw 해야 한다', async () => {
        await expect(client.get('/api/protected')).rejects.toThrow(UnauthorizedError);
    });

    test('500 Internal Server Error 응답 시 ApiError를 throw 해야 한다', async () => {
        await expect(client.get('/api/error')).rejects.toThrow(ApiError);
    });

    test('요청 타임아웃 발생 시 TimeoutError를 throw 해야 한다', async () => {
        // 클라이언트 생성 시 기본 타임아웃을 짧게 설정하거나, 요청별 config로 설정
        const shortTimeoutClient = new ApiClient(BASE_URL, 10); // 100ms 타임아웃

        await expect(shortTimeoutClient.get('/api/slow')).rejects.toThrow(TimeoutError);
    });

    test('네트워크 연결 실패 시 NetworkError를 throw 해야 한다', async () => {
        // MSW가 처리하지 않는 URL에 대한 요청을 시도하거나, fetch가 실제로 실패하도록 서버를 일시적으로 끄는 등의 고급 설정이 필요할 수 있습니다.
        // MSW 환경에서는 `fetch` 함수 자체를 모킹하여 네트워크 에러(TypeError)를 시뮬레이션 하는 것이 일반적입니다.
        const mockFetch = jest.spyOn(global, 'fetch').mockImplementation(() => {
            // TypeError를 발생시켜 네트워크 에러를 시뮬레이션
            throw new TypeError('Failed to fetch');
        });

        await expect(client.get('http://nonexistent-host/test')).rejects.toThrow(NetworkError);

        mockFetch.mockRestore(); // Mock 복구
    });
});
import { handlers } from './handlers';
import { setupServer } from 'msw/node';

process.env.NEXT_PUBLIC_API_URL = 'http://localhost:3001';
process.env.NEXT_BACKEND_API_URL = 'http://localhost:8080';

export const server = setupServer(...handlers);

beforeAll(() => server.listen({ onUnhandledRequest: 'error' }));
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

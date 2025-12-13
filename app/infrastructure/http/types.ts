export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

export interface ApiRequestConfig<T = unknown> {
    method: HttpMethod;
    headers?: Record<string, string>;
    body?: T;
    timeout?: number;
    withAuthorizationHeader?: boolean;
}

type RequestInterceptorGeneralType = { url: string; config: ApiRequestConfig }

export type RequestInterceptor = (
    url: string,
    config: ApiRequestConfig
) => Promise<RequestInterceptorGeneralType>;

export type ResponseInterceptor = (response: Response) => Response;
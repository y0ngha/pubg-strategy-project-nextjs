export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

export interface ApiRequestConfig<T = unknown> {
    method: HttpMethod;
    headers?: Record<string, string>;
    body?: T;
    timeout?: number;
    withAuthorizationHeader?: boolean;
}

type RequestInterceptorGeneralType<T> = {
    url: string;
    config: ApiRequestConfig<T>;
};

export type RequestInterceptor<T> = (
    url: string,
    config: ApiRequestConfig<T>
) => Promise<RequestInterceptorGeneralType<T>>;

export type ResponseInterceptor = (response: Response) => Response;

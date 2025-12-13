import { injectable } from 'inversify';
import {
    ApiError,
    ForbiddenError,
    NetworkError,
    NotFoundError,
    TimeoutError,
    UnauthorizedError,
} from './api-errors';
import {
    authRequestInterceptor,
    loggingRequestInterceptor,
    loggingResponseInterceptor,
} from './interceptors';
import {
    ApiRequestConfig,
    RequestInterceptor,
    ResponseInterceptor
} from './types';

@injectable()
export class ApiClient {
    private readonly baseUrl: string;
    private readonly defaultTimeout: number;
    private requestInterceptors: RequestInterceptor<unknown>[];
    private responseInterceptors: ResponseInterceptor[];

    constructor(
        baseUrl?: string,
        timeout: number = 30000
    ) {
        this.baseUrl = baseUrl || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
        this.defaultTimeout = timeout;

        this.requestInterceptors = [
            loggingRequestInterceptor,
            authRequestInterceptor,
        ];
        this.responseInterceptors = [
            loggingResponseInterceptor,
        ];
    }

    async get<T = unknown>(url: string, config?: Partial<ApiRequestConfig>): Promise<T | undefined> {
        return this.request<T, unknown>(url, {
            method: 'GET',
            timeout: this.defaultTimeout,
            ...config,
        });
    }

    async post<T = unknown, D = unknown>(url: string, data?: D, config?: Partial<ApiRequestConfig<D>>): Promise<T | undefined> {
        return this.request<T, D>(url, {
            method: 'POST',
            body: data,
            timeout: this.defaultTimeout,
            ...config,
        });
    }

    async put<T = unknown, D = unknown>(url: string, data?: D, config?: Partial<ApiRequestConfig<D>>): Promise<T | undefined> {
        return this.request<T, D>(url, {
            method: 'PUT',
            body: data,
            timeout: this.defaultTimeout,
            ...config,
        });
    }

    async patch<T = unknown, D = unknown>(url: string, data?: D, config?: Partial<ApiRequestConfig<D>>): Promise<T | undefined> {
        return this.request<T, D>(url, {
            method: 'PATCH',
            body: data,
            timeout: this.defaultTimeout,
            ...config,
        });
    }

    async delete<T = unknown>(url: string, config?: Partial<ApiRequestConfig>): Promise<T | undefined> {
        return this.request<T, unknown>(url, {
            method: 'DELETE',
            timeout: this.defaultTimeout,
            ...config,
        });
    }

    private async request<T, D>(
        url: string,
        config: ApiRequestConfig<D>
    ): Promise<T | undefined> {
        const fullUrl = url.startsWith('http') ? url : `${this.baseUrl}${url}`;

        let processedUrl = fullUrl;
        let processedConfig = config;

        for (const interceptor of this.requestInterceptors) {
            const result = await interceptor(processedUrl, processedConfig);
            if (!this.isApiRequestConfig<D>(result.config)) {
                throw new Error('Invalid interceptor configuration.');
            }
            processedUrl = result.url;
            processedConfig = result.config as ApiRequestConfig<D>;
        }

        const timeout = processedConfig.timeout || this.defaultTimeout;
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), timeout);

        try {
            const response = await fetch(processedUrl, {
                method: processedConfig.method,
                headers: {
                    'Content-Type': 'application/json',
                    ...processedConfig.headers,
                },
                body: processedConfig.body ? JSON.stringify(processedConfig.body) : undefined,
                signal: controller.signal,
            });

            clearTimeout(timeoutId);

            let processedResponse = response;
            for (const interceptor of this.responseInterceptors) {
                processedResponse = interceptor(processedResponse);
            }

            if (!processedResponse.ok) {
                await this.handleErrorResponse(processedResponse);
            }

            return await this.parseResponse<T>(processedResponse);
        } catch (error) {
            clearTimeout(timeoutId);
            if (Error.isError(error)) {
                if (error.name === 'AbortError') {
                    throw new TimeoutError(`Request timeout after ${timeout}ms`);
                }

                if (error instanceof TypeError) {
                    throw new NetworkError('Network request failed');
                }
            }

            throw error;
        }
    }

    private async handleErrorResponse(response: Response): Promise<void> {
        const errorMessage = response.statusText;

        switch (response.status) {
            case 401:
                throw new UnauthorizedError(errorMessage);
            case 403:
                throw new ForbiddenError(errorMessage);
            case 404:
                throw new NotFoundError(errorMessage);
            default:
                const bodyText = await response.text();

                let body: unknown = bodyText;

                try {
                    body = JSON.parse(bodyText);
                } catch {
                }

                throw new ApiError(errorMessage, response.status, body);
        }
    }

    private async parseResponse<T>(response: Response): Promise<T | undefined> {
        const text = await response.text();

        if (text.length === 0) {
            return undefined;
        }

        try {
            return JSON.parse(text);
        } catch (error) {
            throw new ApiError("응답 형식이 일치하지 않습니다.", response.status, text);
        }
    }

    private isApiRequestConfig<D>(
        config: any
    ): config is ApiRequestConfig<D> {

        if (typeof config !== 'object' || config === null) {
            return false;
        }

        if (!('method' in config)) {
            return false;
        }

        if (typeof config.method !== 'string') {
            return false;
        }

        return true;
    }
}
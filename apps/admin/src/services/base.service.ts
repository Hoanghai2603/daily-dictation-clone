import type { AxiosRequestConfig } from 'axios';
import api from '../lib/api';

export class BaseService {
    // Map to store pending GET requests for deduplication
    private static pendingRequests = new Map<string, Promise<unknown>>();

    /**
     * Generic GET method with deduplication logic.
     * If a request to the same URL+Params is already pending, it returns the existing promise.
     */
    protected async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
        const key = this.createKey(url, config);

        if (BaseService.pendingRequests.has(key)) {
            // console.log(`[BaseService] Deduplicating request: ${key}`);
            return BaseService.pendingRequests.get(key) as Promise<T>;
        }

        const promise = api.get<T>(url, config)
            .then((response) => response.data)
            .finally(() => {
                // Remove from pending map once finished (success or fail)
                BaseService.pendingRequests.delete(key);
            });

        BaseService.pendingRequests.set(key, promise);

        return promise;
    }

    protected async post<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> {
        const response = await api.post<T>(url, data, config);
        return response.data;
    }

    protected async patch<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> {
        const response = await api.patch<T>(url, data, config);
        return response.data;
    }

    protected async delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
        const response = await api.delete<T>(url, config);
        return response.data;
    }

    private createKey(url: string, config?: AxiosRequestConfig): string {
        // Create a unique key based on URL and query params
        const params = config?.params ? JSON.stringify(config.params) : '';
        return `${url}?${params}`;
    }
}

import type { AxiosRequestConfig } from 'axios';
import api from '../lib/api';

export class BaseService {
    // Map to store pending GET requests for deduplication
    private static pendingRequests = new Map<string, Promise<unknown>>();
    // Map to store cached GET responses (TTL)
    private static cache = new Map<string, { data: unknown; timestamp: number }>();
    private static readonly CACHE_TTL = 2000; // 2 seconds

    /**
     * Generic GET method with deduplication logic and short-term caching.
     */
    protected async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
        const key = this.createKey(url, config);
        const now = Date.now();

        // Check cache first
        if (BaseService.cache.has(key)) {
            const cached = BaseService.cache.get(key)!;
            if (now - cached.timestamp < BaseService.CACHE_TTL) {
                // console.log(`[BaseService] Serving from cache: ${key}`);
                return cached.data as T;
            } else {
                BaseService.cache.delete(key);
            }
        }

        // Check pending requests
        if (BaseService.pendingRequests.has(key)) {
            return BaseService.pendingRequests.get(key) as Promise<T>;
        }

        const promise = api.get<T>(url, config)
            .then((response) => {
                // Cache the successful response
                BaseService.cache.set(key, { data: response.data, timestamp: Date.now() });
                return response.data;
            })
            .finally(() => {
                // Remove from pending map once finished
                BaseService.pendingRequests.delete(key);
            });

        BaseService.pendingRequests.set(key, promise);

        return promise;
    }

    /**
     * Clear cache for a specific key or all cache if no key provided
     */
    protected clearCache(key?: string) {
        if (key) {
            BaseService.cache.delete(key);
        } else {
            BaseService.cache.clear();
        }
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

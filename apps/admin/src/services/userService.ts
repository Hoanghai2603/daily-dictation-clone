import api from '@/lib/api';

export interface UserProfile {
    id: string;
    full_name: string | null;
    avatar_url: string | null;
    phone: string | null;
    email: string | null;
    streak_count: number;
    total_time_listened: number;
    is_banned?: boolean;
    created_at: string;
}

export const userService = {
    async getUsers(page = 1, pageSize = 10, search = '') {
        const response = await api.get('/users', {
            params: { page, pageSize, search }
        });
        return response.data;
    },

    async getUser(id: string) {
        const response = await api.get(`/users/${id}`);
        return response.data;
    },

    async banUser(id: string) {
        await api.post(`/users/${id}/ban`);
    },

    async updateUser(id: string, data: Partial<UserProfile>) {
        await api.patch(`/users/${id}`, data);
    },

    async unbanUser(id: string) {
        await api.post(`/users/${id}/unban`);
    }
};

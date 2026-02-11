import { BaseService } from './base.service';

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

class UserService extends BaseService {
    private readonly BASE_PATH = '/users';

    async getUsers(page = 1, pageSize = 10, search = '') {
        return this.get<{ data: UserProfile[]; total: number }>(this.BASE_PATH, {
            params: { page, pageSize, search }
        });
    }

    async getUser(id: string) {
        return this.get<{ profile: UserProfile; progress: any[] }>(`${this.BASE_PATH}/${id}`);
    }

    async banUser(id: string) {
        return this.post(`${this.BASE_PATH}/${id}/ban`);
    }

    async updateUser(id: string, data: Partial<UserProfile>) {
        return this.patch(`${this.BASE_PATH}/${id}`, data);
    }

    async unbanUser(id: string) {
        return this.post(`${this.BASE_PATH}/${id}/unban`);
    }
}

export const userService = new UserService();

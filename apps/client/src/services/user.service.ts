import { BaseService } from './base.service';

export interface UserProfile {
    id: string;
    full_name: string | null;
    avatar_url: string | null;
    email: string | null;
    phone?: string | null;
    streak_count: number;
    total_time_listened: number;
    created_at: string;
}

export interface UserProgress {
    id: string;
    user_id: string;
    exercise_id: string;
    status: 'started' | 'completed';
    percentage: number;
    last_accessed: string;
}

class UserService extends BaseService {
    private readonly BASE_PATH = '/users';

    async getUser(id: string) {
        return this.get<{ profile: UserProfile; progress: UserProgress[] }>(`${this.BASE_PATH}/${id}`);
    }

    async updateProgress(data: { exercise_id: string; percentage: number; status?: 'started' | 'completed' }) {
        return this.post<{ success: boolean; progress: UserProgress }>('/progress', data);
    }

    async updateUser(id: string, data: Partial<UserProfile>) {
        return this.patch<UserProfile>(`${this.BASE_PATH}/${id}`, data);
    }
}

export const userService = new UserService();

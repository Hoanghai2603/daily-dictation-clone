import { BaseService } from './base.service';

export interface Topic {
    id: string;
    title: string;
    description?: string;
    icon?: string;
    color?: string;
    level?: string;
    count?: number;
}

class TopicService extends BaseService {
    private readonly BASE_PATH = '/topics';

    async getAll() {
        return this.get<Topic[]>(this.BASE_PATH);
    }

    async getById(id: string) {
        return this.get<Topic>(`${this.BASE_PATH}/${id}`);
    }
}

export const topicService = new TopicService();

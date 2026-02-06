import { BaseService } from './base.service';

export type Topic = {
    id: string;
    title: string;
    slug: string;
    description: string;
    level: string;
    order_index: number;
    thumbnail_url: string;
};

class TopicService extends BaseService {
    private readonly BASE_PATH = '/topics';

    async getAll(): Promise<Topic[]> {
        return this.get<Topic[]>(this.BASE_PATH);
    }

    async getById(id: string): Promise<Topic> {
        return this.get<Topic>(`${this.BASE_PATH}/${id}`);
    }

    async create(data: Partial<Topic>): Promise<Topic> {
        return this.post<Topic>(this.BASE_PATH, data);
    }

    async update(id: string, data: Partial<Topic>): Promise<Topic> {
        return this.patch<Topic>(`${this.BASE_PATH}/${id}`, data);
    }

    async deleteTopic(id: string): Promise<void> {
        return this.delete(`${this.BASE_PATH}/${id}`);
    }
}

export const topicService = new TopicService();

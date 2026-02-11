import { BaseService } from './base.service';

export interface Exercise {
    id: string;
    title: string;
    youtube_id: string;
    topic_id: string;
    difficulty: string;
    content?: string; // or transcripts
}

class ExerciseService extends BaseService {
    private readonly BASE_PATH = '/exercises';

    async getAll(filters?: { topic_id?: string; level?: string }) {
        return this.get<Exercise[]>(this.BASE_PATH, { params: filters });
    }

    async getById(id: string) {
        return this.get<Exercise>(`${this.BASE_PATH}/${id}`);
    }
}

export const exerciseService = new ExerciseService();

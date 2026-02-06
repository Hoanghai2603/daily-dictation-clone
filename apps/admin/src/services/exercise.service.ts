import { BaseService } from './base.service';
import type { TranscriptSegment } from '../lib/youtube';

export type Exercise = {
    id: string;
    title: string;
    youtube_id: string;
    topic_id: string;
    difficulty: string;
    is_published: boolean;
    transcripts?: TranscriptSegment[];
};

class ExerciseService extends BaseService {
    private readonly BASE_PATH = '/exercises';

    async getAll(filters?: { topic_id?: string }): Promise<Exercise[]> {
        return this.get<Exercise[]>(this.BASE_PATH, { params: filters });
    }

    async getById(id: string): Promise<Exercise> {
        return this.get<Exercise>(`${this.BASE_PATH}/${id}`);
    }

    async create(data: Partial<Exercise>): Promise<Exercise> {
        return this.post<Exercise>(this.BASE_PATH, data);
    }

    async update(id: string, data: Partial<Exercise>): Promise<Exercise> {
        return this.patch<Exercise>(`${this.BASE_PATH}/${id}`, data);
    }

    async deleteExercise(id: string): Promise<void> {
        return this.delete(`${this.BASE_PATH}/${id}`);
    }
}

export const exerciseService = new ExerciseService();

import { useState } from 'react';
import { TranscriptionTool } from './TranscriptionTool';
import { Button } from '@daily-dictation/ui/button';

export function ExerciseEditor({ exercise, onSave }: { exercise?: any, onSave: () => void }) {
    const [formData, setFormData] = useState(exercise || {
        title: '',
        description: '',
        youtube_id: '',
        difficulty: 'Medium',
        accent: 'US',
        duration: 0
    });
    const [showSync, setShowSync] = useState(false);

    const handleBaseSave = async (e: React.FormEvent) => {
        e.preventDefault();
        const method = exercise?.id ? 'PATCH' : 'POST';
        const url = exercise?.id ? `/api/exercises/${exercise.id}` : '/api/exercises';

        const res = await fetch(url, {
            method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData)
        });

        if (res.ok) {
            const data = await res.json();
            setFormData(data);
            setShowSync(true);
        }
    };

    const handleSegmentsSave = async (segments: any[]) => {
        await fetch('/api/transcripts/bulk', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ exercise_id: formData.id, segments })
        });
        onSave();
    };

    return (
        <div className="bg-white border-4 border-black p-8 shadow-[12px_12px_0px_0px_rgba(0,0,0,1)]">
            {!showSync ? (
                <form onSubmit={handleBaseSave} className="space-y-6">
                    <h2 className="text-3xl font-black uppercase tracking-tight">Exercise Details</h2>
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                        <div className="space-y-2">
                            <label className="text-sm font-bold uppercase">Exercise Title</label>
                            <input
                                className="w-full border-4 border-black p-3 focus:ring-0"
                                value={formData.title}
                                onChange={e => setFormData({ ...formData, title: e.target.value })}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-bold uppercase">YouTube ID</label>
                            <input
                                className="w-full border-4 border-black p-3 focus:ring-0"
                                value={formData.youtube_id}
                                onChange={e => setFormData({ ...formData, youtube_id: e.target.value })}
                                required
                            />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-bold uppercase">Description</label>
                        <textarea
                            className="w-full border-4 border-black p-3 focus:ring-0"
                            rows={3}
                            value={formData.description}
                            onChange={e => setFormData({ ...formData, description: e.target.value })}
                        />
                    </div>
                    <div className="grid grid-cols-3 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm font-bold uppercase">Difficulty</label>
                            <select
                                className="w-full border-4 border-black p-3 focus:ring-0"
                                value={formData.difficulty}
                                onChange={e => setFormData({ ...formData, difficulty: e.target.value })}
                            >
                                <option>Easy</option>
                                <option>Medium</option>
                                <option>Hard</option>
                            </select>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-bold uppercase">Accent</label>
                            <input
                                className="w-full border-4 border-black p-3 focus:ring-0"
                                value={formData.accent}
                                onChange={e => setFormData({ ...formData, accent: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-bold uppercase">Duration (sec)</label>
                            <input
                                type="number"
                                className="w-full border-4 border-black p-3 focus:ring-0"
                                value={formData.duration}
                                onChange={e => setFormData({ ...formData, duration: parseInt(e.target.value) })}
                            />
                        </div>
                    </div>
                    <Button type="submit" className="w-full">Continue to Sync Transcripts &rarr;</Button>
                </form>
            ) : (
                <div className="space-y-8">
                    <div className="flex items-center justify-between">
                        <h2 className="text-3xl font-black uppercase tracking-tight">Sync Transcripts</h2>
                        <Button variant="ghost" onClick={() => setShowSync(false)}>&larr; Back to Info</Button>
                    </div>
                    <TranscriptionTool youtubeId={formData.youtube_id} onSave={handleSegmentsSave} />
                </div>
            )}
        </div>
    );
}

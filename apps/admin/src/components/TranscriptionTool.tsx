import { Button } from '@daily-dictation/ui/button';
import { useRef, useState } from 'react';
import YouTube from 'react-youtube';

interface Segment {
    id?: string;
    content: string;
    start_time: number;
    end_time: number;
}

export function TranscriptionTool({ youtubeId, onSave }: { youtubeId: string, onSave: (segments: Segment[]) => void }) {
    const [segments, setSegments] = useState<Segment[]>([]);
    const [currentText, setCurrentText] = useState('');
    const playerRef = useRef<any>(null);

    const addSegment = () => {
        if (!playerRef.current) return;
        const currentTime = playerRef.current.getCurrentTime();

        // Auto-calculate start time based on last segment end time
        const startTime = segments.length > 0 ? segments[segments.length - 1].end_time : 0;

        const newSegment: Segment = {
            content: currentText,
            start_time: startTime,
            end_time: currentTime
        };

        setSegments([...segments, newSegment]);
        setCurrentText('');
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && e.ctrlKey) {
            addSegment();
        }
    };

    return (
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
            <div className="sticky top-8">
                <div className="aspect-video w-full overflow-hidden border-4 border-black shadow-[12px_12px_0px_0px_rgba(0,0,0,1)]">
                    <YouTube
                        videoId={youtubeId}
                        onReady={(e) => playerRef.current = e.target}
                        opts={{ width: '100%', height: '100%', playerVars: { rel: 0, showinfo: 0 } }}
                    />
                </div>
                <div className="mt-6 space-y-4">
                    <textarea
                        className="w-full border-4 border-black p-4 text-lg font-medium focus:ring-0"
                        rows={4}
                        placeholder="Type sentence and press Ctrl+Enter to sync timestamp..."
                        value={currentText}
                        onChange={(e) => setCurrentText(e.target.value)}
                        onKeyDown={handleKeyDown}
                    />
                    <Button className="w-full" onClick={addSegment}>Sync Current Segment (Ctrl+Enter)</Button>
                    <Button variant="outline" className="w-full" onClick={() => onSave(segments)}>Save All Segments</Button>
                </div>
            </div>

            <div className="space-y-4">
                <h3 className="text-2xl font-black uppercase tracking-tight">Segments ({segments.length})</h3>
                <div className="max-h-[600px] overflow-y-auto border-4 border-black bg-white p-4">
                    {segments.map((s, i) => (
                        <div key={i} className="mb-4 border-b-2 border-gray-100 pb-2">
                            <div className="flex justify-between text-xs font-bold text-primary">
                                <span>{s.start_time.toFixed(2)}s - {s.end_time.toFixed(2)}s</span>
                                <button onClick={() => setSegments(segments.filter((_, idx) => idx !== i))}>Remove</button>
                            </div>
                            <p className="font-medium">{s.content}</p>
                        </div>
                    ))}
                    {segments.length === 0 && <p className="text-center italic text-gray-400">No segments yet. Start typing while the video plays!</p>}
                </div>
            </div>
        </div>
    );
}

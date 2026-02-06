import { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import YouTube, { type YouTubeProps } from 'react-youtube';
import { ArrowLeft, Clock } from 'lucide-react';
import { exerciseService, type Exercise } from '../services/exercise.service';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';

type Segment = {
    id: string;
    exercise_id: string;
    start_time: number;
    end_time: number;
    content: string;
};

export const ExerciseDetailPage = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [exercise, setExercise] = useState<Exercise | null>(null);
    const [segments, setSegments] = useState<Segment[]>([]);
    const [loading, setLoading] = useState(true);
    const playerRef = useRef<any>(null);

    const getYouTubeId = (url: string) => {
        if (!url) return '';
        if (url.length === 11) return url;
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
        const match = url.match(regExp);
        return (match && match[2].length === 11) ? match[2] : url;
    };

    useEffect(() => {
        if (id) fetchData(id);
    }, [id]);

    const fetchData = async (exerciseId: string) => {
        setLoading(true);
        try {
            const exerciseData = await exerciseService.getById(exerciseId);
            setExercise(exerciseData);
            if (exerciseData.transcripts && Array.isArray(exerciseData.transcripts)) {
                // Map TranscriptSegment to local Segment type for display
                // Backend TranscriptSegment: { text: string, duration: number, start: number }
                // Local Segment: { id, exercise_id, start_time, end_time, content }
                const mappedSegments: Segment[] = exerciseData.transcripts.map((t: any, index: number) => ({
                    id: `seg-${index}`,
                    exercise_id: exerciseId,
                    start_time: t.start,
                    end_time: t.start + t.duration,
                    content: t.text
                }));
                setSegments(mappedSegments);
            } else {
                setSegments([]);
            }
        } catch (error) {
            console.error('Error fetching details:', error);
            alert('Error loading exercise details');
        } finally {
            setLoading(false);
        }
    };

    const handlePlayerReady: YouTubeProps['onReady'] = (event) => {
        playerRef.current = event.target;
    };

    const jumpToTime = (seconds: number) => {
        if (playerRef.current) {
            playerRef.current.seekTo(seconds, true);
            playerRef.current.playVideo();
        }
    };

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    if (loading) return <div className="p-10 text-center text-muted-foreground">Loading exercise details...</div>;
    if (!exercise) return <div className="p-10 text-center text-destructive">Exercise not found</div>;

    const videoId = exercise ? getYouTubeId(exercise.youtube_id) : '';

    return (
        <div className="space-y-6 h-[calc(100vh-100px)] flex flex-col">
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" onClick={() => navigate('/exercises')}>
                    <ArrowLeft className="h-4 w-4" />
                </Button>
                <div className="flex-1">
                    <h1 className="text-2xl font-bold text-foreground">{exercise.title}</h1>
                    <div className="flex gap-2 text-sm text-muted-foreground mt-1 items-center">
                        <span className="bg-secondary text-secondary-foreground px-2 py-0.5 rounded text-xs">{exercise.difficulty}</span>
                        <span>•</span>
                        <span>{segments.length} segments</span>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1 min-h-0">
                {/* Left Column: Video Player */}
                <div className="lg:col-span-2 space-y-4 flex flex-col">
                    <div className="bg-black rounded-xl overflow-hidden shadow-lg aspect-video shrink-0 relative border border-border">
                        {videoId ? (
                            <YouTube
                                videoId={videoId}
                                className="absolute inset-0 w-full h-full"
                                iframeClassName="w-full h-full"
                                onReady={handlePlayerReady}
                                opts={{ height: '100%', width: '100%', playerVars: { autoplay: 0 } }}
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                                <p>Invalid Video ID</p>
                            </div>
                        )}
                    </div>

                    <Card>
                        <CardHeader>
                            <CardTitle>Exercise Information</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-muted-foreground text-sm">
                                YouTube ID: <span className="font-mono bg-muted px-1 rounded text-foreground">{exercise.youtube_id}</span>
                            </p>
                        </CardContent>
                    </Card>
                </div>

                {/* Right Column: Script/Segments */}
                <Card className="flex flex-col overflow-hidden h-full max-h-[calc(100vh-200px)]">
                    <div className="p-4 border-b border-border bg-muted/20 flex justify-between items-center sticky top-0 z-10">
                        <h3 className="font-semibold text-foreground flex items-center gap-2">
                            <Clock size={18} />
                            Script Segments
                        </h3>
                        <span className="text-xs text-muted-foreground">Click to jump</span>
                    </div>

                    <div className="overflow-y-auto flex-1 p-0">
                        {segments.length === 0 ? (
                            <div className="p-8 text-center text-muted-foreground text-sm">
                                No segments found for this exercise.
                            </div>
                        ) : (
                            <div className="divide-y divide-border">
                                {segments.map((segment) => (
                                    <div
                                        key={segment.id}
                                        onClick={() => jumpToTime(segment.start_time)}
                                        className="p-4 hover:bg-muted/50 cursor-pointer transition-colors group"
                                    >
                                        <div className="flex items-start gap-3">
                                            <div className="shrink-0 mt-1">
                                                <div className="bg-secondary text-secondary-foreground text-xs font-mono px-2 py-1 rounded group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                                                    {formatTime(segment.start_time)}
                                                </div>
                                            </div>
                                            <p className="text-muted-foreground text-sm leading-relaxed group-hover:text-foreground transition-colors">
                                                {segment.content}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </Card>
            </div>
        </div>
    );
};

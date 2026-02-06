"use client";

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import YouTube from 'react-youtube';
import { Button } from '@daily-dictation/ui/button';
import { useDictationStore } from '@/store/useDictationStore';

export default function ExercisePage() {
    const { id } = useParams();
    const [exercise, setExercise] = useState<any>(null);
    const { segments, currentIndex, userInput, setUserInput, checkAnswer, isCorrect, nextSegment, mode, setMode, setSegments } = useDictationStore();
    const [player, setPlayer] = useState<any>(null);

    useEffect(() => {
        // Fetch exercise data
        fetch(`http://localhost:3001/api/exercises/${id}`)
            .then(res => res.json())
            .then(data => {
                setExercise(data);
                setSegments(data.transcripts);
            });
    }, [id, setSegments]);

    const currentSegment = segments[currentIndex];

    const handlePlaySegment = () => {
        if (player && currentSegment) {
            player.seekTo(currentSegment.start_time);
            player.playVideo();
            setMode('listen');

            // Auto-pause at end of segment
            const duration = (currentSegment.end_time - currentSegment.start_time) * 1000;
            setTimeout(() => {
                player.pauseVideo();
                setMode('type');
            }, duration);
        }
    };

    if (!exercise) return <div>Loading...</div>;

    return (
        <div className="mx-auto max-w-7xl px-4 py-8">
            <div className="grid grid-cols-1 gap-12 lg:grid-cols-12">
                {/* Left: Video & Info */}
                <div className="lg:col-span-5">
                    <div className="sticky top-8">
                        <h1 className="mb-4 text-3xl font-black tracking-tight">{exercise.title}</h1>
                        <div className="aspect-video w-full overflow-hidden border-4 border-black shadow-[12px_12px_0px_0px_rgba(0,0,0,1)]">
                            <YouTube
                                videoId={exercise.youtube_id}
                                className="h-full w-full"
                                onReady={(e) => setPlayer(e.target)}
                                opts={{ width: '100%', height: '100%' }}
                            />
                        </div>

                        <div className="mt-8 space-y-4">
                            <div className="flex items-center gap-4">
                                <div className={`flex h-12 w-12 items-center justify-center border-2 border-black font-black ${mode === 'listen' ? 'bg-primary text-white' : 'bg-white'}`}>1</div>
                                <div>
                                    <h3 className="font-bold uppercase italic">Listen</h3>
                                    <p className="text-sm text-gray-500">Listen to the sentence</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                <div className={`flex h-12 w-12 items-center justify-center border-2 border-black font-black ${mode === 'type' ? 'bg-primary text-white' : 'bg-white'}`}>2</div>
                                <div>
                                    <h3 className="font-bold uppercase italic">Type</h3>
                                    <p className="text-sm text-gray-500">Type what you hear</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right: Dictation Area */}
                <div className="lg:col-span-7">
                    <div className="min-h-[500px] border-4 border-black bg-white p-8 shadow-[12px_12px_0px_0px_rgba(0,0,0,1)]">
                        {mode !== 'read' ? (
                            <div className="space-y-6">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm font-bold uppercase tracking-widest text-primary">Sentence {currentIndex + 1} of {segments.length}</span>
                                    <Button variant="outline" size="sm" onClick={handlePlaySegment}>Replay (Ctrl)</Button>
                                </div>

                                <textarea
                                    className="min-h-[150px] w-full border-4 border-black p-6 text-xl font-medium focus:ring-4 focus:ring-primary/20"
                                    placeholder="Start typing here..."
                                    autoFocus
                                    value={userInput}
                                    onChange={(e) => setUserInput(e.target.value)}
                                    disabled={mode === 'check'}
                                />

                                {mode === 'check' && (
                                    <div className={`p-6 border-4 border-black ${isCorrect ? 'bg-green-50 border-green-600' : 'bg-red-50 border-red-600'}`}>
                                        <h4 className={`text-sm font-bold uppercase mb-2 ${isCorrect ? 'text-green-700' : 'text-red-700'}`}>
                                            {isCorrect ? 'Perfect!' : 'Keep trying! Correct sentence:'}
                                        </h4>
                                        <p className="text-2xl font-bold">{currentSegment.content}</p>
                                    </div>
                                )}

                                <div className="flex gap-4">
                                    {mode === 'check' ? (
                                        <Button className="w-full" onClick={nextSegment}>Next Sentence &rarr;</Button>
                                    ) : (
                                        <Button className="w-full" onClick={checkAnswer}>Check Answer (Enter)</Button>
                                    )}
                                    <Button variant="ghost" onClick={() => nextSegment()}>I don't know (Skip)</Button>
                                </div>
                            </div>
                        ) : (
                            <div className="text-center py-12">
                                <h2 className="text-5xl font-black mb-4">Well Done!</h2>
                                <p className="text-xl mb-8">You've completed the dictation for this exercise.</p>
                                <Button size="lg" onClick={() => window.location.href = '/'}>Back to Lessons</Button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

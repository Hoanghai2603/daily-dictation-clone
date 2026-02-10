"use client";

import React, { useEffect, useState, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import YouTube from 'react-youtube';
import { motion, AnimatePresence } from 'framer-motion';
import {
    ArrowLeft,
    RotateCcw,
    ChevronRight,
    CheckCircle2,
    XCircle,
    Headphones,
    Keyboard,
    Info,
    Settings
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useDictationStore, Segment } from '@/store/useDictationStore';
import { cn } from '@/lib/utils';

// Mock data fallback if API fails
const mockExercise = {
    title: "A Day at the Park",
    youtube_id: "dQw4w9WgXcQ", // Rickroll as fallback video :)
    transcripts: [
        { id: "1", content: "The sun was shining brightly in the sky.", start_time: 0, end_time: 5, order_index: 0 },
        { id: "2", content: "Children were playing happily on the grass.", start_time: 5, end_time: 10, order_index: 1 },
        { id: "3", content: "A small dog was running after a red ball.", start_time: 10, end_time: 15, order_index: 2 },
    ]
};

interface Exercise {
    title: string;
    youtube_id: string;
    transcripts: Segment[];
}

export default function ExercisePage(): React.ReactNode {
    const { id } = useParams();
    const router = useRouter();
    const [exercise, setExercise] = useState<Exercise | null>(null);
    const { segments, currentIndex, userInput, setUserInput, checkAnswer, isCorrect, nextSegment, mode, setMode, setSegments } = useDictationStore();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [player, setPlayer] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    useEffect(() => {
        setIsLoading(true);
        // Attempt to fetch, fall back to mock data
        fetch(`http://localhost:3001/api/exercises/${id}`)
            .then(res => res.json())
            .then(data => {
                setExercise(data);
                setSegments(data.transcripts);
                setIsLoading(false);
            })
            .catch(() => {
                console.warn("API not available, using mock data");
                setExercise(mockExercise);
                setSegments(mockExercise.transcripts);
                setIsLoading(false);
            });
    }, [id, setSegments]);

    useEffect(() => {
        if (mode === 'type' && textareaRef.current) {
            textareaRef.current.focus();
        }
    }, [mode]);

    const currentSegment = segments[currentIndex];

    const handlePlaySegment = () => {
        if (player && currentSegment) {
            player.seekTo(currentSegment.start_time);
            player.playVideo();
            setMode('listen');

            const duration = (currentSegment.end_time - currentSegment.start_time) * 1000;
            setTimeout(() => {
                player.pauseVideo();
                setMode('type');
            }, duration);
        }
    };

    if (isLoading || !exercise) {
        return (
            <div className="container py-20 flex flex-col items-center justify-center min-h-[60vh]">
                <div className="h-12 w-12 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4" />
                <p className="text-foreground/60 font-medium">Preparing your lesson...</p>
            </div>
        );
    }

    return (
        <div className="container py-16 min-h-[calc(100vh-80px)]">
            <div className="flex flex-col lg:flex-row items-center gap-6 mb-12 max-w-7xl mx-auto">
                <Button variant="ghost" className="h-12 w-12 p-0 rounded-full hover:bg-primary/5 group" onClick={() => router.back()}>
                    <ArrowLeft className="h-6 w-6 text-primary group-hover:-translate-x-1 transition-transform" />
                </Button>
                <div className="flex-1 text-center lg:text-left">
                    <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 mb-2">
                        <Badge variant="outline" className="bg-card border-primary/20 text-primary font-black uppercase text-[10px] tracking-[0.2em] px-3">Session Active</Badge>
                        <Badge variant="secondary" className="bg-muted/50 text-foreground/40 font-bold px-3">Intermediate</Badge>
                    </div>
                    <h1 className="text-3xl md:text-5xl font-heading font-black tracking-tight">{exercise.title}</h1>
                </div>
                <div className="hidden lg:flex items-center gap-3">
                    <Button variant="outline" size="icon" className="h-12 w-12 rounded-xl border-2 hover:bg-primary/5 hover:border-primary/20 transition-all"><Settings className="h-5 w-5 text-foreground/40" /></Button>
                    <Button variant="outline" size="icon" className="h-12 w-12 rounded-xl border-2 hover:bg-primary/5 hover:border-primary/20 transition-all"><Info className="h-5 w-5 text-foreground/40" /></Button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start max-w-7xl mx-auto">
                {/* Left: Video & Progress */}
                <div className="lg:col-span-4 xl:col-span-4 flex flex-col gap-10 lg:sticky lg:top-32">
                    <Card className="overflow-hidden border-none shadow-[0_20px_50px_rgba(0,0,0,0.1)] bg-black aspect-video rounded-3xl flex-shrink-0 ring-4 ring-card shadow-2xl">
                        <YouTube
                            videoId={exercise.youtube_id}
                            className="h-full w-full"
                            onReady={(e) => setPlayer(e.target)}
                            opts={{
                                width: '100%',
                                height: '100%',
                                playerVars: {
                                    autoplay: 0,
                                    controls: 0,
                                    modestbranding: 1,
                                    rel: 0
                                }
                            }}
                        />
                    </Card>

                    <div className="space-y-8">
                        <div className="flex justify-between items-end px-2">
                            <div>
                                <h3 className="font-black text-xs uppercase tracking-[0.3em] text-foreground/20 mb-1">Learning Flow</h3>
                                <div className="text-2xl font-black font-heading leading-none">Task Progress</div>
                            </div>
                            <span className="text-[10px] bg-primary text-white font-black px-3 py-1 rounded-lg shadow-lg shadow-primary/20">SENTENCE {currentIndex + 1} OF {segments.length}</span>
                        </div>

                        <div className="space-y-4">
                            {[
                                { m: 'listen', icon: <Headphones />, label: 'Listen', sub: 'Auditory processing' },
                                { m: 'type', icon: <Keyboard />, label: 'Type', sub: 'Kinesthetic memory' },
                                { m: 'check', icon: <CheckCircle2 />, label: 'Check', sub: 'Visual validation' }
                            ].map((step) => (
                                <div key={step.m} className={cn(
                                    "flex items-center gap-5 p-5 rounded-2xl transition-all duration-500 border-2",
                                    mode === step.m
                                        ? "bg-card border-primary shadow-2xl translate-x-4"
                                        : "bg-muted/10 border-transparent opacity-40 grayscale"
                                )}>
                                    <div className={cn(
                                        "h-12 w-12 rounded-xl flex items-center justify-center transition-all duration-500 shadow-lg",
                                        mode === step.m ? "bg-primary text-white shadow-primary/30 rotate-3" : "bg-card text-foreground/20"
                                    )}>
                                        {React.cloneElement(step.icon as React.ReactElement<{ className: string }>, { className: "h-6 w-6" })}
                                    </div>
                                    <div className="flex-1">
                                        <h4 className="font-black text-lg leading-none mb-1 font-heading">{step.label}</h4>
                                        <p className="text-[11px] font-bold text-foreground/30 uppercase tracking-widest">{step.sub}</p>
                                    </div>
                                    {mode === step.m && (
                                        <motion.div layoutId="step-indicator" className="h-3 w-3 rounded-full bg-accent animate-pulse shadow-[0_0_10px_rgba(234,88,12,0.8)]" />
                                    )}
                                </div>
                            ))}
                        </div>

                        <Card className="bg-primary/5 border-2 border-dashed border-primary/10 rounded-2xl">
                            <CardContent className="p-8 flex items-start gap-4">
                                <div className="h-10 w-10 shrink-0 bg-card rounded-xl shadow-md flex items-center justify-center">
                                    <Info className="h-5 w-5 text-primary" />
                                </div>
                                <p className="text-[13px] text-foreground/50 leading-relaxed font-medium">
                                    <b className="text-primary">Pro Tip:</b> If you can&apos;t hear clearly, try slowing down the audio or using a hint. Accuracy is key!
                                </p>
                            </CardContent>
                        </Card>
                    </div>
                </div>

                {/* Right: Dictation Work Area */}
                <div className="lg:col-span-8 xl:col-span-8 w-full">
                    <AnimatePresence mode="wait">
                        {mode !== 'read' ? (
                            <motion.div
                                key={`segment-${currentIndex}`}
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 1.05 }}
                                transition={{ duration: 0.4, ease: "easeOut" }}
                                className="space-y-10"
                            >
                                <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
                                    <div className="flex items-center gap-4">
                                        <div className="h-1 w-12 bg-primary rounded-full" />
                                        <span className="font-black text-sm uppercase tracking-[0.2em] text-foreground/30">Dictation Workspace</span>
                                    </div>
                                    <Button
                                        variant="outline"
                                        size="lg"
                                        onClick={handlePlaySegment}
                                        className="rounded-xl bg-card font-black h-14 px-8 border-2 border-primary/10 text-primary hover:bg-primary shadow-xl"
                                    >
                                        <RotateCcw className="h-5 w-5 mr-3" /> REPLAY (Space)
                                    </Button>
                                </div>

                                <div className="relative group">
                                    <textarea
                                        ref={textareaRef}
                                        className={cn(
                                            "min-h-[300px] w-full rounded-3xl border-4 p-8 text-2xl font-body outline-none transition-all duration-500 shadow-[0_20px_40px_rgba(0,0,0,0.05)] placeholder:text-foreground/10",
                                            mode === 'check'
                                                ? (isCorrect ? "bg-green-50/80 border-green-200 text-green-800" : "bg-red-50/80 border-red-200 text-red-800 shadow-[0_0_50px_rgba(239,68,68,0.1)]")
                                                : "bg-card border-primary/5 focus:border-primary/20 focus:shadow-[0_40px_80px_rgba(13,148,136,0.1)]"
                                        )}
                                        placeholder="Listen and type exactly what you hear..."
                                        autoFocus
                                        value={userInput}
                                        onChange={(e) => setUserInput(e.target.value)}
                                        disabled={mode === 'check'}
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter' && !e.shiftKey) {
                                                e.preventDefault();
                                                if (mode === 'type') checkAnswer();
                                                else if (mode === 'check') nextSegment();
                                            }
                                        }}
                                    />
                                    <div className="absolute right-12 bottom-12 flex items-center gap-3">
                                        <kbd className="h-10 px-3 flex items-center bg-muted/50 rounded-xl border-b-4 border-muted text-xs font-black text-foreground/40">ENTER</kbd>
                                        <span className="text-xs font-black text-foreground/20 uppercase tracking-[0.2em]">Check Answer</span>
                                    </div>
                                </div>

                                <AnimatePresence>
                                    {mode === 'check' && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 30 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className={cn(
                                                "p-8 rounded-3xl border-4 overflow-hidden shadow-2xl transition-all duration-500",
                                                isCorrect ? "bg-green-500 border-green-600 text-white" : "bg-red-500 border-red-600 text-white"
                                            )}
                                        >
                                            <div className="flex items-start gap-6">
                                                <div className={cn(
                                                    "h-16 w-16 rounded-2xl flex items-center justify-center shrink-0 shadow-2xl bg-white/20 backdrop-blur-md",
                                                    isCorrect ? "text-white" : "text-white"
                                                )}>
                                                    {isCorrect ? <CheckCircle2 className="h-10 w-10" /> : <XCircle className="h-10 w-10" />}
                                                </div>
                                                <div className="flex-1">
                                                    <h4 className="text-sm font-black uppercase tracking-[0.4em] mb-4 text-white/60 leading-none">
                                                        {isCorrect ? 'PERFECT ACCURACY' : 'SYSTEM CORRECTION'}
                                                    </h4>
                                                    <p className="text-4xl md:text-5xl font-black leading-tight font-heading italic tracking-tight underline decoration-white/20 underline-offset-8">
                                                        {currentSegment?.content}
                                                    </p>
                                                </div>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>

                                <div className="flex flex-col sm:flex-row gap-4 pt-4">
                                    {mode === 'check' ? (
                                        <Button className="w-full h-16 text-xl font-black rounded-2xl shadow-xl bg-accent" onClick={nextSegment}>
                                            NEXT SENTENCE <ChevronRight className="ml-3 h-6 w-6" />
                                        </Button>
                                    ) : (
                                        <Button className="w-full h-16 text-xl font-black rounded-2xl shadow-xl bg-primary" onClick={checkAnswer}>
                                            VALIDATE ANSWER
                                        </Button>
                                    )}
                                    <Button variant="ghost" className="h-16 px-8 font-bold text-foreground/30 hover:text-primary rounded-2xl text-base uppercase tracking-widest" onClick={() => nextSegment()}>
                                        SKIP
                                    </Button>
                                </div>
                            </motion.div>
                        ) : (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="text-center py-32 px-16 bg-card rounded-[4rem] shadow-[0_50px_100px_rgba(0,0,0,0.1)] border-8 border-primary/5 relative overflow-hidden"
                            >
                                <div className="relative z-10">
                                    <div className="mb-14 relative inline-block">
                                        <div className="absolute inset-0 bg-primary/20 rounded-full blur-[60px] animate-pulse" />
                                        <div className="relative h-48 w-48 bg-primary text-white rounded-full flex items-center justify-center shadow-[0_20px_60px_rgba(13,148,136,0.4)] mx-auto rotate-12">
                                            <CheckCircle2 className="h-24 w-24" />
                                        </div>
                                    </div>
                                    <h2 className="text-6xl md:text-8xl font-black mb-8 font-heading tracking-tighter italic">LEGENDARY!</h2>
                                    <p className="text-2xl text-foreground/40 mb-20 max-w-2xl mx-auto leading-relaxed font-medium">
                                        You&apos;ve successfully mastered <b>{exercise.title}</b>. <br /> Your brain just got a significant upgrade!
                                    </p>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-2xl mx-auto mb-16">
                                        <div className="p-8 bg-primary/5 rounded-3xl border-2 border-primary/10">
                                            <div className="text-xs font-black text-primary/40 uppercase tracking-[0.3em] mb-2">Total Time</div>
                                            <div className="text-4xl font-black font-heading">4m 24s</div>
                                        </div>
                                        <div className="p-8 bg-accent/5 rounded-3xl border-2 border-accent/10">
                                            <div className="text-xs font-black text-accent/40 uppercase tracking-[0.3em] mb-2">Score</div>
                                            <div className="text-4xl font-black font-heading text-accent">94%</div>
                                        </div>
                                    </div>
                                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                        <Button size="lg" className="h-16 px-12 rounded-2xl text-lg font-black shadow-xl bg-primary" onClick={() => router.push('/exercises')}>
                                            GO TO TOPICS
                                        </Button>
                                        <Button size="lg" variant="outline" className="h-16 px-12 rounded-2xl text-lg font-black border-2" onClick={() => window.location.reload()}>
                                            REPLAY LESSON
                                        </Button>
                                    </div>
                                </div>
                                <div className="absolute -top-20 -right-20 w-96 h-96 bg-primary/5 rounded-full blur-[100px]" />
                                <div className="absolute -bottom-20 -left-20 w-96 h-96 bg-accent/5 rounded-full blur-[100px]" />
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
}

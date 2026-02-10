"use client"

import Link from 'next/link';
import { motion } from 'framer-motion';
import { useParams } from 'next/navigation';
import {
    ArrowLeft,
    Play,
    CheckCircle2,
    Lock,
    Clock,
    BookOpen,
    Volume2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

// Mock data for sections and lessons
const sections = [
    {
        id: 1,
        title: "Level 1: Fundamentals",
        lessons: [
            { id: "001", title: "A Day at the Park", duration: "1:24", difficulty: "Easy", completed: true },
            { id: "002", title: "My Favorite Food", duration: "1:45", difficulty: "Easy", completed: true },
            { id: "003", title: "Talking about Hobbies", duration: "2:10", difficulty: "Easy", completed: false },
            { id: "004", title: "Weekend Plans", duration: "1:55", difficulty: "Easy", completed: false },
            { id: "005", title: "Meeting New People", duration: "2:05", difficulty: "Easy", completed: false },
        ]
    },
    {
        id: 2,
        title: "Level 2: Intermediate Stories",
        lessons: [
            { id: "006", title: "The Mysterious Traveler", duration: "3:15", difficulty: "Medium", completed: false },
            { id: "007", title: "Living in the City", duration: "2:40", difficulty: "Medium", completed: false, locked: true },
            { id: "008", title: "Future Technology", duration: "4:05", difficulty: "Medium", completed: false, locked: true },
        ]
    }
];

export default function CategoryDetailPage(): React.ReactNode {
    const { category } = useParams();
    const categoryName = typeof category === 'string' ? category.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ') : 'Exercises';

    return (
        <div className="container py-20">
            <Link href="/exercises" className="inline-flex items-center text-sm font-bold text-primary hover:text-primary/80 mb-10 group transition-colors">
                <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center mr-3 group-hover:-translate-x-1 transition-transform">
                    <ArrowLeft className="h-4 w-4" />
                </div>
                Back to All Topics
            </Link>

            <div className="flex flex-col lg:flex-row gap-16 items-start">
                {/* Left: Content */}
                <div className="flex-1 w-full">
                    <div className="mb-12">
                        <Badge variant="outline" className="mb-4 border-primary/20 text-primary font-bold px-4 py-1 uppercase tracking-widest text-[10px]">Learning Path</Badge>
                        <h1 className="text-4xl md:text-5xl font-heading font-black mb-6 tracking-tight">{categoryName}</h1>
                        <p className="text-lg text-foreground/50 max-w-2xl leading-relaxed">
                            Follow our structured learning path to master this topic. Each lesson includes high-quality audio and interactive exercises.
                        </p>
                    </div>

                    <div className="space-y-16">
                        {sections.map((section, sIdx) => (
                            <div key={section.id}>
                                <div className="flex items-center gap-5 mb-6">
                                    <div className="h-10 w-10 rounded-xl bg-primary text-white shadow-lg shadow-primary/20 flex items-center justify-center text-lg font-black">
                                        {section.id}
                                    </div>
                                    <h2 className="text-2xl font-black font-heading">{section.title}</h2>
                                </div>

                                <div className="space-y-6">
                                    {section.lessons.map((lesson, lIdx) => (
                                        <motion.div
                                            key={lesson.id}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: lIdx * 0.05 + sIdx * 0.2 }}
                                        >
                                            <Link href={lesson.locked ? "#" : `/exercise/${lesson.id}`}>
                                                <Card className={`group relative overflow-hidden transition-all duration-300 border-none shadow-md hover:shadow-xl rounded-[1.5rem] ${lesson.locked ? 'opacity-60 bg-muted/20 pointer-events-none' : 'bg-card'}`}>
                                                    <CardContent className="p-5 sm:p-6 flex items-center gap-5 sm:gap-6 text-left">
                                                        <div className={`h-12 w-12 sm:h-14 sm:w-14 rounded-xl flex items-center justify-center transition-all duration-300 ${lesson.completed ? 'bg-green-500 text-white shadow-lg shadow-green-200' : 'bg-primary/5 text-primary group-hover:bg-primary group-hover:text-white group-hover:shadow-lg group-hover:shadow-primary/20'}`}>
                                                            {lesson.completed ? <CheckCircle2 className="h-6 w-6" /> : <Play className="h-6 w-6 pl-1 animate-pulse" />}
                                                        </div>

                                                        <div className="flex-1">
                                                            <div className="flex flex-wrap items-center gap-3 mb-2">
                                                                <h3 className="font-black text-xl font-heading leading-tight">{lesson.title}</h3>
                                                                {lesson.locked && <Lock className="h-4 w-4 text-muted-foreground" />}
                                                            </div>
                                                            <div className="flex items-center gap-6 text-sm font-bold text-foreground/40">
                                                                <span className="flex items-center gap-2"><Clock className="h-4 w-4 text-primary/40" /> {lesson.duration}</span>
                                                                <Badge variant="outline" className="text-[10px] uppercase font-black tracking-widest px-2 py-0.5 rounded-md border-primary/10">{lesson.difficulty}</Badge>
                                                            </div>
                                                        </div>

                                                        <div className="hidden sm:block">
                                                            <Button className="font-black h-12 rounded-xl px-6 opacity-0 group-hover:opacity-100 transition-all shadow-lg translate-y-2 group-hover:translate-y-0">
                                                                Start Now
                                                            </Button>
                                                        </div>
                                                    </CardContent>
                                                    {lesson.completed && (
                                                        <div className="absolute top-0 right-0 p-3">
                                                            <div className="bg-green-500/10 text-green-600 text-[10px] font-black px-3 py-1 rounded-full border border-green-500/20">
                                                                PASSED
                                                            </div>
                                                        </div>
                                                    )}
                                                </Card>
                                            </Link>
                                        </motion.div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Right: Sidebar Stats */}
                <div className="w-full lg:w-[380px] shrink-0 lg:sticky lg:top-32 space-y-6">
                    <Card className="bg-primary text-white border-none shadow-2xl rounded-3xl overflow-hidden relative">
                        <CardContent className="p-8 relative z-10">
                            <h3 className="text-2xl font-black mb-8 font-heading">Your Progress</h3>
                            <div className="space-y-8">
                                <div>
                                    <div className="flex justify-between text-sm mb-3 font-black uppercase tracking-wider text-white/60">
                                        <span>Completion</span>
                                        <span>2 / 15 Lessons</span>
                                    </div>
                                    <div className="h-4 w-full bg-white/10 rounded-full overflow-hidden p-1">
                                        <div className="h-full bg-accent w-[13%] rounded-full shadow-[0_0_15px_rgba(234,88,12,0.8)] transition-all duration-1000" />
                                    </div>
                                </div>
                                <div className="space-y-4 pt-4 border-t border-white/10">
                                    <div className="flex items-center gap-4 text-base font-bold">
                                        <div className="h-12 w-12 rounded-2xl bg-white/10 flex items-center justify-center text-accent">
                                            <Volume2 className="h-6 w-6" />
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-2xl font-black">324</span>
                                            <span className="text-sm text-white/50">words typed</span>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4 text-base font-bold">
                                        <div className="h-12 w-12 rounded-2xl bg-white/10 flex items-center justify-center text-accent">
                                            <BookOpen className="h-6 w-6" />
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-2xl font-black">46m</span>
                                            <span className="text-sm text-white/50">total practice</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                        <div className="absolute -right-12 -bottom-12 w-48 h-48 bg-white/5 rounded-full blur-2xl" />
                        <div className="absolute -left-8 -top-8 w-24 h-24 bg-white/5 rounded-full blur-xl" />
                    </Card>

                    <Card className="border-2 border-dashed border-primary/10 rounded-2xl bg-primary/5">
                        <CardContent className="p-8">
                            <h4 className="font-black mb-4 text-primary font-heading">Study Pro-Tip</h4>
                            <p className="text-sm text-foreground/50 leading-relaxed italic font-medium">
                                &quot;Try to practice at least 15 minutes every day. Consistency is more important than duration when learning a new language.&quot;
                            </p>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}

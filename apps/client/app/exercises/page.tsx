"use client"

import Link from 'next/link';
import { motion } from 'framer-motion';
import { PlayCircle, Search, Filter, ArrowRight } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

const topics = [
    {
        id: 'short-stories',
        title: 'Short Stories',
        description: 'Improve your English with 120+ engaging short stories for beginners.',
        count: 120,
        level: 'Easy',
        color: 'bg-blue-500',
    },
    {
        id: 'conversations',
        title: 'English Conversations',
        description: 'Listen to everyday conversations and practice real-life English.',
        count: 85,
        level: 'Intermediate',
        color: 'bg-green-500',
    },
    {
        id: 'toeic',
        title: 'TOEIC Listening',
        description: 'Prepare for the TOEIC test with authentic listening materials.',
        count: 180,
        level: 'Intermediate/Advanced',
        color: 'bg-purple-500',
    },
    {
        id: 'ielts',
        title: 'IELTS Listening',
        description: 'Comprehensive practice for IELTS candidates across all bands.',
        count: 200,
        level: 'Advanced',
        color: 'bg-orange-500',
    },
    {
        id: 'kids-stories',
        title: 'Stories for Kids',
        description: 'Simple and fun stories with clear pronunciation for younger learners.',
        count: 55,
        level: 'Very Easy',
        color: 'bg-pink-500',
    },
    {
        id: 'youtube',
        title: 'YouTube Lessons',
        description: 'Popular viral videos and educational content transformed into dictation.',
        count: 320,
        level: 'Intermediate',
        color: 'bg-red-500',
    },
];

export default function ExercisesPage(): React.ReactNode {
    return (
        <div className="container py-20">
            <div className="mb-16 text-center max-w-3xl mx-auto">
                <Badge variant="outline" className="mb-4 border-primary/20 text-primary font-bold px-4 py-1 uppercase tracking-widest text-[10px]">Library</Badge>
                <h1 className="text-4xl md:text-5xl font-heading font-black mb-6 tracking-tight">All Learning Topics</h1>
                <p className="text-lg text-foreground/50 leading-relaxed">
                    Browse our extensive collection of English listening exercises. <br className="hidden md:block" /> Select a category that matches your level and interest.
                </p>
            </div>

            <div className="flex flex-col lg:flex-row gap-4 mb-12 max-w-5xl mx-auto">
                <div className="relative flex-1 group">
                    <Search className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                    <input
                        type="text"
                        placeholder="Search topics or keywords..."
                        className="w-full h-12 pl-14 pr-6 rounded-xl border-2 border-primary/10 bg-card shadow-sm focus:ring-4 focus:ring-primary/5 focus:border-primary/30 outline-none transition-all text-base font-medium"
                    />
                </div>
                <div className="flex gap-3">
                    <Button variant="outline" className="h-12 rounded-xl px-6 text-base font-bold border-2">
                        <Filter className="mr-3 h-5 w-5" /> Filter Level
                    </Button>
                    <Button variant="outline" className="h-12 rounded-xl px-6 text-base font-bold border-2">
                        Popularity
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                {topics.map((topic, idx) => (
                    <motion.div
                        key={topic.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.05 }}
                        whileHover={{ y: -10 }}
                    >
                        <Link href={`/exercises/${topic.id}`}>
                            <Card className="h-full border-none shadow-lg hover:shadow-2xl transition-all duration-500 rounded-[2rem] overflow-hidden flex flex-col group bg-card">
                                <div className={`h-3 ${topic.color}`} />
                                <CardContent className="p-8 flex-1 flex flex-col">
                                    <div className="flex items-center justify-between mb-6">
                                        <Badge variant="secondary" className="font-bold bg-muted/50 text-foreground/40 text-[10px] uppercase tracking-widest px-3 py-1 rounded-lg">{topic.level}</Badge>
                                        <span className="text-[10px] font-black text-primary/30 uppercase tracking-[0.2em]">{topic.id.replace('-', ' ')}</span>
                                    </div>
                                    <h2 className="text-2xl font-black mb-4 group-hover:text-primary transition-colors font-heading leading-tight">{topic.title}</h2>
                                    <p className="text-foreground/50 text-base mb-10 flex-1 leading-relaxed">
                                        {topic.description}
                                    </p>
                                    <div className="flex items-center justify-between mt-auto pt-8 border-t border-dashed border-primary/10">
                                        <div className="flex items-center text-sm font-bold text-foreground/60">
                                            <div className="h-10 w-10 rounded-xl bg-primary/5 flex items-center justify-center mr-3">
                                                <PlayCircle className="h-5 w-5 text-primary" />
                                            </div>
                                            {topic.count} Lessons
                                        </div>
                                        <Button variant="ghost" className="font-black text-primary hover:bg-transparent hover:translate-x-2 transition-all p-0 h-auto text-base">
                                            Explore <ArrowRight className="ml-2 h-5 w-5" />
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        </Link>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}

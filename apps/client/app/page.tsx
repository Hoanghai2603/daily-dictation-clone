"use client"

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  PlayCircle,
  Headphones,
  Keyboard,
  CheckCircle,
  Mic,
  ArrowRight,
  Star,
  Zap,
  BookOpen
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const topics = [
  {
    id: 'short-stories',
    title: 'Short Stories',
    count: 120,
    level: 'Easy',
    color: 'bg-blue-500',
    icon: <BookOpen className="h-6 w-6 text-white" />
  },
  {
    id: 'conversations',
    title: 'English Conversations',
    count: 85,
    level: 'Intermediate',
    color: 'bg-green-500',
    icon: <Mic className="h-6 w-6 text-white" />
  },
  {
    id: 'toeic',
    title: 'TOEIC Listening',
    count: 180,
    level: 'Intermediate',
    color: 'bg-purple-500',
    icon: <Zap className="h-6 w-6 text-white" />
  },
  {
    id: 'ielts',
    title: 'IELTS Listening',
    count: 200,
    level: 'Advanced',
    color: 'bg-orange-500',
    icon: <Star className="h-6 w-6 text-white" />
  },
];

const steps = [
  {
    title: "Listen",
    desc: "Listen to the audio clip carefully. You can play it as many times as you need.",
    icon: <Headphones className="h-8 w-8 text-primary" />,
    step: 1
  },
  {
    title: "Type",
    desc: "Type exactly what you hear. Our smart editor helps you focus on accuracy.",
    icon: <Keyboard className="h-8 w-8 text-primary" />,
    step: 2
  },
  {
    title: "Check",
    desc: "Get instant feedback. See your mistakes and learn the correct spelling.",
    icon: <CheckCircle className="h-8 w-8 text-primary" />,
    step: 3
  },
  {
    title: "Speak",
    desc: "Read the transcript aloud to improve your pronunciation and fluency.",
    icon: <Mic className="h-8 w-8 text-primary" />,
    step: 4
  }
];

export default function Home(): React.ReactNode {
  return (
    <div className="flex flex-col gap-32 pb-32">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-primary/5 pt-32 pb-40">
        <div className="container relative z-10">
          <div className="flex flex-col items-center text-center max-w-5xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Badge variant="secondary" className="mb-8 px-6 py-2 text-sm font-black rounded-full shadow-sm bg-card border-2 border-primary/10">
                🚀 100% Free English Dictation
              </Badge>
              <h1 className="text-5xl md:text-7xl font-heading font-black text-foreground leading-[1.1] mb-8 tracking-tight">
                Master English Through <br /><span className="text-primary">Daily Dictation</span>
              </h1>
              <p className="text-lg md:text-xl text-foreground/70 mb-10 max-w-2xl mx-auto leading-relaxed">
                Improve your listening, spelling, and pronunciation all at once. <br className="hidden md:block" /> The most effective way to reach fluency, step by step.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Button size="lg" className="h-14 px-10 text-lg rounded-xl shadow-xl bg-primary font-black" asChild>
                  <Link href="/exercises">
                    Start Learning Now <ArrowRight className="ml-3 h-5 w-5" />
                  </Link>
                </Button>
                <Button variant="outline" size="lg" className="h-14 px-10 text-lg rounded-xl bg-card/50 backdrop-blur font-bold border-2">
                  How it works
                </Button>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Abstract shapes for "WOW" factor */}
        <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/4 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/4 w-[600px] h-[600px] bg-secondary/10 rounded-full blur-[120px] pointer-events-none" />
      </section>

      {/* How it works */}
      <section className="container">
        <div className="text-center mb-24">
          <Badge variant="outline" className="mb-4 border-primary/20 text-primary font-bold px-4 py-1">METHODOLOGY</Badge>
          <h2 className="text-4xl md:text-5xl font-heading font-black mb-6">How it improves your English</h2>
          <p className="text-xl text-foreground/60 max-w-2xl mx-auto leading-relaxed">Our proven methodology combines auditory processing with kinesthetic memory to lock in language patterns.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {steps.map((step, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
            >
              <Card className="h-full border-none shadow-none bg-transparent text-center group">
                <CardContent className="pt-0 p-8">
                  <div className="relative mb-8 mx-auto w-20 h-20 flex items-center justify-center bg-card rounded-2xl shadow-lg group-hover:shadow-2xl group-hover:-translate-y-2 transition-all duration-300 ring-1 ring-primary/5">
                    <div className="absolute -top-3 -right-3 w-8 h-8 rounded-xl bg-primary text-white flex items-center justify-center font-black text-sm shadow-lg">
                      {step.step}
                    </div>
                    {React.cloneElement(step.icon as React.ReactElement<{ className: string }>, { className: "h-10 w-10 text-primary" })}
                  </div>
                  <h3 className="text-2xl font-black mb-4 font-heading">{step.title}</h3>
                  <p className="text-foreground/50 text-base leading-relaxed">{step.desc}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Topics Grid */}
      <section className="container">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-20">
          <div>
            <Badge variant="outline" className="mb-4 border-primary/20 text-primary font-bold px-4 py-1">CATEGORIES</Badge>
            <h2 className="text-4xl md:text-5xl font-heading font-bold mb-4">Choose your topic</h2>
            <p className="text-lg text-foreground/60">Over 500+ exercises across 20+ specialized categories.</p>
          </div>
          <Button variant="ghost" className="text-primary font-black text-lg -mr-4 hover:bg-primary/5" asChild>
            <Link href="/exercises" className="group">
              View all topics <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-2" />
            </Link>
          </Button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {topics.map((topic, idx) => (
            <motion.div
              key={topic.id}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.05 }}
              whileHover={{ y: -12 }}
            >
              <Link href={`/exercises/${topic.id}`}>
                <Card className="h-full overflow-hidden cursor-pointer border-none shadow-lg hover:shadow-2xl transition-all duration-500 rounded-3xl group bg-card">
                  <div className={`h-40 ${topic.color} flex items-center justify-center relative overflow-hidden`}>
                    <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                    {React.cloneElement(topic.icon as React.ReactElement<{ className: string }>, { className: "h-12 w-12 text-white relative z-10" })}
                    <div className="absolute -right-8 -bottom-8 w-32 h-32 bg-white/10 rounded-full" />
                    <div className="absolute -left-4 -top-4 w-20 h-20 bg-black/5 rounded-full" />
                  </div>
                  <CardContent className="p-8">
                    <Badge variant="secondary" className="mb-4 font-bold text-[10px] uppercase tracking-widest bg-muted/50 text-foreground/40 rounded-lg px-2 py-0.5">
                      {topic.level}
                    </Badge>
                    <h3 className="text-xl font-black mb-6 group-hover:text-primary transition-colors leading-tight font-heading">{topic.title}</h3>
                    <div className="flex items-center justify-between text-sm text-foreground/40 font-bold border-t border-dashed pt-6">
                      <span className="flex items-center"><PlayCircle className="mr-2 h-5 w-5 text-primary" /> {topic.count} lessons</span>
                      <span className="text-primary transform translate-x-[-10px] opacity-0 group-hover:opacity-100 group-hover:translate-x-0 transition-all"><ArrowRight className="h-5 w-5" /></span>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Newsletter/CTA */}
      <section className="container mb-20">
        <div className="bg-primary rounded-[2rem] p-10 md:p-20 text-center text-white relative overflow-hidden shadow-2xl">
          <div className="relative z-10 max-w-3xl mx-auto">
            <h2 className="text-4xl md:text-6xl font-heading font-black mb-8 leading-tight">Join 10,000+ learners <br />starting today</h2>
            <p className="text-primary-foreground/80 mb-14 text-xl leading-relaxed">
              Subscribe to get weekly new dictation exercises and language tips delivered directly to your inbox.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 max-w-lg mx-auto bg-white/10 p-1.5 rounded-2xl backdrop-blur-md">
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full h-12 bg-transparent outline-none px-6 text-white placeholder:text-white/50 font-medium"
              />
              <Button className="w-full sm:w-auto h-12 px-8 rounded-xl bg-accent hover:bg-accent/90 text-white font-black text-base shadow-xl border-none">
                Join Free
              </Button>
            </div>
          </div>
          <div className="absolute top-0 left-0 w-80 h-80 bg-white/5 rounded-full -translate-x-1/2 -translate-y-1/2 blur-2xl" />
          <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-white/5 rounded-full translate-x-1/3 translate-y-1/3 blur-3xl" />
        </div>
      </section>
    </div>
  );
}

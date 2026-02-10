"use client"

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowLeft, Mail, Lock, User, Chrome } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Label } from '@/components/ui/label';

export default function RegisterPage(): React.ReactNode {
    return (
        <div className="relative min-h-[calc(100vh-80px)] flex flex-col items-center justify-center py-12 px-4">
            <Link href="/" className="absolute left-6 top-12 md:left-12 inline-flex items-center text-base font-bold text-foreground/40 hover:text-primary transition-all group">
                <div className="h-10 w-10 rounded-full bg-primary/5 flex items-center justify-center mr-3 group-hover:-translate-x-1 transition-transform">
                    <ArrowLeft className="h-5 w-5" />
                </div>
                Back to Home
            </Link>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="w-full max-w-[480px]"
            >
                <Card className="border-none shadow-[0_20px_50px_rgba(0,0,0,0.08)] rounded-[2rem] bg-card overflow-hidden ring-1 ring-primary/5">
                    <CardHeader className="space-y-3 text-center p-10 pb-4">
                        <div className="h-16 w-16 bg-accent/10 rounded-2xl flex items-center justify-center mx-auto mb-2 -rotate-3 transition-transform hover:rotate-0">
                            <User className="h-8 w-8 text-accent" />
                        </div>
                        <CardTitle className="text-3xl font-heading font-black tracking-tight leading-tight">Create account</CardTitle>
                        <CardDescription className="text-base font-medium text-foreground/50 leading-relaxed">
                            Start your English journey today for free
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="grid gap-6 p-10 pt-4">
                        <Button variant="outline" className="h-12 rounded-xl mb-1 font-bold border-2 text-base">
                            <Chrome className="mr-3 h-5 w-5 text-red-500" /> Sign up with Google
                        </Button>

                        <div className="relative my-4">
                            <div className="absolute inset-0 flex items-center px-4">
                                <span className="w-full border-t border-dashed border-primary/10" />
                            </div>
                            <div className="relative flex justify-center text-[10px] uppercase font-bold tracking-[0.3em]">
                                <span className="bg-card px-6 text-foreground/20">or email registration</span>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className="relative group/input">
                                <Label htmlFor="name" className="sr-only">Full Name</Label>
                                <User className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-foreground/30 group-focus-within/input:text-primary transition-colors" />
                                <input
                                    id="name"
                                    type="text"
                                    placeholder="Full Name"
                                    className="w-full h-12 pl-14 pr-6 rounded-xl border-2 border-primary/10 bg-muted/20 focus:bg-card focus:ring-4 focus:ring-primary/5 focus:border-primary/30 outline-none transition-all font-medium text-base"
                                />
                            </div>
                            <div className="relative group/input">
                                <Label htmlFor="email" className="sr-only">Email address</Label>
                                <Mail className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-foreground/30 group-focus-within/input:text-primary transition-colors" />
                                <input
                                    id="email"
                                    type="email"
                                    placeholder="Email address"
                                    className="w-full h-12 pl-14 pr-6 rounded-xl border-2 border-primary/10 bg-muted/20 focus:bg-card focus:ring-4 focus:ring-primary/5 focus:border-primary/30 outline-none transition-all font-medium text-base"
                                />
                            </div>
                            <div className="relative group/input">
                                <Label htmlFor="password" className="sr-only">Create Password</Label>
                                <Lock className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-foreground/30 group-focus-within/input:text-primary transition-colors" />
                                <input
                                    id="password"
                                    type="password"
                                    placeholder="Create Password"
                                    className="w-full h-12 pl-14 pr-6 rounded-xl border-2 border-primary/10 bg-muted/20 focus:bg-card focus:ring-4 focus:ring-primary/5 focus:border-primary/30 outline-none transition-all font-medium text-base"
                                />
                            </div>
                        </div>

                        <p className="text-[11px] text-center text-foreground/30 font-bold px-4 leading-relaxed tracking-wide uppercase">
                            By clicking &quot;Create Account&quot;, you agree to our{" "}
                            <Link href="/terms" className="text-primary hover:underline underline-offset-4">Terms of Service</Link> and{" "}
                            <Link href="/privacy" className="text-primary hover:underline underline-offset-4">Privacy Policy</Link>.
                        </p>

                        <Button className="h-14 rounded-xl font-black text-lg mt-4 shadow-xl bg-primary shadow-primary/20">
                            Create Account
                        </Button>
                    </CardContent>
                    <CardFooter className="text-center justify-center p-10 pt-0">
                        <div className="text-base text-foreground/50 font-bold">
                            Already have an account?{" "}
                            <Link href="/login" className="text-primary font-black hover:underline underline-offset-4">
                                Sign In
                            </Link>
                        </div>
                    </CardFooter>
                </Card>
            </motion.div>

            {/* Decorative background elements */}
            <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] bg-primary/5 rounded-full blur-[160px]" />
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-accent/5 rounded-full blur-[120px]" />
                <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-secondary/10 rounded-full blur-[100px]" />
            </div>
        </div>
    );
}

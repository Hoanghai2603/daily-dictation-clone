"use client";

import { ThemeToggle } from "@/components/ThemeToggle";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { createClient } from "@/lib/supabase/client";
import { userService } from "@/services/user.service";
import { LogOut, Menu, User } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export function Navbar(): React.ReactNode {
    const [user, setUser] = useState<any>(null);
    const [profile, setProfile] = useState<any>(null);
    const router = useRouter();

    useEffect(() => {
        const supabase = createClient();

        const getUser = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            setUser(user);

            if (user) {
                try {
                    const { profile } = await userService.getUser(user.id);
                    setProfile(profile);
                } catch (error) {
                    console.error("Failed to load profile", error);
                }
            }
        };

        getUser();

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user ?? null);
            if (session?.user) {
                userService.getUser(session.user.id).then(({ profile }) => setProfile(profile)).catch(console.error);
            } else {
                setProfile(null);
            }
        });

        return () => subscription.unsubscribe();
    }, []);

    const handleSignOut = async () => {
        const supabase = createClient();
        await supabase.auth.signOut();
        router.refresh();
        router.push("/login");
    };

    return (
        <nav className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60">
            <div className="container flex h-20 items-center justify-between">
                <div className="flex items-center gap-8 md:gap-12">
                    <Link href="/" className="flex items-center space-x-2 transition-transform hover:scale-105">
                        <span className="inline-block font-heading text-3xl font-bold text-primary tracking-tight">
                            Daily<span className="text-accent">Dictation</span>
                        </span>
                    </Link>
                    <div className="hidden gap-8 lg:flex">
                        <Link
                            href="/exercises"
                            className="flex items-center text-sm font-bold text-foreground/60 transition-all hover:text-primary hover:translate-y-[-1px]"
                        >
                            All exercises
                        </Link>
                        <Link
                            href="/top-users"
                            className="flex items-center text-sm font-bold text-foreground/60 transition-all hover:text-primary hover:translate-y-[-1px]"
                        >
                            Top users
                        </Link>
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    <div className="hidden sm:flex">
                        <ThemeToggle />
                    </div>

                    {user ? (
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                                    <Avatar className="h-10 w-10 border border-border">
                                        <AvatarImage src={profile?.avatar_url || user.user_metadata?.avatar_url} alt={profile?.full_name || user.email} />
                                        <AvatarFallback>{(profile?.full_name?.[0] || user.email?.[0] || "U").toUpperCase()}</AvatarFallback>
                                    </Avatar>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="w-56" align="end" forceMount>
                                <DropdownMenuLabel className="font-normal">
                                    <div className="flex flex-col space-y-1">
                                        <p className="text-sm font-medium leading-none">{profile?.full_name || "User"}</p>
                                        <p className="text-xs leading-none text-muted-foreground">
                                            {user.email}
                                        </p>
                                    </div>
                                </DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem asChild>
                                    <Link href="/settings/profile" className="cursor-pointer">
                                        <User className="mr-2 h-4 w-4" />
                                        <span>Profile</span>
                                    </Link>
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={handleSignOut} className="cursor-pointer text-red-500 focus:text-red-500">
                                    <LogOut className="mr-2 h-4 w-4" />
                                    <span>Log out</span>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    ) : (
                        <div className="flex items-center gap-3">
                            <Button asChild className="bg-primary hover:bg-primary/90 text-white font-bold rounded-xl px-8 transition-all hover:scale-105 active:scale-95 shadow-lg shadow-primary/20">
                                <Link href="/login">Get Started</Link>
                            </Button>
                        </div>
                    )}

                    <Button variant="ghost" size="icon" className="lg:hidden rounded-full">
                        <Menu className="h-6 w-6" />
                    </Button>
                </div>
            </div>
        </nav>
    );
}

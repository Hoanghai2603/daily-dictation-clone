import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";

export function Navbar(): React.ReactNode {
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
                    <div className="flex items-center gap-3">
                        <Button variant="ghost" asChild className="hidden md:inline-flex text-foreground/60 font-bold hover:bg-transparent hover:text-primary">
                            <Link href="/login">Login</Link>
                        </Button>
                        <Button asChild className="bg-accent hover:bg-accent/90 text-white font-black shadow-[0_4px_14px_0_rgba(234,88,12,0.39)] rounded-xl px-8">
                            <Link href="/register">Register</Link>
                        </Button>
                    </div>
                    <Button variant="ghost" size="icon" className="lg:hidden rounded-full">
                        <Menu className="h-6 w-6" />
                    </Button>
                </div>
            </div>
        </nav>
    );
}

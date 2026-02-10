"use client";

import { useTheme } from "@/components/ThemeProvider";
import { Button } from "@/components/ui/button";
import { Moon, Sun } from "lucide-react";

export function ThemeToggle(): React.ReactNode {
    const { theme, toggleTheme } = useTheme();
    const isDark = theme === "dark";

    return (
        <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            className="relative cursor-pointer text-foreground/60 rounded-full hover:bg-primary/10 hover:text-primary transition-colors overflow-hidden"
            aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
        >
            {/* Sun icon */}
            <Sun
                className={`h-5 w-5 absolute transition-all duration-500 ease-in-out ${isDark
                    ? "rotate-90 scale-0 opacity-0"
                    : "rotate-0 scale-100 opacity-100"
                    }`}
            />
            {/* Moon icon */}
            <Moon
                className={`h-5 w-5 absolute transition-all duration-500 ease-in-out ${isDark
                    ? "rotate-0 scale-100 opacity-100"
                    : "-rotate-90 scale-0 opacity-0"
                    }`}
            />
        </Button>
    );
}

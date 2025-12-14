"use client";

import * as React from "react";
import { Moon, Sun, Laptop } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";

export function ThemeToggle() {
    const { setTheme, theme } = useTheme();

    return (
        <div className="flex items-center gap-2 rounded-lg border border-border bg-background/50 p-1 backdrop-blur-sm">
            <Button
                variant="ghost"
                size="icon"
                className={`h-8 w-8 ${theme === "light" ? "bg-accent text-accent-foreground" : ""}`}
                onClick={() => setTheme("light")}
            >
                <Sun className="h-4 w-4" />
                <span className="sr-only">Light</span>
            </Button>
            <Button
                variant="ghost"
                size="icon"
                className={`h-8 w-8 ${theme === "dark" ? "bg-accent text-accent-foreground" : ""}`}
                onClick={() => setTheme("dark")}
            >
                <Moon className="h-4 w-4" />
                <span className="sr-only">Dark</span>
            </Button>
            <Button
                variant="ghost"
                size="icon"
                className={`h-8 w-8 ${theme === "system" ? "bg-accent text-accent-foreground" : ""}`}
                onClick={() => setTheme("system")}
            >
                <Laptop className="h-4 w-4" />
                <span className="sr-only">System</span>
            </Button>
        </div>
    );
}

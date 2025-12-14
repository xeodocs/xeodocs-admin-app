"use client";

import { useAuth } from "@/context/auth-context";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { AppSidebar } from "@/components/app-sidebar";
import { ThemeToggle } from "@/components/theme-toggle";
// Need to create ThemeToggle

export default function ProtectedLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const { user, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!loading && !user) {
            router.push("/login");
        }
    }, [user, loading, router]);

    if (loading) {
        return (
            <div className="flex h-screen w-full items-center justify-center bg-background text-primary">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-current border-t-transparent" />
            </div>
        );
    }

    if (!user) {
        return null; // Will redirect
    }

    return (
        <div className="flex min-h-screen">
            <AppSidebar />
            <main className="ml-64 flex-1 p-8">
                <div className="mb-8 flex items-center justify-between">
                    <h1 className="text-3xl font-bold tracking-tight text-foreground drop-shadow-md">Dashboard</h1>
                    <ThemeToggle />
                </div>
                <div className="animate-in fade-in slide-in-from-bottom-5 duration-500">
                    {children}
                </div>
            </main>
        </div>
    );
}

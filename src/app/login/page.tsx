"use client";

import { useState } from "react";
import { useAuth } from "@/context/auth-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { ThemeToggle } from "@/components/theme-toggle";
import Image from "next/image";

export default function LoginPage() {
    const { login } = useAuth();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        try {
            await login({ email, password });
        } catch (err: any) {
            console.error(err);
            setError("Invalid credentials. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="relative flex min-h-screen w-full flex-col items-center justify-center overflow-hidden p-4">
            <div className="absolute right-4 top-4 z-10 md:right-8 md:top-8">
                <ThemeToggle />
            </div>

            <div className="relative z-10 w-full max-w-lg">
                <Card className="relative border-border bg-card/90 shadow-[0px_0px_50px_rgba(124,58,237,0.15),0px_0px_20px_rgba(0,0,0,0.05)] backdrop-blur-xl dark:bg-card/60">
                    <CardHeader className="space-y-3 pb-8 text-center">
                        <div className="flex justify-center">
                            <div className="relative flex h-20 w-20 items-center justify-center">
                                <Image
                                    src="/xeodocs-logo.png"
                                    alt="XeoDocs Logo"
                                    width={80}
                                    height={80}
                                    className="object-contain drop-shadow-[0_0_15px_rgba(124,58,237,0.5)]"
                                    priority
                                />
                            </div>
                        </div>
                        <div>
                            <CardTitle className="bg-gradient-to-br from-foreground to-foreground/80 bg-clip-text text-3xl font-bold tracking-tight text-transparent">
                                Welcome Back
                            </CardTitle>
                            <CardDescription className="mt-2 text-base font-medium text-muted-foreground">
                                Sign in to your administrative dashboard
                            </CardDescription>
                        </div>
                    </CardHeader>
                    <form onSubmit={handleSubmit}>
                        <CardContent className="space-y-6">
                            {error && (
                                <div className="overflow-hidden rounded-lg bg-destructive/10 px-4 py-3 text-sm font-medium text-destructive border border-destructive/20">
                                    <div className="flex items-center gap-2">
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4"><circle cx="12" cy="12" r="10" /><line x1="12" x2="12" y1="8" y2="12" /><line x1="12" x2="12.01" y1="16" y2="16" /></svg>
                                        {error}
                                    </div>
                                </div>
                            )}
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-foreground">Email</label>
                                    <Input
                                        type="email"
                                        placeholder="name@xeodocs.com"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                        className="h-11 border-input bg-secondary/50 px-4 text-foreground placeholder:text-muted-foreground transition-all hover:bg-secondary/80 focus:border-primary/50 focus:bg-background focus:ring-2 focus:ring-primary/20"
                                        autoFocus
                                    />
                                </div>
                                <div className="space-y-2">
                                    <div className="flex items-center justify-between">
                                        <label className="text-sm font-semibold leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-foreground">Password</label>
                                    </div>
                                    <Input
                                        type="password"
                                        placeholder="••••••••"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                        className="h-11 border-input bg-secondary/50 px-4 text-foreground placeholder:text-muted-foreground transition-all hover:bg-secondary/80 focus:border-primary/50 focus:bg-background focus:ring-2 focus:ring-primary/20"
                                    />
                                </div>
                            </div>
                        </CardContent>
                        <CardFooter className="pb-8 pt-2">
                            <Button
                                type="submit"
                                className="group relative h-11 w-full overflow-hidden rounded-xl bg-gradient-to-r from-primary to-violet-600 font-semibold text-white shadow-lg shadow-primary/25 transition-all hover:scale-[1.02] hover:shadow-primary/40 active:scale-100"
                                disabled={loading}
                            >
                                <div className="absolute inset-0 bg-white/20 opacity-0 transition-opacity group-hover:opacity-100" />
                                {loading ? (
                                    <div className="flex items-center justify-center gap-2">
                                        <span className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                                        <span>Authenticating...</span>
                                    </div>
                                ) : (
                                    "Sign In"
                                )}
                            </Button>
                        </CardFooter>
                    </form>
                </Card>
                <p className="mt-6 text-center text-sm font-medium text-muted-foreground">
                    &copy; {new Date().getFullYear()} XeoDocs. All rights reserved.
                </p>
            </div>
        </div>
    );
}

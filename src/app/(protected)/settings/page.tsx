"use client";

import { useEffect, useState } from "react";
import { AxiosError } from "axios";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { configurationsService } from "@/lib/services/configurations";
import { Loader2 } from "lucide-react";

export default function SettingsPage() {
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);

    // Config state
    const [syncInterval, setSyncInterval] = useState("");
    const [wakeInterval, setWakeInterval] = useState("");

    // Existence flags
    const [syncIntervalExists, setSyncIntervalExists] = useState(false);
    const [wakeIntervalExists, setWakeIntervalExists] = useState(false);

    const [error, setError] = useState("");
    const [successMessage, setSuccessMessage] = useState("");

    const SYNC_INTERVAL_KEY = "project_sync_interval";
    const WAKE_INTERVAL_KEY = "worker_wake_interval";

    useEffect(() => {
        loadConfigurations();
    }, []);

    const loadConfigurations = async () => {
        try {
            setIsLoading(true);

            // Load project_sync_interval
            try {
                const syncData = await configurationsService.get(SYNC_INTERVAL_KEY);
                setSyncInterval(syncData.data.value);
                setSyncIntervalExists(true);
            } catch (err) {
                const error = err as AxiosError;
                if (error.response?.status !== 404) throw err;
                setSyncIntervalExists(false);
            }

            // Load worker_wake_interval
            try {
                const wakeData = await configurationsService.get(WAKE_INTERVAL_KEY);
                setWakeInterval(wakeData.data.value);
                setWakeIntervalExists(true);
            } catch (err) {
                const error = err as AxiosError;
                if (error.response?.status !== 404) throw err;
                setWakeIntervalExists(false);
            }

        } catch (err) {
            console.error("Failed to load configurations", err);
            setError("Failed to load settings. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    const validateDuration = (duration: string) => {
        if (!duration) return true; // Allow empty to mean "use default" if user desires, or handle strictly? 
        // User request implied format required if set. Let's enforce format if not empty.
        // Actually, if it's empty, we might not send it or send empty? 
        // Let's assume input is required if they are setting it.
        // But for "not set", they might clear it? 
        // For now, let's stick to the regex if value is present.
        if (duration.trim() === "") return true;

        const pattern = /^(\d+(\.\d*)?(ns|us|µs|ms|s|m|h))+$/;
        return pattern.test(duration);
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setSuccessMessage("");

        // Validate
        if (syncInterval && !validateDuration(syncInterval)) {
            setError(`Invalid Sync Interval format: "${syncInterval}". Example: 2h30m`);
            return;
        }
        if (wakeInterval && !validateDuration(wakeInterval)) {
            setError(`Invalid Wake Interval format: "${wakeInterval}". Example: 1h`);
            return;
        }

        try {
            setIsSaving(true);

            // Save Sync Interval
            if (syncInterval) {
                if (syncIntervalExists) {
                    await configurationsService.update(SYNC_INTERVAL_KEY, syncInterval);
                } else {
                    await configurationsService.create(SYNC_INTERVAL_KEY, syncInterval);
                    setSyncIntervalExists(true);
                }
            }

            // Save Wake Interval
            if (wakeInterval) {
                if (wakeIntervalExists) {
                    await configurationsService.update(WAKE_INTERVAL_KEY, wakeInterval);
                } else {
                    await configurationsService.create(WAKE_INTERVAL_KEY, wakeInterval);
                    setWakeIntervalExists(true);
                }
            }

            setSuccessMessage("Settings saved successfully");
            setTimeout(() => setSuccessMessage(""), 3000);

        } catch (err) {
            console.error("Failed to save configurations", err);
            setError("Failed to save settings");
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading) {
        return (
            <div className="flex h-full items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div>
                <p className="text-muted-foreground">Manage system-wide configurations.</p>
            </div>

            <Card className="max-w-2xl">
                <CardHeader>
                    <CardTitle>System Settings</CardTitle>
                    <CardDescription>
                        Configure core system intervals and behaviors.
                    </CardDescription>
                </CardHeader>
                <form onSubmit={handleSave}>
                    <CardContent className="space-y-6">
                        {/* Worker Wake Interval */}
                        <div className="space-y-2">
                            <label htmlFor="wake-interval" className="text-sm font-medium leading-none">
                                Worker Wake Interval
                            </label>
                            <p className="text-xs text-muted-foreground">
                                Configure the time the system waits before re-running the process that triggers synchronization for all pending projects.
                                Default: 1h.
                            </p>
                            <Input
                                id="wake-interval"
                                placeholder="e.g. 1h"
                                value={wakeInterval}
                                onChange={(e) => setWakeInterval(e.target.value)}
                            />
                        </div>

                        {/* Project Sync Interval */}
                        <div className="space-y-2">
                            <label htmlFor="sync-interval" className="text-sm font-medium leading-none">
                                Project Sync Interval
                            </label>
                            <p className="text-xs text-muted-foreground">
                                Configure the time each project will wait before it is synchronized again. How often checks for updates in source repositories
                                Default: 24h.
                            </p>
                            <Input
                                id="sync-interval"
                                placeholder="e.g. 2h30m40s"
                                value={syncInterval}
                                onChange={(e) => setSyncInterval(e.target.value)}
                            />
                        </div>

                        {/* Common Format Note */}
                        <div className="rounded-md bg-muted p-3">
                            <p className="text-xs text-muted-foreground">
                                <strong>Format:</strong> Go duration string (e.g. &quot;10m&quot;, &quot;1h30m&quot;). Valid units: ns, us, ms, s, m, h.
                            </p>
                        </div>

                        {error && (
                            <p className="text-sm font-medium text-destructive">{error}</p>
                        )}
                        {successMessage && (
                            <p className="text-sm font-medium text-green-600 dark:text-green-500">{successMessage}</p>
                        )}
                    </CardContent>
                    <CardFooter>
                        <Button type="submit" disabled={isSaving}>
                            {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            {isSaving ? "Saving..." : "Save Changes"}
                        </Button>
                    </CardFooter>
                </form>
            </Card>
        </div>
    );
}

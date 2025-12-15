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
    const [syncInterval, setSyncInterval] = useState("");
    const [error, setError] = useState("");
    const [successMessage, setSuccessMessage] = useState("");

    const [configExists, setConfigExists] = useState(false);

    const CONFIG_KEY = "project_sync_interval";

    useEffect(() => {
        loadConfiguration();
    }, []);

    const loadConfiguration = async () => {
        try {
            setIsLoading(true);
            const data = await configurationsService.get(CONFIG_KEY);
            setSyncInterval(data.data.value);
            setConfigExists(true);
        } catch (err) {
            const error = err as AxiosError;
            // If 404, it might not be set yet, leave empty or default
            if (error.response?.status === 404) {
                setConfigExists(false);
            } else {
                console.error("Failed to load configuration", err);
                setError("Failed to load settings");
            }
        } finally {
            setIsLoading(false);
        }
    };

    const validateDuration = (duration: string) => {
        // Go duration regex pattern (simplified)
        // Matches sequences like 2h, 45m, 30s, 2h30m, etc.
        const pattern = /^(\d+(\.\d*)?(ns|us|µs|ms|s|m|h))+$/;
        return pattern.test(duration);
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setSuccessMessage("");

        if (!validateDuration(syncInterval)) {
            setError("Invalid duration format. Example: 2h30m40s");
            return;
        }

        try {
            setIsSaving(true);

            if (configExists) {
                await configurationsService.update(CONFIG_KEY, syncInterval);
            } else {
                await configurationsService.create(CONFIG_KEY, syncInterval);
                setConfigExists(true);
            }

            setSuccessMessage("Settings saved successfully");

            // Clear success message after 3 seconds
            setTimeout(() => {
                setSuccessMessage("");
            }, 3000);
        } catch (err) {
            console.error("Failed to save configuration", err);
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
                    <CardTitle>Project Synchronization</CardTitle>
                    <CardDescription>
                        Configure how often the system checks for updates in source repositories.
                        If not set, a default value of 24h is applied.
                    </CardDescription>
                </CardHeader>
                <form onSubmit={handleSave}>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <label htmlFor="sync-interval" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                Sync Interval
                            </label>
                            <Input
                                id="sync-interval"
                                placeholder="e.g. 2h30m40s"
                                value={syncInterval}
                                onChange={(e) => setSyncInterval(e.target.value)}
                            />
                            <p className="text-xs text-muted-foreground">
                                Format: Duration string (e.g. &quot;10m&quot;, &quot;1h30m&quot;). Valid units: ns, us, ms, s, m, h.
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

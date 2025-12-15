"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { ArrowLeft, RefreshCw, Copy, Check } from "lucide-react";

interface UserFormProps {
    initialData?: {
        id: string;
        name: string;
        email: string;
    };
}

export function UserForm({ initialData }: UserFormProps) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [name, setName] = useState(initialData?.name || "");
    const [email, setEmail] = useState(initialData?.email || "");
    const [password, setPassword] = useState("");
    const [apiKey, setApiKey] = useState("");
    const [copied, setCopied] = useState(false);
    const [error, setError] = useState("");

    const isEditing = !!initialData;

    const generateApiKey = () => {
        // Generate a strong random key (32 chars hex + "sk_")
        const array = new Uint8Array(24);
        window.crypto.getRandomValues(array);
        const randomHex = Array.from(array).map(b => b.toString(16).padStart(2, '0')).join('');
        const newKey = `sk_${randomHex}`;
        setApiKey(newKey);
        setCopied(false);
    };

    const copyToClipboard = () => {
        if (!apiKey) return;
        navigator.clipboard.writeText(apiKey);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            if (isEditing) {
                // Update logic - Assuming PUT /users/{id}
                // Note: Spec didn't explicitly show update endpoint, assuming standard REST.
                const payload: any = { name, email };
                if (password) {
                    payload.password = password;
                }
                if (apiKey) {
                    payload.apiKey = apiKey;
                }
                await api.patch(`/users/${initialData.id}`, payload);
            } else {
                await api.post("/users", { name, email, password, apiKey });
            }
            router.push("/users");
            router.refresh(); // Refresh list
        } catch (err: any) {
            console.error(err);
            setError(err.response?.data?.message || "Something went wrong.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" onClick={() => router.back()}>
                    <ArrowLeft className="h-4 w-4" />
                </Button>
            </div>

            <Card className="max-w-2xl border-primary/10 bg-card/40 backdrop-blur-md">
                <form onSubmit={handleSubmit}>
                    <CardContent className="space-y-4 pt-6">
                        {error && (
                            <div className="rounded-md bg-destructive/15 p-3 text-sm text-destructive">
                                {error}
                            </div>
                        )}
                        <div className="grid gap-2">
                            <label className="text-sm font-medium">Name</label>
                            <Input
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                            />
                        </div>
                        <div className="grid gap-2">
                            <label className="text-sm font-medium">Email</label>
                            <Input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                disabled={isEditing} // Often email is immutable or ID
                            />
                        </div>
                        <div className="grid gap-2">
                            <label className="text-sm font-medium">
                                {isEditing ? "New Password" : "Password"}
                            </label>
                            <Input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required={!isEditing}
                                placeholder={isEditing ? "Leave blank to keep current" : ""}
                            />
                            {isEditing && (
                                <p className="text-xs text-muted-foreground">
                                    Leave blank to keep the current password.
                                </p>
                            )}
                        </div>

                        {/* API Key Configuration */}
                        <div className="grid gap-2">
                            <label className="text-sm font-medium">API Key</label>
                            <div className="flex gap-2">
                                <Input
                                    value={apiKey}
                                    onChange={(e) => setApiKey(e.target.value)}
                                    placeholder={isEditing ? "Hidden (Leave blank to keep current)" : "Generate or enter an API Key"}
                                    type="text"
                                    className="font-mono text-xs"
                                    autoComplete="off"
                                />
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="icon"
                                    onClick={generateApiKey}
                                    title="Generate Strong Key"
                                >
                                    <RefreshCw className="h-4 w-4" />
                                </Button>
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="icon"
                                    onClick={copyToClipboard}
                                    disabled={!apiKey}
                                    title="Copy to Clipboard"
                                >
                                    {copied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                                </Button>
                            </div>
                            <p className="text-xs text-muted-foreground">
                                {apiKey
                                    ? <span className="text-yellow-500 font-medium">Warning: This key will only be visible now. please copy and save it securely. After saving, you won't be able to see it again.</span>
                                    : "Click the generate button to create a new secure API Key."
                                }
                            </p>
                        </div>
                    </CardContent>
                    <CardFooter>
                        <Button type="submit" disabled={loading} className="ml-auto">
                            {loading ? "Saving..." : isEditing ? "Save Changes" : "Create User"}
                        </Button>
                    </CardFooter>
                </form>
            </Card>
        </div>
    );
}

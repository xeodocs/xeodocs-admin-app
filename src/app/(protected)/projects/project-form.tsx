"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import { LanguagesManager } from "./LanguagesManager";

interface ProjectFormProps {
    initialData?: any;
}

export function ProjectForm({ initialData }: ProjectFormProps) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: initialData?.name || "",
        slug: initialData?.slug || "",
        sourceRepoUrl: initialData?.sourceRepoUrl || "",
        sourceWebsiteUrl: initialData?.sourceWebsiteUrl || "",
        sourceBranch: initialData?.sourceBranch || "main",
        description: initialData?.description || "",
        isActive: initialData?.isActive ?? true,
    });
    const [error, setError] = useState("");

    const isEditing = !!initialData;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            if (isEditing) {
                await api.patch(`/projects/${initialData.id}`, formData);
            } else {
                await api.post("/projects", formData);
            }
            router.push("/projects");
            router.refresh();
        } catch (err: any) {
            console.error(err);
            setError(err.response?.data?.message || "Something went wrong.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-8">
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" onClick={() => router.back()}>
                    <ArrowLeft className="h-4 w-4" />
                </Button>
                <h2 className="text-2xl font-bold tracking-tight">
                    {isEditing ? "Edit Project" : "Create Project"}
                </h2>
            </div>

            <div className="grid gap-8 lg:grid-cols-3">
                {/* Main Form */}
                <div className={`space-y-6 ${isEditing ? "lg:col-span-2" : "lg:col-span-3"}`}>
                    <Card className="border-primary/10 bg-card/40 backdrop-blur-md">
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
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <label className="text-sm font-medium">Slug</label>
                                    <Input
                                        name="slug"
                                        value={formData.slug}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <label className="text-sm font-medium">Repository URL</label>
                                    <Input
                                        name="sourceRepoUrl"
                                        value={formData.sourceRepoUrl}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <label className="text-sm font-medium">Website URL</label>
                                    <Input
                                        name="sourceWebsiteUrl"
                                        value={formData.sourceWebsiteUrl}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="grid gap-2">
                                        <label className="text-sm font-medium">Branch</label>
                                        <Input
                                            name="sourceBranch"
                                            value={formData.sourceBranch}
                                            onChange={handleChange}
                                        />
                                    </div>
                                    <div className="grid gap-2">
                                        <label className="text-sm font-medium">Status</label>
                                        <div className="flex items-center h-10">
                                            <label className="flex items-center gap-2 text-sm cursor-pointer">
                                                <input
                                                    type="checkbox"
                                                    checked={formData.isActive}
                                                    onChange={(e) => setFormData(p => ({ ...p, isActive: e.target.checked }))}
                                                    className="h-4 w-4 rounded border-input bg-background text-primary focus:ring-2 focus:ring-ring"
                                                />
                                                Active
                                            </label>
                                        </div>
                                    </div>
                                </div>
                                <div className="grid gap-2">
                                    <label className="text-sm font-medium">Description</label>
                                    <textarea
                                        name="description"
                                        value={formData.description}
                                        onChange={handleChange}
                                        className="flex min-h-[80px] w-full rounded-md border border-input bg-background/50 px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                    />
                                </div>
                            </CardContent>
                            <CardFooter>
                                <Button type="submit" disabled={loading} className="ml-auto">
                                    {loading ? "Saving..." : isEditing ? "Save Changes" : "Create Project"}
                                </Button>
                            </CardFooter>
                        </form>
                    </Card>
                </div>

                {/* Languages Manager (Only visible when editing) */}
                {isEditing && (
                    <div className="lg:col-span-1">
                        <LanguagesManager projectId={initialData.id} />
                    </div>
                )}
            </div>
        </div>
    );
}

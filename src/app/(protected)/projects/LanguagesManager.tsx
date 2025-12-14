"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Trash2, Code } from "lucide-react";

interface Language {
    id: string;
    code: string;
    name: string;
    domain: string;
    isActive: boolean;
}

export function LanguagesManager({ projectId }: { projectId: string }) {
    const [languages, setLanguages] = useState<Language[]>([]);
    const [loading, setLoading] = useState(true);
    const [adding, setAdding] = useState(false);
    const [newLang, setNewLang] = useState({ code: "", name: "", domain: "" });

    const fetchLanguages = async () => {
        try {
            setLoading(true);
            // Assuming GET /languages?projectId={projectId} OR GET /projects/{id}/languages
            // I'll try /languages params first based on common patterns
            const response = await api.get("/languages", { params: { projectId } });
            setLanguages(response.data.data || []);
        } catch (error) {
            console.error("Failed to fetch languages", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchLanguages();
    }, [projectId]);

    const handleAdd = async () => {
        if (!newLang.code || !newLang.name) return;
        try {
            setAdding(true);
            await api.post("/languages", { ...newLang, projectId });
            setNewLang({ code: "", name: "", domain: "" });
            fetchLanguages();
        } catch (error) {
            console.error("Failed to add language", error);
        } finally {
            setAdding(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure?")) return;
        try {
            await api.delete(`/languages/${id}`);
            fetchLanguages();
        } catch (error) {
            console.error("Failed to delete language", error);
        }
    };

    return (
        <Card className="h-full border-primary/10 bg-card/40 backdrop-blur-md">
            <CardHeader>
                <CardTitle className="text-lg">Languages</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                {/* Add New */}
                <div className="space-y-3 rounded-lg border border-border/50 bg-background/30 p-3">
                    <h4 className="text-xs font-semibold uppercase text-muted-foreground">Add Language</h4>
                    <div className="grid gap-2">
                        <Input
                            placeholder="Code (e.g. es)"
                            value={newLang.code}
                            onChange={(e) => setNewLang(p => ({ ...p, code: e.target.value }))}
                        />
                        <Input
                            placeholder="Name (e.g. Spanish)"
                            value={newLang.name}
                            onChange={(e) => setNewLang(p => ({ ...p, name: e.target.value }))}
                        />
                        <Input
                            placeholder="Domain (Optional)"
                            value={newLang.domain}
                            onChange={(e) => setNewLang(p => ({ ...p, domain: e.target.value }))}
                        />
                        <Button size="sm" onClick={handleAdd} disabled={adding}>
                            <Plus className="mr-2 h-3 w-3" /> Add
                        </Button>
                    </div>
                </div>

                {/* List */}
                <div className="space-y-2">
                    <h4 className="text-xs font-semibold uppercase text-muted-foreground">Active Languages</h4>
                    {loading ? (
                        <div className="text-sm text-muted-foreground">Loading...</div>
                    ) : languages.length === 0 ? (
                        <div className="text-sm text-muted-foreground">No languages added.</div>
                    ) : (
                        languages.map(lang => (
                            <div key={lang.id} className="flex items-center justify-between rounded-md border border-border/50 bg-background/20 p-2">
                                <div className="flex flex-col">
                                    <span className="text-sm font-medium">{lang.name}</span>
                                    <span className="flex items-center text-xs text-muted-foreground">
                                        <Code className="mr-1 h-3 w-3" /> {lang.code}
                                    </span>
                                </div>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-6 w-6 text-destructive hover:bg-destructive/10"
                                    onClick={() => handleDelete(lang.id)}
                                >
                                    <Trash2 className="h-3 w-3" />
                                </Button>
                            </div>
                        ))
                    )}
                </div>
            </CardContent>
        </Card>
    );
}

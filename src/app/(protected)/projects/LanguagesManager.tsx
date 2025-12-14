"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Trash2, Code } from "lucide-react";
import { AlertModal } from "@/components/ui/alert-modal";

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

    // Alert Modal State
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [deleteLoading, setDeleteLoading] = useState(false);
    const [languageToDelete, setLanguageToDelete] = useState<Language | null>(null);

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

    const onDeleteClick = (language: Language) => {
        setLanguageToDelete(language);
        setDeleteModalOpen(true);
    };

    const handleConfirmDelete = async () => {
        if (!languageToDelete) return;

        try {
            setDeleteLoading(true);
            await api.delete(`/languages/${languageToDelete.id}`);
            setDeleteModalOpen(false);
            setLanguageToDelete(null);
            fetchLanguages();
        } catch (error: any) {
            console.error("Failed to delete language", error);
        } finally {
            setDeleteLoading(false);
        }
    };

    return (
        <>
            <AlertModal
                isOpen={deleteModalOpen}
                onClose={() => setDeleteModalOpen(false)}
                onConfirm={handleConfirmDelete}
                loading={deleteLoading}
                title="Are you absolutely sure?"
                description={`This action cannot be undone. This will permanently remove the language "${languageToDelete?.name}" from this project.`}
                confirmText="Delete Language"
            />
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
                                onChange={(e) => {
                                    const code = e.target.value;
                                    let name = newLang.name;

                                    // Auto-fill name using Intl.DisplayNames if code seems valid
                                    if (code.length >= 2) {
                                        try {
                                            const detectedName = new Intl.DisplayNames(['en'], { type: 'language' }).of(code);
                                            // Check if it returned a real name (not just the code itself or invalid)
                                            if (detectedName && detectedName.toLowerCase() !== code.toLowerCase()) {
                                                name = detectedName;
                                            }
                                        } catch (err) {
                                            // Ignore errors for partial/invalid codes
                                        }
                                    }

                                    setNewLang(p => ({ ...p, code, name }));
                                }}
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
                                    <div className="flex flex-col gap-0.5">
                                        <div className="flex items-center gap-2">
                                            <span className="text-sm font-medium">{lang.name}</span>
                                            <span className="flex items-center rounded bg-secondary/50 px-1.5 py-0.5 text-[10px] font-mono text-muted-foreground">
                                                {lang.code}
                                            </span>
                                        </div>
                                        {lang.domain && (
                                            <span className="text-xs text-muted-foreground truncate max-w-[280px]" title={lang.domain}>
                                                {lang.domain}
                                            </span>
                                        )}
                                    </div>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-6 w-6 text-destructive hover:bg-destructive/10"
                                        onClick={() => onDeleteClick(lang)}
                                    >
                                        <Trash2 className="h-3 w-3" />
                                    </Button>
                                </div>
                            ))
                        )}
                    </div>
                </CardContent>
            </Card>
        </>
    );
}

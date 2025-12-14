"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Plus, Search, Edit2, Trash2, ExternalLink } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";

import { AlertModal } from "@/components/ui/alert-modal";

interface Project {
    id: string;
    name: string;
    slug: string;
    sourceRepoUrl: string;
    isActive: boolean;
    updatedAt: string;
}

export default function ProjectsPage() {
    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const router = useRouter();

    // Alert Modal State
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [deleteLoading, setDeleteLoading] = useState(false);
    const [projectToDelete, setProjectToDelete] = useState<Project | null>(null);

    const fetchProjects = async () => {
        try {
            setLoading(true);
            const response = await api.get("/projects", {
                params: { search },
            });
            setProjects(response.data.data);
        } catch (error) {
            console.error("Failed to fetch projects", error);
        } finally {
            setLoading(false);
        }
    };

    const onDeleteClick = (project: Project) => {
        setProjectToDelete(project);
        setDeleteModalOpen(true);
    };

    const handleConfirmDelete = async () => {
        if (!projectToDelete) return;

        try {
            setDeleteLoading(true);
            await api.delete(`/projects/${projectToDelete.id}`);
            setDeleteModalOpen(false);
            setProjectToDelete(null);
            fetchProjects();
        } catch (error: any) {
            console.error("Failed to delete project", error);
            alert(error.response?.data?.message || "Failed to delete project.");
        } finally {
            setDeleteLoading(false);
        }
    };

    useEffect(() => {
        const delayDebounce = setTimeout(() => {
            fetchProjects();
        }, 500);

        return () => clearTimeout(delayDebounce);
    }, [search]);

    return (
        <div className="space-y-6">
            <AlertModal
                isOpen={deleteModalOpen}
                onClose={() => setDeleteModalOpen(false)}
                onConfirm={handleConfirmDelete}
                loading={deleteLoading}
                title="Are you absolutely sure?"
                description={`This action cannot be undone. This will permanently delete the project "${projectToDelete?.name}" and remove all its data from our servers.`}
                confirmText="Delete Project"
            />

            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold tracking-tight">Projects</h2>
                <Button onClick={() => router.push("/projects/new")} className="gap-2">
                    <Plus className="h-4 w-4" /> New Project
                </Button>
            </div>

            <div className="flex items-center gap-4">
                <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search projects..."
                        className="pl-9"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
            </div>

            <div className="rounded-md border border-border/50">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Name</TableHead>
                            <TableHead>Slug</TableHead>
                            <TableHead>Repository</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="w-[100px]">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {loading ? (
                            <TableRow>
                                <TableCell colSpan={5} className="text-center h-24">
                                    Loading...
                                </TableCell>
                            </TableRow>
                        ) : projects.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={5} className="text-center h-24 text-muted-foreground">
                                    No projects found.
                                </TableCell>
                            </TableRow>
                        ) : (
                            projects.map((project) => (
                                <TableRow key={project.id}>
                                    <TableCell className="font-medium">{project.name}</TableCell>
                                    <TableCell className="font-mono text-xs">{project.slug}</TableCell>
                                    <TableCell>
                                        <a
                                            href={project.sourceRepoUrl}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="flex items-center gap-1 text-primary hover:underline"
                                        >
                                            Repo <ExternalLink className="h-3 w-3" />
                                        </a>
                                    </TableCell>
                                    <TableCell>
                                        <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${project.isActive
                                            ? "bg-green-500/10 text-green-500 cursor-default"
                                            : "bg-red-500/10 text-red-500"
                                            }`}>
                                            {project.isActive ? "Active" : "Inactive"}
                                        </span>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => router.push(`/projects/edit?id=${project.id}`)}
                                            >
                                                <Edit2 className="h-4 w-4" />
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="text-destructive hover:text-destructive"
                                                onClick={() => onDeleteClick(project)}
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}

"use client";

import { useEffect, useState } from "react";
import { ProjectForm } from "../project-form";
import { api } from "@/lib/api";
import { useSearchParams } from "next/navigation";

export default function EditProjectClientPage() {
    const searchParams = useSearchParams();
    const id = searchParams.get("id");
    const [project, setProject] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProject = async () => {
            try {
                const response = await api.get(`/projects/${id}`);
                setProject(response.data.data || response.data);
            } catch (error) {
                console.error("Failed to fetch project", error);
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchProject();
        }
    }, [id]);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (!project) {
        return <div>Project not found</div>;
    }

    return <ProjectForm initialData={project} />;
}

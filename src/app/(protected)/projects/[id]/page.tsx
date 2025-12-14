"use client";

import { useEffect, useState } from "react";
import { ProjectForm } from "../project-form";
import { api } from "@/lib/api";
import { useParams } from "next/navigation";

export default function EditProjectPage() {
    const params = useParams();
    const [project, setProject] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProject = async () => {
            try {
                const response = await api.get(`/projects/${params.id}`);
                setProject(response.data.data || response.data);
            } catch (error) {
                console.error("Failed to fetch project", error);
            } finally {
                setLoading(false);
            }
        };

        if (params.id) {
            fetchProject();
        }
    }, [params.id]);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (!project) {
        return <div>Project not found</div>;
    }

    return <ProjectForm initialData={project} />;
}

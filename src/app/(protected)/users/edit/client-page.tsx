"use client";

import { useEffect, useState } from "react";
import { UserForm } from "../user-form";
import { api } from "@/lib/api";
import { useSearchParams } from "next/navigation";

export default function EditUserClientPage() {
    const searchParams = useSearchParams();
    const id = searchParams.get("id");
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                // Assuming GET /users/{id}
                // If not available, we might need to filter from list
                const response = await api.get(`/users/${id}`);
                // Response format? Assuming { data: User }
                setUser(response.data.data || response.data);
            } catch (error) {
                console.error("Failed to fetch user", error);
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchUser();
        }
    }, [id]);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (!user) {
        return <div>User not found</div>;
    }

    return <UserForm initialData={user} />;
}

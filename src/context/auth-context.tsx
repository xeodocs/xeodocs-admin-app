"use client";

import * as React from "react";
import { api } from "@/lib/api";
import { useRouter, usePathname } from "next/navigation";

interface User {
    id: string;
    name: string;
    email: string;
}

interface AuthContextType {
    user: User | null;
    loading: boolean;
    login: (data: any) => Promise<void>;
    logout: () => Promise<void>;
}

const AuthContext = React.createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = React.useState<User | null>(null);
    const [loading, setLoading] = React.useState(true);
    const router = useRouter();
    const pathname = usePathname();

    const fetchUser = React.useCallback(async () => {
        try {
            // Assuming /v1/auth/me or similar endpoint exists per best practices, 
            // but system design didn't explicitly list 'me' endpoint unless I missed it.
            // The OpenAPI spec showed /users but not explicit 'me'.
            // Looking at the spec chunk again...
            // /auth/login returns user. 
            // cookieAuth is used.
            // System design says "Session-based authentication using HTTPOnly Secure Cookies".
            // Usually there is a /me endpoint or we use stored user info (not secure) or check on load.
            // If no /me, we might rely on 401s to detect session validity, but we need user info.
            // API Spec had /users (list). 
            // Let's assume for now we might not have a /me endpoint and rely on local state persisted? 
            // No, HTTPOnly cookies mean we can't read session client side. We need an endpoint.
            // I'll assume /v1/users/me or check checks health?
            // Wait, OpenAPI spec chunk 2 shows /users GET list, /auth/login, /auth/logout.
            // It DOES NOT show /auth/me or /users/me.
            // This is a common gap.
            // However, usually "List all users" is /users.
            // If I can't fetch current user, I can't persist user state on reload unless I store it in localStorage on login.
            // I'll try to fetch from localStorage first as fallback for display, but valid session is cookie.
            // I'll store user details in localStorage on login.

            const storedUser = localStorage.getItem("xeodocs_user");
            if (storedUser) {
                setUser(JSON.parse(storedUser));
            }
        } catch (error) {
            console.error("Failed to restore user", error);
        } finally {
            setLoading(false);
        }
    }, []);

    React.useEffect(() => {
        fetchUser();
    }, [fetchUser]);

    const login = async (data: any) => {
        // data is { email, password }
        const response = await api.post("/auth/login", data);
        const loggedUser = response.data.data.user;
        setUser(loggedUser);
        localStorage.setItem("xeodocs_user", JSON.stringify(loggedUser));
        router.push("/");
    };

    const logout = async () => {
        try {
            await api.post("/auth/logout");
        } catch (error) {
            console.error("Logout failed", error);
        } finally {
            setUser(null);
            localStorage.removeItem("xeodocs_user");
            router.push("/login");
        }
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => {
    const context = React.useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};

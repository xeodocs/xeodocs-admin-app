"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils"; // Wait, I need to create utils if not exists, but card.tsx used cn function inline or imported?
// Card.tsx defined its own cn. I should create lib/utils.ts for optimization.
// But I will inline for now or better create lib/utils.ts first if missing.
// The instructions "Create Components" said "Build necessary components using your design system".
// I'll assume I should create lib/utils.ts.
import { Users, FolderKanban, LayoutDashboard, LogOut, Settings } from "lucide-react";
import { useAuth } from "@/context/auth-context";
import { Button } from "@/components/ui/button";

export function AppSidebar() {
    const pathname = usePathname();
    const { logout, user } = useAuth();

    const links = [
        { href: "/", label: "Dashboard", icon: LayoutDashboard },
        { href: "/users", label: "Users", icon: Users },
        { href: "/projects", label: "Projects", icon: FolderKanban },
    ];

    return (
        <aside className="fixed left-0 top-0 h-screen w-64 border-r border-border bg-background/30 backdrop-blur-xl">
            <div className="flex h-full flex-col">
                {/* Logo */}
                <div className="flex h-16 items-center border-b border-border px-6">
                    <span className="text-xl font-bold tracking-wider text-primary drop-shadow-[0_0_10px_rgba(6,182,212,0.5)]">
                        XEODOCS
                    </span>
                </div>

                {/* Navigation */}
                <nav className="flex-1 space-y-2 p-4">
                    {links.map((link) => {
                        const Icon = link.icon;
                        const isActive = pathname === link.href || (link.href !== "/" && pathname.startsWith(link.href));

                        return (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={cn(
                                    "group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all hover:bg-white/5",
                                    isActive
                                        ? "bg-primary/10 text-primary shadow-[0_0_20px_rgba(6,182,212,0.15)]"
                                        : "text-muted-foreground hover:text-primary"
                                )}
                            >
                                <Icon className={cn("h-5 w-5", isActive ? "text-primary" : "text-muted-foreground group-hover:text-primary")} />
                                {link.label}
                            </Link>
                        );
                    })}
                </nav>

                {/* User Profile */}
                <div className="border-t border-border p-4">
                    <div className="mb-4 flex items-center gap-3 rounded-lg bg-background/50 p-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/20 text-primary">
                            {user?.name?.charAt(0) || "A"}
                        </div>
                        <div className="flex-1 overflow-hidden">
                            <p className="truncate text-sm font-medium text-foreground">{user?.name}</p>
                            <p className="truncate text-xs text-muted-foreground">{user?.email}</p>
                        </div>
                    </div>
                    <Button variant="outline" className="w-full justify-start gap-2 border-dashed border-destructive/50 text-destructive hover:bg-destructive/10" onClick={logout}>
                        <LogOut className="h-4 w-4" />
                        Sign Out
                    </Button>
                </div>
            </div>
        </aside>
    );
}

// Inline utils since I haven't checked if lib/utils exists yet.
// Actually I should have created specific utils file.
// I'll create lib/utils.ts right now as well.

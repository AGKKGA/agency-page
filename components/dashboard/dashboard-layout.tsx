"use client";

import { ReactNode } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
    LayoutDashboard,
    FileText,
    User,
    MessageSquare,
    LogOut,
    Menu,
    X
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface DashboardLayoutProps {
    children: ReactNode;
    user: {
        name: string;
        email: string;
        avatar?: string;
    };
}

const navigation = [
    { name: "Overview", href: "/dashboard", icon: LayoutDashboard },
    { name: "Documents", href: "/dashboard/documents", icon: FileText },
    { name: "Profile", href: "/dashboard/profile", icon: User },
    { name: "Messages", href: "/dashboard/messages", icon: MessageSquare },
];

export function DashboardLayout({ children, user }: DashboardLayoutProps) {
    const pathname = usePathname();
    const router = useRouter();
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const handleLogout = async () => {
        await fetch("/api/auth/logout", { method: "POST" });
        router.push("/login");
    };

    const getInitials = (name: string) => {
        return name
            .split(" ")
            .map((n) => n[0])
            .join("")
            .toUpperCase()
            .slice(0, 2);
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            {/* Mobile sidebar backdrop */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside
                className={cn(
                    "fixed top-0 left-0 z-50 h-full w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transition-transform duration-300 ease-in-out lg:translate-x-0",
                    sidebarOpen ? "translate-x-0" : "-translate-x-full"
                )}
            >
                <div className="flex flex-col h-full">
                    {/* Logo */}
                    <div className="flex items-center justify-between p-6">
                        <h1 className="text-xl font-bold">Student Portal</h1>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="lg:hidden"
                            onClick={() => setSidebarOpen(false)}
                        >
                            <X className="h-5 w-5" />
                        </Button>
                    </div>

                    <Separator />

                    {/* Navigation */}
                    <nav className="flex-1 p-4 space-y-2">
                        {navigation.map((item) => {
                            const isActive = pathname === item.href;
                            return (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    onClick={() => setSidebarOpen(false)}
                                    className={cn(
                                        "flex items-center gap-3 px-4 py-3 rounded-lg transition-colors",
                                        isActive
                                            ? "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 font-medium"
                                            : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                                    )}
                                >
                                    <item.icon className="h-5 w-5" />
                                    {item.name}
                                </Link>
                            );
                        })}
                    </nav>

                    <Separator />

                    {/* User section */}
                    <div className="p-4">
                        <div className="flex items-center gap-3 mb-3">
                            <Avatar>
                                <AvatarImage src={user.avatar} alt={user.name} />
                                <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
                            </Avatar>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium truncate">{user.name}</p>
                                <p className="text-xs text-muted-foreground truncate">
                                    {user.email}
                                </p>
                            </div>
                        </div>
                        <Button
                            variant="outline"
                            className="w-full"
                            onClick={handleLogout}
                        >
                            <LogOut className="mr-2 h-4 w-4" />
                            Logout
                        </Button>
                    </div>
                </div>
            </aside>

            {/* Main content */}
            <div className="lg:pl-64">
                {/* Mobile header */}
                <header className="sticky top-0 z-30 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 lg:hidden">
                    <div className="flex items-center justify-between p-4">
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setSidebarOpen(true)}
                        >
                            <Menu className="h-5 w-5" />
                        </Button>
                        <h1 className="text-lg font-semibold">Student Portal</h1>
                        <div className="w-10" /> {/* Spacer */}
                    </div>
                </header>

                {/* Page content */}
                <main className="p-6 lg:p-8">{children}</main>
            </div>
        </div>
    );
}

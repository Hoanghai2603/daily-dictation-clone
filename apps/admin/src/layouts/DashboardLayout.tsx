import React from 'react';
import { LayoutDashboard, BookOpen, Users, Settings, LogOut } from 'lucide-react';
import { NavLink, Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { cn } from '../lib/utils';
import { Button } from '../components/ui/button';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const SidebarItem = ({ to, icon: Icon, children }: { to: string; icon: any; children: React.ReactNode }) => (
    <NavLink
        to={to}
        className={({ isActive }) =>
            cn(
                "flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors font-medium",
                isActive
                    ? 'bg-primary/15 text-primary'
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground'
            )
        }
    >
        <Icon size={20} />
        <span>{children}</span>
    </NavLink>
);

export const DashboardLayout = () => {
    const { signOut } = useAuth();

    return (
        <div className="flex h-screen bg-background text-foreground">
            {/* Sidebar */}
            <aside className="w-64 bg-card border-r border-border flex flex-col fixed h-full inset-y-0 left-0 z-10 transition-transform duration-300 ease-in-out md:translate-x-0 md:relative">
                <div className="p-6 border-b border-border">
                    <h1 className="text-xl font-bold tracking-wider flex items-center space-x-2">
                        <span className="text-primary">Daily</span>
                        <span className="text-foreground">Dictation</span>
                    </h1>
                </div>

                <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
                    <SidebarItem to="/" icon={LayoutDashboard}>Dashboard</SidebarItem>
                    <SidebarItem to="/topics" icon={BookOpen}>Topics</SidebarItem>
                    <SidebarItem to="/exercises" icon={BookOpen}>Exercises</SidebarItem>
                    <SidebarItem to="/users" icon={Users}>Users</SidebarItem>
                    <SidebarItem to="/settings" icon={Settings}>Settings</SidebarItem>
                </nav>

                <div className="p-4 border-t border-border">
                    <Button
                        variant="ghost"
                        onClick={() => signOut()}
                        className="w-full justify-start text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                    >
                        <LogOut size={20} className="mr-3" />
                        Sign Out
                    </Button>
                </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col min-w-0 overflow-hidden bg-background">
                <header className="bg-card/50 backdrop-blur-sm border-b border-border z-10 sticky top-0">
                    <div className="px-6 py-4 flex items-center justify-between">
                        <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Admin Console</h2>
                        <div className="flex items-center space-x-4">
                            <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold border border-primary/30">
                                A
                            </div>
                        </div>
                    </div>
                </header>

                <main className="flex-1 overflow-auto p-6 md:p-8">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';

export const DashboardPage = () => {
    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-6 text-center animate-in fade-in duration-700">
            <h1 className="text-4xl font-extrabold tracking-tight text-foreground lg:text-5xl">
                Welcome to Daily Dictation Admin
            </h1>
            <p className="text-xl text-muted-foreground max-w-[600px]">
                Manage your topics, exercises, and track user progress from this central dashboard.
            </p>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mt-8 w-full max-w-4xl px-4">
                <Card className="hover:bg-accent transition-colors cursor-pointer border-l-4 border-l-primary">
                    <CardHeader>
                        <CardTitle className="text-lg">Manage Topics</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm text-muted-foreground">currrently available topics and their difficulty levels.</p>
                    </CardContent>
                </Card>

                <Card className="hover:bg-accent transition-colors cursor-pointer border-l-4 border-l-blue-500">
                    <CardHeader>
                        <CardTitle className="text-lg">Manage Exercises</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm text-muted-foreground">Create, edit, and publish dictation exercises.</p>
                    </CardContent>
                </Card>

                <Card className="hover:bg-muted transition-colors opacity-70 border-l-4 border-l-gray-300">
                    <CardHeader>
                        <CardTitle className="text-lg">User Analytics</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm text-muted-foreground">View user engagement and progress (Coming Soon).</p>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

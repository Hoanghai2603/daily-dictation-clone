import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { userService, type UserProfile } from '@/services/userService';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2, ArrowLeft, Ban, CheckCircle } from 'lucide-react';

// Assuming we have basic UI components. If not (since this is new page), might need to use simple HTML or install.
// I'll assume Badge, Card etc are available or will be replaced with standard HTML if failing.

import { useRef } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Pencil } from 'lucide-react';

const editUserSchema = z.object({
    full_name: z.string().min(1, 'Name is required'),
    phone: z.string().optional(),
    // email: z.string().email().optional(), // Email update is tricky with auth, let's stick to profile fields
});

type EditUserFormValues = z.infer<typeof editUserSchema>;

export function UserDetailPage() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [user, setUser] = useState<UserProfile | null>(null);
    const [progress, setProgress] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);

    const { register, handleSubmit, reset, formState: { errors } } = useForm<EditUserFormValues>({
        resolver: zodResolver(editUserSchema),
    });

    useEffect(() => {
        if (!id) return;
        loadUser();
    }, [id]);

    useEffect(() => {
        if (user) {
            reset({
                full_name: user.full_name || '',
                phone: user.phone || '',
            });
        }
    }, [user, reset]);

    const loadUser = async () => {
        setLoading(true);
        try {
            const { profile, progress } = await userService.getUser(id!);
            setUser(profile);
            setProgress(progress || []);
        } catch (error) {
            console.error('Failed to load user', error);
        } finally {
            setLoading(false);
        }
    };

    const toggleBan = async () => {
        if (!user) return;
        if (!confirm(`Are you sure you want to ${user.is_banned ? 'unban' : 'ban'} this user?`)) return;

        setActionLoading(true);
        try {
            if (user.is_banned) {
                await userService.unbanUser(user.id);
            } else {
                await userService.banUser(user.id);
            }
            await loadUser(); // Reload to get updated status
        } catch (error) {
            console.error('Failed to update ban status', error);
            alert('Failed to update status');
        } finally {
            setActionLoading(false);
        }
    };

    const onEditSubmit = async (data: EditUserFormValues) => {
        if (!user) return;
        setActionLoading(true);
        try {
            await userService.updateUser(user.id, data);
            setIsEditOpen(false);
            await loadUser();
        } catch (error) {
            console.error('Failed to update user', error);
            alert('Failed to update user');
        } finally {
            setActionLoading(false);
        }
    };

    if (loading) {
        return <div className="flex justify-center p-10"><Loader2 className="animate-spin" /></div>;
    }

    if (!user) {
        return <div>User not found</div>;
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" onClick={() => navigate('/users')}>
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                    <h1 className="text-2xl font-bold tracking-tight">User Details</h1>
                    {user.is_banned ? <Badge variant="destructive" className="ml-2">Banned</Badge> : <Badge variant="secondary" className="ml-2">Active</Badge>}
                </div>

                <div className="flex gap-2">
                    <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
                        <DialogTrigger asChild>
                            <Button variant="outline">
                                <Pencil className="mr-2 h-4 w-4" />
                                Edit Profile
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Edit User Profile</DialogTitle>
                                <DialogDescription>
                                    Update user's personal information.
                                </DialogDescription>
                            </DialogHeader>
                            <form onSubmit={handleSubmit(onEditSubmit)}>
                                <div className="grid gap-4 py-4">
                                    <div className="grid gap-2">
                                        <Label htmlFor="full_name">Full Name</Label>
                                        <Input id="full_name" {...register('full_name')} />
                                        {errors.full_name && <span className="text-red-500 text-sm">{errors.full_name.message}</span>}
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="phone">Phone</Label>
                                        <Input id="phone" {...register('phone')} />
                                        {errors.phone && <span className="text-red-500 text-sm">{errors.phone.message}</span>}
                                    </div>
                                </div>
                                <DialogFooter>
                                    <Button type="button" variant="outline" onClick={() => setIsEditOpen(false)}>Cancel</Button>
                                    <Button type="submit" disabled={actionLoading}>
                                        {actionLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                        Save Changes
                                    </Button>
                                </DialogFooter>
                            </form>
                        </DialogContent>
                    </Dialog>

                    <Button
                        variant={user.is_banned ? "default" : "destructive"}
                        onClick={toggleBan}
                        disabled={actionLoading}
                    >
                        {actionLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : (user.is_banned ? <CheckCircle className="mr-2 h-4 w-4" /> : <Ban className="mr-2 h-4 w-4" />)}
                        {user.is_banned ? "Unban User" : "Ban User"}
                    </Button>
                </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle>Profile Information</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-3 gap-4">
                            <div className="font-semibold">ID</div>
                            <div className="col-span-2 text-muted-foreground text-xs font-mono">{user.id}</div>

                            <div className="font-semibold">Email</div>
                            <div className="col-span-2">{user.email || "N/A"}</div>

                            <div className="font-semibold">Name</div>
                            <div className="col-span-2">{user.full_name || "N/A"}</div>

                            <div className="font-semibold">Phone</div>
                            <div className="col-span-2">{user.phone || "N/A"}</div>

                            <div className="font-semibold">Joined</div>
                            <div className="col-span-2">{new Date(user.created_at).toLocaleString()}</div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Statistics</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="p-4 bg-muted rounded-lg text-center">
                                <div className="text-2xl font-bold">{progress.length}</div>
                                <div className="text-xs text-muted-foreground uppercase mt-1">Exercises Started</div>
                            </div>
                            <div className="p-4 bg-muted rounded-lg text-center">
                                <div className="text-2xl font-bold">{progress.filter(p => p.status === 'completed').length}</div>
                                <div className="text-xs text-muted-foreground uppercase mt-1">Completed</div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Learning Progress</CardTitle>
                    <CardDescription>Recent activity logging</CardDescription>
                </CardHeader>
                <CardContent>
                    {progress.length === 0 ? (
                        <div className="text-center py-6 text-muted-foreground">No activity recorded.</div>
                    ) : (
                        <div className="space-y-2">
                            {progress.map((p, i) => (
                                <div key={i} className="flex justify-between items-center p-2 border-b last:border-0 hover:bg-muted/50 rounded-sm">
                                    <div>
                                        <div className="font-medium">{p.exercises?.title || "Unknown Exercise"}</div>
                                        <div className="text-xs text-muted-foreground">{new Date(p.last_accessed).toLocaleDateString()}</div>
                                    </div>
                                    <div className="text-right">
                                        <Badge variant={p.status === 'completed' ? 'default' : 'secondary'}>{p.status}</Badge>
                                        <div className="text-xs mt-1">{Math.round(p.percentage || 0)}%</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}

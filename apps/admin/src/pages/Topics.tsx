import { Edit, Plus, Trash2 } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../components/ui/dialog';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';
import { Textarea } from '../components/ui/textarea';
import { topicService, type Topic } from '../services/topic.service';

export const Topics = () => {
    const [topics, setTopics] = useState<Topic[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingTopic, setEditingTopic] = useState<Topic | null>(null);
    const [formData, setFormData] = useState<Partial<Topic>>({
        title: '',
        slug: '',
        description: '',
        level: 'Easy',
        thumbnail_url: ''
    });

    const fetchTopics = async () => {
        setLoading(true);
        try {
            const data = await topicService.getAll();
            if (data) setTopics(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        // BaseService handles deduplication, so standard useEffect is safe
        fetchTopics();
    }, []);

    const handleOpenModal = (topic?: Topic) => {
        if (topic) {
            setEditingTopic(topic);
            setFormData(topic);
        } else {
            setEditingTopic(null);
            setFormData({ title: '', slug: '', description: '', level: 'Easy', thumbnail_url: '' });
        }
        setIsModalOpen(true);
    };

    const handleSave = async (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        try {
            if (editingTopic) {
                await topicService.update(editingTopic.id, formData);
            } else {
                await topicService.create(formData);
            }
            setIsModalOpen(false);
            fetchTopics();
        } catch (error) {
            alert('Error saving topic: ' + (error as Error).message);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this topic?')) return;
        try {
            await topicService.deleteTopic(id);
            fetchTopics();
        } catch {
            alert('Error deleting topic');
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold tracking-tight text-foreground">Topics</h1>
                <Button onClick={() => handleOpenModal()}>
                    <Plus className="mr-2 h-4 w-4" /> New Topic
                </Button>
            </div>

            <Card>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Title</TableHead>
                                <TableHead>Slug</TableHead>
                                <TableHead>Level</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {loading ? (
                                <TableRow><TableCell colSpan={4} className="text-center h-24 text-muted-foreground">Loading...</TableCell></TableRow>
                            ) : topics.length === 0 ? (
                                <TableRow><TableCell colSpan={4} className="text-center h-24 text-muted-foreground">No topics found</TableCell></TableRow>
                            ) : (
                                topics.map(topic => (
                                    <TableRow key={topic.id}>
                                        <TableCell className="font-medium text-foreground">{topic.title}</TableCell>
                                        <TableCell className="text-muted-foreground">{topic.slug}</TableCell>
                                        <TableCell>
                                            <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80">
                                                {topic.level}
                                            </span>
                                        </TableCell>
                                        <TableCell className="text-right space-x-2">
                                            <Button variant="ghost" size="icon" onClick={() => handleOpenModal(topic)}>
                                                <Edit className="h-4 w-4 text-muted-foreground hover:text-primary" />
                                            </Button>
                                            <Button variant="ghost" size="icon" onClick={() => handleDelete(topic.id)}>
                                                <Trash2 className="h-4 w-4 text-muted-foreground hover:text-destructive" />
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{editingTopic ? 'Edit Topic' : 'New Topic'}</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleSave} className="space-y-4 mt-4">
                        <div className="space-y-2">
                            <Label>Title</Label>
                            <Input
                                required
                                value={formData.title}
                                onChange={e => setFormData({ ...formData, title: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Slug</Label>
                            <Input
                                required
                                value={formData.slug}
                                onChange={e => setFormData({ ...formData, slug: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Description</Label>
                            <Textarea
                                rows={3}
                                value={formData.description}
                                onChange={e => setFormData({ ...formData, description: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Level</Label>
                            <Select
                                value={formData.level}
                                onValueChange={(val) => setFormData({ ...formData, level: val })}
                            >
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Easy">Easy</SelectItem>
                                    <SelectItem value="Easy/Intermediate">Easy/Intermediate</SelectItem>
                                    <SelectItem value="Medium">Medium</SelectItem>
                                    <SelectItem value="Intermediate/Advanced">Intermediate/Advanced</SelectItem>
                                    <SelectItem value="Advanced">Advanced</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <Button type="submit" className="w-full">
                            {editingTopic ? 'Save Changes' : 'Create Topic'}
                        </Button>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    );
};

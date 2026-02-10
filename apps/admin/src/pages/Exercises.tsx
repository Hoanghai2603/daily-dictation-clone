import { Download, Edit, Eye, Plus, Trash2 } from 'lucide-react';
import React, { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';

import { fetchYoutubeTranscript, type TranscriptSegment } from '@/lib/youtube';
import { exerciseService, type Exercise } from '@/services/exercise.service';
import { topicService, type Topic } from '@/services/topic.service';

const formSchema = z.object({
    title: z.string().min(3, { message: "Title must be at least 3 characters." }),
    youtube_id: z.string().min(1, { message: "YouTube ID or URL is required." }),
    topic_id: z.string().min(1, { message: "Please select a topic." }),
    difficulty: z.enum(['Easy', 'Medium', 'Hard']),
    is_published: z.boolean(),
    transcripts: z.custom<TranscriptSegment[]>()
});

type FormValues = z.infer<typeof formSchema>;

const extractYouTubeId = (url: string) => {
    if (!url) return '';
    if (url.length === 11) return url;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : '';
};

export const ExercisesPage = () => {
    const navigate = useNavigate();
    const [exercises, setExercises] = useState<Exercise[]>([]);
    const [topics, setTopics] = useState<Topic[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedTopicId, setSelectedTopicId] = useState<string>('all');

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);

    const [isFetchingCaptions, setIsFetchingCaptions] = useState(false);
    const [previewCaptions, setPreviewCaptions] = useState<TranscriptSegment[]>([]);
    const [lastFetchedId, setLastFetchedId] = useState<string>('');

    // Form definition
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: '',
            youtube_id: '',
            topic_id: '',
            difficulty: 'Easy',
            is_published: false,
            transcripts: []
        }
    });

    const watchedYoutubeId = form.watch("youtube_id");

    const fetchTopics = useCallback(async () => {
        try {
            const data = await topicService.getAll();
            if (data) setTopics(data);
        } catch (error) {
            console.error('Failed to fetch topics', error);
        }
    }, []);

    const fetchExercises = useCallback(async () => {
        setLoading(true);
        try {
            const filters = (selectedTopicId && selectedTopicId !== 'all') ? { topic_id: selectedTopicId } : {};
            const data = await exerciseService.getAll(filters);
            if (data) setExercises(data);
        } catch (error) {
            console.error('Failed to fetch exercises', error);
        } finally {
            setLoading(false);
        }
    }, [selectedTopicId]);

    useEffect(() => {
        fetchTopics();
    }, [fetchTopics]);

    useEffect(() => {
        fetchExercises();
    }, [fetchExercises]);




    const handleOpenModal = (exercise?: Exercise) => {
        if (exercise) {
            setEditingId(exercise.id);
            form.reset({
                title: exercise.title,
                youtube_id: exercise.youtube_id,
                topic_id: exercise.topic_id,
                difficulty: exercise.difficulty as 'Easy' | 'Medium' | 'Hard',
                is_published: exercise.is_published,
                transcripts: exercise.transcripts || []
            });
            setPreviewCaptions(exercise.transcripts || []);
            setLastFetchedId(exercise.youtube_id || '');
        } else {
            setEditingId(null);
            form.reset({
                title: '',
                youtube_id: '',
                topic_id: selectedTopicId !== 'all' ? selectedTopicId : '',
                difficulty: 'Easy',
                is_published: false,
                transcripts: []
            });
            setPreviewCaptions([]);
            setLastFetchedId('');
        }
        setIsModalOpen(true);
    };

    const fetchCaptionsForId = useCallback(async (videoId: string, isAuto: boolean = false) => {
        setIsFetchingCaptions(true);
        try {
            const segments = await fetchYoutubeTranscript(videoId);
            setPreviewCaptions(segments);
            form.setValue('transcripts', segments);
            setLastFetchedId(videoId);
        } catch (error) {
            console.error('Fetch error:', error);
            if (!isAuto) {
                alert('Failed to fetch captions. Please check the ID or try again.');
            }
        } finally {
            setIsFetchingCaptions(false);
        }
    }, [form]);

    const handleManualFetch = async (e: React.MouseEvent) => {
        e.preventDefault();
        const videoId = extractYouTubeId(watchedYoutubeId);
        if (!videoId) {
            form.setError("youtube_id", { message: "Please enter a valid YouTube URL or ID" });
            return;
        }
        await fetchCaptionsForId(videoId, false);
    };

    // Auto-fetch effect
    useEffect(() => {
        if (!isModalOpen) return;
        const currentId = extractYouTubeId(watchedYoutubeId || '');
        if (currentId && currentId.length === 11 && currentId !== lastFetchedId && !isFetchingCaptions) {
            const timeoutId = setTimeout(() => {
                fetchCaptionsForId(currentId, true);
            }, 500);
            return () => clearTimeout(timeoutId);
        }
    }, [watchedYoutubeId, isModalOpen, lastFetchedId, isFetchingCaptions, fetchCaptionsForId]);

    const onSubmit = async (values: FormValues) => {
        try {
            const cleanData = {
                ...values,
                youtube_id: extractYouTubeId(values.youtube_id),
                transcripts: previewCaptions
            };

            if (editingId) {
                await exerciseService.update(editingId, cleanData);
            } else {
                await exerciseService.create(cleanData);
            }
            setIsModalOpen(false);
            fetchExercises();
        } catch (error) {
            console.error('Save error:', error);
            alert('Error saving exercise');
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this exercise?')) return;
        try {
            await exerciseService.deleteExercise(id);
            fetchExercises();
        } catch {
            alert('Error deleting exercise');
        }
    };

    return (
        <div className="space-y-6 p-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <h1 className="text-3xl font-bold tracking-tight text-foreground">Exercises</h1>

                <div className="flex items-center gap-4 w-full md:w-auto">
                    <div className="w-[200px]">
                        <Select value={selectedTopicId} onValueChange={setSelectedTopicId}>
                            <SelectTrigger>
                                <SelectValue placeholder="All Topics" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Topics</SelectItem>
                                {topics.map(t => <SelectItem key={t.id} value={t.id}>{t.title}</SelectItem>)}
                            </SelectContent>
                        </Select>
                    </div>

                    <Button onClick={() => handleOpenModal()}>
                        <Plus className="h-4 w-4" /> New Exercise
                    </Button>
                </div>
            </div>

            <Card className="border-border bg-card">
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow className="hover:bg-muted/50 border-border">
                                <TableHead className="text-muted-foreground">Title</TableHead>
                                <TableHead className="text-muted-foreground">Topic</TableHead>
                                <TableHead className="text-muted-foreground">Difficulty</TableHead>
                                <TableHead className="text-muted-foreground">Status</TableHead>
                                <TableHead className="text-right text-muted-foreground">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {loading ? (
                                <TableRow><TableCell colSpan={5} className="text-center h-24 text-muted-foreground">Loading...</TableCell></TableRow>
                            ) : exercises.length === 0 ? (
                                <TableRow><TableCell colSpan={5} className="text-center h-24 text-muted-foreground">No exercises found</TableCell></TableRow>
                            ) : (
                                exercises.map(ex => (
                                    <TableRow key={ex.id} className="hover:bg-muted/50 border-border">
                                        <TableCell className="font-medium text-foreground">
                                            {ex.title}
                                            <div className="text-xs mt-1 text-muted-foreground font-normal">{ex.youtube_id}</div>
                                        </TableCell>
                                        <TableCell className="text-foreground">
                                            {topics.find(t => t.id === ex.topic_id)?.title || '-'}
                                        </TableCell>
                                        <TableCell>
                                            <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80">
                                                {ex.difficulty}
                                            </span>
                                        </TableCell>
                                        <TableCell>
                                            <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent ${ex.is_published ? 'bg-green-900/30 text-green-400' : 'bg-yellow-900/30 text-yellow-400'}`}>
                                                {ex.is_published ? 'Published' : 'Draft'}
                                            </span>
                                        </TableCell>
                                        <TableCell className="text-right space-x-2">
                                            <Button variant="ghost" size="icon" onClick={() => navigate(`/exercises/${ex.id}`)} title="View Details" className="text-muted-foreground hover:text-foreground">
                                                <Eye className="h-4 w-4" />
                                            </Button>
                                            <Button variant="ghost" size="icon" onClick={() => handleOpenModal(ex)} title="Edit" className="text-muted-foreground hover:text-primary">
                                                <Edit className="h-4 w-4" />
                                            </Button>
                                            <Button variant="ghost" size="icon" onClick={() => handleDelete(ex.id)} className="text-muted-foreground hover:text-destructive hover:bg-destructive/10" title="Delete">
                                                <Trash2 className="h-4 w-4" />
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
                <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-card border-border text-foreground">
                    <DialogHeader>
                        <DialogTitle>{editingId ? 'Edit Exercise' : 'New Exercise'}</DialogTitle>
                    </DialogHeader>

                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 mt-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className='space-y-4'>
                                    <FormField
                                        control={form.control}
                                        name="title"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Title</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="Exercise title" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="topic_id"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Topic</FormLabel>
                                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                    <FormControl>
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Select Topic..." />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        {topics.map(t => <SelectItem key={t.id} value={t.id}>{t.title}</SelectItem>)}
                                                    </SelectContent>
                                                </Select>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="youtube_id"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>YouTube ID or URL</FormLabel>
                                                <div className="flex gap-2">
                                                    <FormControl>
                                                        <Input placeholder="e.g. dQw4w9WgXcQ" {...field} />
                                                    </FormControl>
                                                    <Button
                                                        type="button"
                                                        variant="secondary"
                                                        onClick={(e) => handleManualFetch(e)}
                                                        disabled={isFetchingCaptions}
                                                    >
                                                        {isFetchingCaptions ? 'Loading...' : <><Download className="h-4 w-4 mr-2" /> Fetch</>}
                                                    </Button>
                                                </div>
                                                <FormDescription>
                                                    Paste a full YouTube URL or ID to auto-fetch captions.
                                                </FormDescription>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <div className="grid grid-cols-2 gap-4">
                                        <FormField
                                            control={form.control}
                                            name="difficulty"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Difficulty</FormLabel>
                                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                        <FormControl>
                                                            <SelectTrigger>
                                                                <SelectValue />
                                                            </SelectTrigger>
                                                        </FormControl>
                                                        <SelectContent>
                                                            <SelectItem value="Easy">Easy</SelectItem>
                                                            <SelectItem value="Medium">Medium</SelectItem>
                                                            <SelectItem value="Hard">Hard</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        <FormField
                                            control={form.control}
                                            name="is_published"
                                            render={({ field }) => (
                                                <FormItem className="flex flex-row items-end space-x-2 space-y-0 pb-2 h-full">
                                                    <FormControl>
                                                        <Checkbox
                                                            checked={field.value}
                                                            onCheckedChange={field.onChange}
                                                        />
                                                    </FormControl>
                                                    <div className="grid gap-1.5 leading-none">
                                                        <FormLabel className="font-normal cursor-pointer">
                                                            Published
                                                        </FormLabel>
                                                    </div>
                                                </FormItem>
                                            )}
                                        />
                                    </div>
                                </div>

                                <Card className="flex flex-col h-[400px] border-border bg-card">
                                    <CardHeader className="py-3 px-4 bg-muted/20 border-b border-border">
                                        <div className="flex justify-between items-center">
                                            <h4 className="text-sm font-medium text-foreground">Captions Preview ({previewCaptions.length})</h4>
                                            <span className="text-xs text-muted-foreground">Auto-saved on submit</span>
                                        </div>
                                    </CardHeader>
                                    <CardContent className="flex-1 overflow-y-auto p-2 bg-background/50">
                                        {previewCaptions.length === 0 ? (
                                            <p className="text-muted-foreground text-center mt-10 text-sm">
                                                {isFetchingCaptions ? 'Fetching captions...' : 'No captions fetched yet.'}
                                            </p>
                                        ) : (
                                            <div className="space-y-2 text-sm">
                                                {previewCaptions.map((seg, idx) => (
                                                    <div key={idx} className="flex gap-2 hover:bg-muted/30 p-1 rounded">
                                                        <span className="text-primary font-mono text-xs shrink-0 w-10 pt-0.5">{Math.floor(seg.start)}s</span>
                                                        <p className="text-foreground/90">{seg.text}</p>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </CardContent>
                                </Card>
                            </div>

                            <Button type="submit" className="w-full bg-primary text-primary-foreground hover:bg-primary/90" size="lg">
                                {editingId ? 'Save Changes' : 'Create Exercise'}
                            </Button>
                        </form>
                    </Form>
                </DialogContent>
            </Dialog>
        </div>
    );
};

import express from 'express';
import cors from 'cors';
import { supabase } from './lib/supabase';

const app = express();
const port = process.env.PORT || 3001;

app.use(cors({
    origin: ['http://localhost:3000', 'http://localhost:5173'],
    credentials: true
}));
app.use(express.json());

// Health check
app.get('/health', (req, res) => {
    res.json({ status: 'ok' });
});

// --- Topic Routes ---

// GET /api/topics - List topics
app.get('/api/topics', async (req, res) => {
    const { data, error } = await supabase
        .from('topics')
        .select('*')
        .order('order_index', { ascending: true });

    if (error) return res.status(500).json({ error: error.message });
    res.json(data);
});

// POST /api/topics - Create topic
app.post('/api/topics', async (req, res) => {
    const { data, error } = await supabase
        .from('topics')
        .insert([req.body])
        .select()
        .single();

    if (error) return res.status(500).json({ error: error.message });
    res.status(201).json(data);
});

// PATCH /api/topics/:id - Update topic
app.patch('/api/topics/:id', async (req, res) => {
    const { id } = req.params;
    const { data, error } = await supabase
        .from('topics')
        .update(req.body)
        .eq('id', id)
        .select()
        .single();

    if (error) return res.status(500).json({ error: error.message });
    res.json(data);
});

// DELETE /api/topics/:id - Delete topic
app.delete('/api/topics/:id', async (req, res) => {
    const { id } = req.params;
    const { error } = await supabase
        .from('topics')
        .delete()
        .eq('id', id);

    if (error) return res.status(500).json({ error: error.message });
    res.status(204).send();
});

// --- Exercise Routes ---

// GET /api/exercises - List exercises (optional filter by topic_id)
app.get('/api/exercises', async (req, res) => {
    const { topic_id } = req.query;
    let query = supabase
        .from('exercises')
        .select('*')
        .order('created_at', { ascending: false });

    if (topic_id) {
        query = query.eq('topic_id', topic_id);
    }

    const { data, error } = await query;

    if (error) return res.status(500).json({ error: error.message });
    res.json(data);
});

// POST /exercises - Create exercise
app.post('/api/exercises', async (req, res) => {
    const { data, error } = await supabase
        .from('exercises')
        .insert([req.body])
        .select()
        .single();

    if (error) return res.status(500).json({ error: error.message });
    res.status(201).json(data);
});

// GET /exercises/:id - Get detail including transcripts
app.get('/api/exercises/:id', async (req, res) => {
    const { id } = req.params;

    const { data: exercise, error: exError } = await supabase
        .from('exercises')
        .select('*')
        .eq('id', id)
        .single();

    if (exError) return res.status(500).json({ error: exError.message });
    res.json(exercise);
});

// PATCH /exercises/:id - Update
app.patch('/api/exercises/:id', async (req, res) => {
    const { id } = req.params;
    const { data, error } = await supabase
        .from('exercises')
        .update(req.body)
        .eq('id', id)
        .select()
        .single();

    if (error) return res.status(500).json({ error: error.message });
    res.json(data);
});

// DELETE /exercises/:id - Delete
app.delete('/api/exercises/:id', async (req, res) => {
    const { id } = req.params;
    const { error } = await supabase
        .from('exercises')
        .delete()
        .eq('id', id);

    if (error) return res.status(500).json({ error: error.message });
    res.status(204).send();
});

// --- Transcript (Segment) Routes ---

// POST /api/transcripts/bulk - Upsert multiple segments
app.post('/api/transcripts/bulk', async (req, res) => {
    const { exercise_id, segments } = req.body;

    // First, delete old segments if replacing
    await supabase.from('transcripts').delete().eq('exercise_id', exercise_id);

    const { data, error } = await supabase
        .from('transcripts')
        .insert(segments.map((s: any, idx: number) => ({
            ...s,
            exercise_id,
            order_index: idx
        })));

    if (error) return res.status(500).json({ error: error.message });
    res.status(201).json({ message: 'Success' });
});

import { spawn } from 'child_process';
import path from 'path';

// --- Utility Route ---

// GET /api/youtube-transcript?videoId=...
app.get('/api/youtube-transcript', (req, res) => {
    const videoId = req.query.videoId as string;
    if (!videoId) {
        return res.status(400).json({ error: 'Missing videoId' });
    }

    const scriptPath = path.join(__dirname, '../scripts/get_transcript.py');
    const pythonProcess = spawn('python', [scriptPath, videoId]);

    let dataString = '';
    let errorString = '';

    pythonProcess.stdout.on('data', (data) => {
        dataString += data.toString();
    });

    pythonProcess.stderr.on('data', (data) => {
        errorString += data.toString();
    });

    pythonProcess.on('close', (code) => {
        if (code !== 0) {
            console.error(`Python script exited with code ${code}: ${errorString}`);
            try {
                // Try to parse the error string as JSON if the python script structured it that way
                const errorJson = JSON.parse(errorString);
                return res.status(500).json(errorJson);
            } catch (e) {
                return res.status(500).json({ error: 'Failed to fetch transcript', details: errorString });
            }
        }

        try {
            const transcript = JSON.parse(dataString);
            res.json(transcript);
        } catch (e) {
            console.error('Failed to parse python output:', dataString);
            res.status(500).json({ error: 'Failed to parse transcript data' });
        }
    });
});

app.listen(port, () => {
    console.log(`Backend listening at http://localhost:${port}`);
});

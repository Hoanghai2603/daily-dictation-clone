// import { supabase } from './supabase'; // Removed unused import
import axios from 'axios';

export interface TranscriptSegment {
    start: number;
    duration: number;
    text: string;
}

export const fetchYoutubeTranscript = async (videoId: string): Promise<TranscriptSegment[]> => {
    try {
        // Fetch from our backend API which runs the python script
        const response = await axios.get(`http://localhost:3001/api/youtube-transcript?videoId=${videoId}`);
        const transcriptItems = response.data;

        // The python script now returns { text, start, duration } in seconds
        // So we can map directly, or if it exactly matches, just return it.
        // Let's map to be safe and ensure types.

        return transcriptItems.map((item: TranscriptSegment) => ({
            start: item.start,
            duration: item.duration,
            text: item.text
        }));

    } catch (error) {
        console.error('Error fetching transcript from backend:', error);
        throw error;
    }
};

// export const saveTranscriptToSupabase removed as it's no longer used.
// Transcripts are now stored as a JSONB column in the exercises table.

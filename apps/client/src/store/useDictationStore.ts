import { create } from 'zustand';

interface Segment {
    id: string;
    content: string;
    start_time: number;
    end_time: number;
    order_index: number;
}

interface DictationState {
    segments: Segment[];
    currentIndex: number;
    userInput: string;
    isCorrect: boolean | null;
    mode: 'listen' | 'type' | 'check' | 'read';

    // Actions
    setSegments: (segments: Segment[]) => void;
    setUserInput: (input: string) => void;
    nextSegment: () => void;
    checkAnswer: () => void;
    setMode: (mode: 'listen' | 'type' | 'check' | 'read') => void;
}

export const useDictationStore = create<DictationState>((set, get) => ({
    segments: [],
    currentIndex: 0,
    userInput: '',
    isCorrect: null,
    mode: 'listen',

    setSegments: (segments) => set({ segments, currentIndex: 0, mode: 'listen', userInput: '', isCorrect: null }),

    setUserInput: (userInput) => set({ userInput }),

    setMode: (mode) => set({ mode }),

    checkAnswer: () => {
        const { segments, currentIndex, userInput } = get();
        const currentSegment = segments[currentIndex];

        // Normalize text for comparison (remove punctuation, lower case)
        const normalize = (text: string) => text.toLowerCase().replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, "").trim();

        const isCorrect = normalize(userInput) === normalize(currentSegment.content);
        set({ isCorrect, mode: 'check' });
    },

    nextSegment: () => {
        const { currentIndex, segments } = get();
        if (currentIndex < segments.length - 1) {
            set({
                currentIndex: currentIndex + 1,
                userInput: '',
                isCorrect: null,
                mode: 'listen'
            });
        } else {
            set({ mode: 'read' });
        }
    }
}));

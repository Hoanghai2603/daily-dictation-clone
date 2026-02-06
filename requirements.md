# DailyDictation Clone - Feature Requirements & Brainstorming

## 1. Project Overview
Build a website for learning English via dictation, cloning the core functionality of `dailydictation.com`.
**Tech Stack**:
- **Monorepo**: Turbo or Nx (implied by "same repo").
- **Backend**: Node.js + Supabase (PostgreSQL, Auth).
- **Frontend Admin**: React + Vite (likely) or Next.js.
- **Frontend Client**: Next.js + `next-intl`.
- **Shared**: Tailwind CSS, Shadcn UI, Tanstack Query, BiomeJS, TypeScript, Zustand.

## 2. Feature Breakdown

### A. Client (Public Website)

#### 1. Core Learning (The Dictation Loop)
*   **Video Player**: Embedded YouTube player.
    *   Must support disabling sticky/autoplay if needed.
    *   Keyboard shortcuts (Space to play/pause, Arrows to seek).
*   **Dictation Interface**:
    *   **Playback Controls**: Play, Pause, Rewind (5s), Slow Mode (0.75x, 0.5x).
    *   **Input Field**: Text area for typing what is heard.
    *   **Text Processing**:
        *   **Check Answer**: Compare user input with transcript (Case insensitive, ignore punctuation option).
        *   **Diff View**: Highlight errors in Red, correct text in Green.
        *   **Hint/Reveal**: Ability to reveal the current sentence/word.
    *   **Subtitle Sync (Segments)**: Break video into sentences. Auto-pause at end of segment (Auto-loop option).
*   **Vocabulary/Notes**:
    *   Double-click a word to translate (Dictionary API integration).
    *   "Save to Vocabulary" button.

#### 1.1 Dictation Workflow Details (Confirmed)
*   **Listen**: One sentence at a time. Keyboard shortcuts: `` ` `` (Play/Pause), `Ctrl` (Replay).
*   **Type**: Dedicated `textarea`. Optimized for fast typing without mouse usage.
*   **Check**: 
    - Instant validation on click/Enter.
    - Matches are highlighted in Green.
    - Correct sentence revealed below on partial match or "Show Hint/Skip".
*   **Read**: Final step to view full transcript and pronunciation details.
*   **Settings Drawer**:
    - **Auto Replay**: Toggle and interval (seconds).
    - **Shortcut Redefinition**: Customize replay/pause keys.
    - **Mobile Mode**: Toggle word suggestions.

#### 2. Discovery & Navigation (Home/Listing)
*   **Search**: By title, topic.
*   **Filters**: Difficulty (Easy/Medium/Hard), Accent (US/UK/AUS), Duration.
*   **Categories/Tags**: IELTS, TOEIC, Daily Conversation, News.
*   **Pagination**: Infinite scroll or standard pagination for exercises.

#### 3. Authentication & User Profile
*   **Auth**: Login/Register (Email + Password), OAuth (Google/Facebook via Supabase).
*   **Profile Dashboard**:
    *   **Progress Tracking**: Daily streak, Total time listened, sentences typed.
    *   **History**: List of completed exercises.
    *   **Vocabulary List**: Review saved words.
*   **Settings**: Preferred playback speed, UI theme (Dark/Light).

#### 4. Internationalization (i18n)
*   Key format: `feature_text` (e.g., `auth_enter_your_password`) or `common_text`.

---

### B. Admin Panel (Content Management)

#### 1. Exercise Management
*   **Create/Edit Exercise**:
    *   Input: YouTube URL.
    *   Title, Thumbnail (Auto-fetch from YT or custom).
    *   **Transcript Editor**:
        *   Text input.
        *   **Timestamp Sync**: Tool to sync lines with video time (Start/End times for each sentence). *Critical Feature*.
    *   Tags/Categories assigning.
    *   Difficulty Level setting.
*   **List Exercises**: Filter, Search, Delete, Publish/Unpublish.

#### 2. User Management
*   View list of users.
*   Ban/block users.
*   View user stats (optional).

#### 3. Dashboard
*   **Stats**: Total views, Total exercises completed, New users growth (Daily/Weekly).
*   **System Logs**: Track content changes and management actions.

#### 4. Transcription Tool (Specialized Component)
*   **Timeline Sync**: Sync-with-playhead or keyboard-driven timestamping (e.g., Press `Enter` to set end-time of current sentence).
*   **Bulk Import**: Integration with YouTube Captions API for initial drafts.
*   **Auto-segmentation**: Intelligent splitting of raw transcripts into sentence-level blocks.

---

## 3. Data Structure (Supabase - Draft)

*   **users**: `id, email, full_name, avatar_url, created_at`
*   **exercises**: `id, youtube_id, title, description, level, accent, duration, is_published, created_at`
*   **transcripts**: `id, exercise_id, content, start_time, end_time, order_index` (One row per sentence/segment)
*   **user_progress**: `id, user_id, exercise_id, status (completed/in-progress), percentage, last_accessed`
*   **vocabulary**: `id, user_id, word, translation, context_sentence`

## 4. Requirement Analysis & "Nice-to-Haves" vs "MVP"

| Feature | MVP | V2 (Enhanced) |
| :--- | :---: | :---: |
| YouTube Player | ✅ | Custom Controls |
| Checks & Diffs | ✅ | Fuzzy Matching |
| Sentence Segmentation | ✅ | Auto-generate from YT Captions |
| Auth | ✅ | Social Login |
| Save Vocab | ❌ | ✅ |
| Progress Stats | Basic | Charts/Graphs |
| Admin Sync Tool | Basic | Waveform Editor |

## 5. UI/UX Directives
*   **Client**: 100% clone of `dailydictation.com` layout. Clean, whitespace-heavy, focus on text and player.
*   **Admin**: Functional, Shadcn Dashboard template. Clean and efficient for data entry (especially timestamping).

### Observed UI Details (Confirmed)
- **Primary Color**: Vibrant Blue (Used for primary buttons like "Start Now" and active states).
- **Navigation**: Sticky header with Logo (Left) and Utility links (Login, Register, Theme Toggle) on the Right.
- **Hero Section**: Two-column layout (Text/CTA left, Visual right).
- **Instructional Flow**: Prominent "How it works" section with 4 steps: Listen -> Type -> Check -> Read.
- **Typography**: Modern Sans-Serif (likely Inter or System UI), high readability, bold headings.

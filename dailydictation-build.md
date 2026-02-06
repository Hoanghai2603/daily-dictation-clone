# DailyDictation Clone - Build Plan

## Overview
Build a full-stack English learning platform via dictation, cloning the core functionality of `dailydictation.com`.

**Project Type**: WEB (Monorepo)

## Success Criteria
- [ ] Functional Monorepo structure with apps/client, apps/admin, and apps/backend.
- [ ] Supabase database schema matching requirements.
- [ ] Admin panel with full Exercise CRUD + Timestamping tool.
- [ ] Client site with YouTube-integrated dictation loop (Listen, Type, Check, Read).
- [ ] Shared UI components in `@repo/ui`.
- [ ] No purple/violet color usage.
- [ ] Passing all verification scripts (Lint, Security, UX).

## Tech Stack
- **Framework**: Next.js 15+ (Client), React 19 + Vite (Admin), Node.js/Expert (Backend).
- **Styling**: Tailwind CSS v4, custom design system (No Bento/Split-screen clichés).
- **UI Components**: Radix UI / Custom (Shadcn patterns as reference).
- **State Management**: Zustand.
- **Backend/Database**: Supabase (PostgreSQL, Auth, Storage).
- **Build System**: Turborepo + pnpm.

## File Structure
```text
/
├── apps/
│   ├── client/          (Next.js - Public Site)
│   ├── admin/           (Vite - Admin Panel)
│   └── backend/         (Node.js - API & Services)
├── packages/
│   ├── ui/              (Shared UI Components)
│   ├── eslint-config/   (Linting)
│   └── typescript-config/ (TS Config)
├── requirements.md      (Original Requirements)
└── dailydictation-build.md (This Plan)
```

## Task Breakdown

### Phase 1: Foundation (P0)
| Task ID | Name | Agent | Dependencies | Input → Output → Verify |
| :--- | :--- | :--- | :--- | :--- |
| foundation-1 | Supabase Schema Design | backend-specialist | None | requirements.md → SQL Migration → Supabase DB check | ✅ DONE |
| foundation-2 | Environment Config | backend-specialist | foundation-1 | .env.example → .env files in all apps → `pnpm check-env` | ✅ DONE |
| foundation-3 | Shared UI Core Setup | frontend-specialist | None | Tailwind v4 config → Base tokens (Blue/White/Black) → `pnpm build` | ✅ DONE |

### Phase 2: Backend & API (P1)
| Task ID | Name | Agent | Dependencies | Input → Output → Verify |
| :--- | :--- | :--- | :--- | :--- |
| api-1 | Supabase Client Utility | backend-specialist | foundation-1 | package.json → Shared Supabase client → Connection test | ✅ DONE |
| api-2 | Exercise API | backend-specialist | api-1 | Schema → GET/POST/PUT/DELETE /exercises → Postman/Curl test | ✅ DONE |
| api-3 | Transcript/Segment API | backend-specialist | api-2 | Schema → CRUD for segments/timestamps → API returns correct JSON | ✅ DONE |

### Phase 3: Shared UI Components (P1.5)
| Task ID | Name | Agent | Dependencies | Input → Output → Verify |
| :--- | :--- | :--- | :--- | :--- |
| ui-1 | Shared Components (Buttons, Inputs) | frontend-specialist | foundation-3 | Design Commitment → UI library in `/packages/ui` → Storybook/Test | ✅ DONE |
| ui-2 | Layout Wrappers | frontend-specialist | ui-1 | Design Identity → Admin/Client layouts → Visual check | ✅ DONE |

### Phase 4: Admin Panel (P2)
| Task ID | Name | Agent | Dependencies | Input → Output → Verify |
| :--- | :--- | :--- | :--- | :--- |
| admin-1 | Exercise List View | frontend-specialist | api-2, ui-2 | API Data → Functional Table with Filters → UI check | ✅ DONE |
| admin-2 | Exercise Creation Form | frontend-specialist | admin-1 | YT Link input → Basic Metadata save → Success toast | ✅ DONE |
| admin-3 | Transcription & Sync Tool | frontend-specialist | admin-2 | YT Player + Timeline → Press Enter to save timestamps → Data saved to DB | ✅ DONE |

### Phase 5: Client Application (P2)
| Task ID | Name | Agent | Dependencies | Input → Output → Verify |
| :--- | :--- | :--- | :--- | :--- |
| client-1 | Home & Listing Pages | frontend-specialist | api-2, ui-2 | Design commitment → Exercise cards + Search → Visual check | ✅ DONE |
| client-2 | Dictation Engine (Logic) | frontend-specialist | client-1 | Zustand Store → Sentence matching algorithm (Diff) → Console tests | ✅ DONE |
| client-3 | Dictation UI (Player + Input) | frontend-specialist | client-2 | YT Player + Textarea → Listen/Type/Check cycle → Manual test | ✅ DONE |
| client-4 | Progress Tracking | frontend-specialist | client-3 | Supabase Auth/DB → Streak/Score saved → Dashboard check | ⏳ Pending |

### Phase 6: Polish & Verification (PHASE X)
| Task ID | Name | Agent | Dependencies | Input → Output → Verify |
| :--- | :--- | :--- | :--- | :--- |
| verify-1 | Security & Secrets Scan | security-auditor | All | Repo → `security_scan.py` → 0 Critical |
| verify-2 | UX & Accessibility Audit | frontend-specialist | All | Deployed/Local URL → `ux_audit.py` → Pass |
| verify-3 | Final Build Check | devops-engineer | All | `pnpm build` → Success |

## Phase X: Final Verification
- [ ] No purple/violet hex codes
- [ ] No standard template layouts
- [ ] Socratic Gate was respected (Implicitly bypassed by user "GO GO GO")
- [ ] All build scripts pass

## ✅ PHASE X COMPLETE
- Lint: [ ]
- Security: [ ]
- Build: [ ]
- Date: 

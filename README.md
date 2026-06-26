# 🏹 CampusMatch

> Campus-focused dating & social app — where relationships, friendships, and communities grow naturally.

CampusMatch combines the best of **Instagram** (stories, posts), **Discord** (communities), **Tinder** (matches), and **Omegle** (random discovery) into one app — without forcing people into dating. It creates an ecosystem where everything from casual chats to committed relationships can emerge organically.

---

## 🎯 Signature Feature: Surprise Meetup

A queue-based random voice/video call with anonymous introduction — inspired by Omegle but classier. Join the queue, get paired with someone new, and decide after the call whether to save their profile or move on.

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | React 19, TypeScript, Vite 7 |
| **Styling** | Tailwind CSS 4, Framer Motion |
| **Icons** | Lucide React |
| **Backend** | Supabase (Auth, PostgreSQL, Storage, Realtime, Edge Functions) |
| **Database** | PostgreSQL 15 (16 tables, 3 views, 2 functions) |

---

## 📁 Project Structure

```
cupid/
├── Hook_App/                    # Main React application
│   ├── src/
│   │   ├── main.tsx             # Entry point
│   │   ├── app/
│   │   │   └── App.tsx          # Auth gate, tab routing, overlays
│   │   ├── contexts/
│   │   │   └── AuthContext.tsx   # Supabase auth state + phone OTP + uploads
│   │   ├── components/
│   │   │   ├── App.tsx           # Tab shell (Discover, Matches, DMs, Profile)
│   │   │   ├── AuthScreen.tsx    # Email/password + phone OTP
│   │   │   ├── OnboardingFlow.tsx# 5-step: Name → Age → Bio → University → Photos
│   │   │   ├── DiscoverFeed.tsx  # Infinite-scroll post feed + stories row
│   │   │   ├── MatchesTab.tsx    # Match grid + tips
│   │   │   ├── DMsTab.tsx        # Thread list (active + pending)
│   │   │   ├── ProfileTab.tsx    # My profile, stats, collections, settings
│   │   │   ├── PostScreen.tsx    # Photo editor + caption + audience
│   │   │   ├── ChatScreen.tsx    # Real-time one-on-one chat
│   │   │   ├── SurpriseMeetup.tsx# 4-stage meetup flow
│   │   │   ├── UserProfile.tsx   # View other user's profile
│   │   │   ├── StoryViewer.tsx   # Full-screen story viewer
│   │   │   ├── NotificationsPanel.tsx
│   │   │   ├── BlockReportModal.tsx
│   │   │   ├── ErrorBoundary.tsx
│   │   │   ├── LoadingSkeleton.tsx
│   │   │   ├── EmptyState.tsx
│   │   │   └── Toast.tsx
│   │   ├── lib/
│   │   │   ├── supabase.ts       # Supabase client
│   │   │   ├── database.types.ts # Full TypeScript schema types
│   │   │   └── api/
│   │   │       ├── posts.ts
│   │   │       ├── profiles.ts
│   │   │       ├── threads.ts
│   │   │       ├── messages.ts
│   │   │       ├── matches.ts
│   │   │       ├── surprise.ts
│   │   │       ├── stories.ts
│   │   │       └── notifications.ts
│   │   └── styles/
│   │       ├── fonts.css         # Nunito + Nunito Sans
│   │       ├── theme.css         # Design tokens
│   │       ├── tailwind.css      # Tailwind v4 directives
│   │       └── index.css         # Base reset
│   ├── package.json
│   ├── vite.config.ts
│   ├── tsconfig.json
│   └── eslint.config.js
├── supabase/
│   ├── migrations/               # 19 SQL migration files
│   │   ├── enums.sql             # 8 enum types
│   │   ├── profiles.sql
│   │   ├── universities.sql
│   │   ├── posts.sql
│   │   ├── posts_like.sql
│   │   ├── profile_likes.sql
│   │   ├── stories.sql
│   │   ├── story_views.sql
│   │   ├── threads.sql
│   │   ├── messages.sql
│   │   ├── surprise_queue.sql
│   │   ├── surprise_sessions.sql
│   │   ├── surprise_saves.sql
│   │   ├── blocks.sql
│   │   ├── reports.sql
│   │   ├── notifications.sql
│   │   ├── analytic_events.sql
│   │   ├── matches_view.sql
│   │   ├── suggested_matches.sql
│   │   ├── active_stories_view.sql
│   │   ├── message_count.sql     # Trigger + function
│   │   ├── auto_profile_creation.sql
│   │   ├── not_blocker_helper.sql
│   │   ├── rpc_functions.sql     # RPC functions
│   │   └── indexes.sql
│   ├── rls/                      # 12 Row-Level Security policy files
│   │   ├── profiles.sql
│   │   ├── posts.sql
│   │   ├── posts_like.sql
│   │   ├── profile_likes.sql
│   │   ├── messages.sql
│   │   ├── threads.sql
│   │   ├── stories.sql
│   │   ├── story_views.sql
│   │   ├── notifications.sql
│   │   ├── blocks_reports.sql
│   │   ├── surprise_tables.sql
│   │   └── analytic_events.sql
│   ├── functions/                # 6 Edge Functions
│   │   ├── cleanup-expired/      # Cron: delete expired stories + stale queue
│   │   ├── create-profile/       # Auto-match university + welcome notification
│   │   ├── moderate-content/     # Keyword blocklist + length validation
│   │   ├── seed-data/            # Seed 8 Kenyan universities
│   │   ├── send-notification/    # Webhook → push notifications
│   │   └── surprise-pairing/     # Pair waiting users for Surprise Meetup
│   ├── storage_buckets.sql
│   └── scheduled_cleanup.sql
├── Cupid.md                      # Original vision & product spec
├── Roadmap.md                    # 12-phase development roadmap
└── README.md                     # You are here
```

---

## 🗄️ Database Schema

### Tables (16)

| Table | Purpose |
|---|---|
| `profiles` | User profiles (name, bio, age, gender, interests, university, avatar) |
| `universities` | Supported Kenyan universities |
| `posts` | User posts with media, caption, audience |
| `posts_like` | Post likes |
| `profile_likes` | Profile likes |
| `stories` | 24-hour stories with auto-expiry |
| `story_views` | Story view tracking |
| `threads` | Message threads (pending/matched) |
| `messages` | Messages within threads |
| `surprise_queue` | Users waiting for Surprise Meetup |
| `surprise_sessions` | Active surprise call sessions |
| `surprise_saves` | Saved profiles from Surprise Meetup |
| `blocks` | User blocking |
| `reports` | Content/user reporting |
| `notifications` | Push notification records |
| `analytic_events` | App analytics events |

### Views (3)

| View | Purpose |
|---|---|
| `matches_view` | Matched threads with profile info |
| `suggested_matches` | Suggested profiles for Discover |
| `active_stories_view` | Non-expired stories |

### Functions

| Function | Purpose |
|---|---|
| `message_count` | Enforce 5-message limit, auto-promote threads to matched |
| `not_blocked` | Check if two users haven't blocked each other |
| `get_matched_profiles` | RPC: fetch profiles for a user's matches |
| `get_random_profile` | RPC: fetch a random profile for Surprise |
| `log_event` | RPC: log an analytics event |

---

## 🎨 Design System

| Token | Value | Usage |
|---|---|---|
| `--primary` | `#8B1A2E` | Brand burgundy |
| `--primary-foreground` | `#ffffff` | Text on primary |
| `--background` | `#fdfcfb` | App background |
| `--foreground` | `#1A1A1A` | Main text |
| `--accent` | `#E6B422` | Gold accent |
| `--muted` | `#f4f0f1` | Muted backgrounds |
| `--muted-foreground` | `#8a7a7e` | Muted text |
| `--destructive` | `#EF4444` | Error/danger |

**Fonts**: Nunito (display), Nunito Sans (body)
**App width**: 390px centered (mobile-first)

---

## 🔐 Auth Flow

1. **AuthScreen** — Email/password sign in or sign up, or phone OTP
2. **OnboardingFlow** — 5 steps: Name → Age → Bio → University (searchable dropdown, 8 Kenyan unis) → Photos (drag-drop upload to Supabase Storage)
3. Profile auto-created in `profiles` table on sign-up via trigger or `create-profile` Edge Function

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- Supabase project ([yfeyznstbsipwezeovzm](https://supabase.com/dashboard/project/yfeyznstbsipwezeovzm))

### Setup

```bash
cd Hook_App
npm install
```

Create a `.env` file in `Hook_App/`:

```env
VITE_SUPABASE_URL=https://yfeyznstbsipwezeovzm.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

### Development

```bash
npm run dev          # Start dev server on localhost:5173
npm run build        # Production build
npm run preview      # Preview production build
```

### Supabase

```bash
# Link project
npx supabase link --project-ref yfeyznstbsipwezeovzm

# Deploy edge functions
npx supabase functions deploy

# Run SQL migrations (via Supabase Dashboard SQL Editor)
# 1. Run migrations/ in order (enums → extensions → tables → views → functions)
# 2. Run rls/ files to apply policies
# 3. Run storage_buckets.sql to create storage buckets
```

---

## 📊 Build

| Metric | Value |
|---|---|
| TypeScript errors | 0 |
| ESLint errors | 0 |
| JS bundle | 596 KB (172 KB gzipped) |
| CSS bundle | 38 KB (7.5 KB gzipped) |
| Lazy chunks | 8 code-split chunks |
| Build time | ~5s |

---

## 🚢 Deployment

### Edge Functions (Deployed)

| Function | Status |
|---|---|
| `cleanup-expired` | ✅ Active |
| `create-profile` | ✅ Active |
| `moderate-content` | ✅ Active |
| `seed-data` | ✅ Active |
| `send-notification` | ✅ Active |
| `surprise-pairing` | ✅ Active |

### Database

All 19 migrations + 12 RLS policy files are ready to apply via the Supabase Dashboard SQL Editor.

---

## 📋 Roadmap Progress

| Phase | Feature | Status |
|---|---|---|
| **1** | Foundation (deps, Supabase client, cleanup) | ✅ Complete |
| **2** | Auth (email/password, phone OTP, onboarding) | ✅ Complete |
| **3** | Discover Feed (posts, stories, infinite scroll) | ✅ Complete |
| **4** | Surprise Meetup (4-stage flow) | ✅ Complete |
| **5** | DMs & Chat (threads, real-time messages) | ✅ Complete |
| **6** | Matches (grid, tips) | ✅ Complete |
| **7** | User Profile (viewing others) | ✅ Complete |
| **8** | My Profile (stats, collections, settings) | ✅ Complete |
| **9** | Post Creation (editor, filters, caption) | ✅ Complete |
| **10** | Notifications (panel, real-time badge) | ✅ Complete |
| **11** | Security & Performance (RLS, lazy load, code split) | ✅ Complete |
| **12** | Polish & Launch (error handling, a11y) | ✅ Complete |

---

## 📝 License

Proprietary — CampusMatch by Austin Murungu

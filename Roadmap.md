# 🗺️ CampusMatch — Development Roadmap

> **From:** Hook_App (legacy prototype)  
> **To:** CampusMatch (full-stack campus dating app)  
> **Stack:** React 18 + Vite 6 + Tailwind CSS 4 + shadcn/ui + Supabase

---

## 📋 Project Overview

CampusMatch is a campus-focused dating/social app where students connect through **posts, stories, DMs, and surprise video meetups**. The app uses a **message-based matching system** (no swiping) — send up to 5 messages to anyone, and if they reply, you match!

---

## 🏗️ Architecture




---

## 🎯 Phase 1: Foundation (Setup & Cleanup)

### 1.1 Clean Up Project Structure
- [ ] Remove `Hook_App/` folder (legacy prototype — no longer needed)
- [ ] Remove `default_shadcn_theme.css` (reference only, theme is in `src/styles/theme.css`)
- [ ] Remove `images/` folder (screenshots no longer needed in production)
- [ ] Remove `01-app-architecture.pdf`, `02-frontend-architecture.pdf`, `03-backend-architecture.pdf`, `04-database-erd.pdf` (reference docs)
- [ ] Remove `README.md` (will be rewritten)
- [ ] Remove `Cupid.md` (old notes)

### 1.2 Install Missing Dependencies
- [ ] `@supabase/supabase-js` — Supabase client
- [ ] `react` + `react-dom` (v18.3.1 as specified in package.json peer deps)
- [ ] Verify all existing deps install correctly (lucide-react, motion, shadcn components, etc.)

### 1.3 Set Up Supabase Client
- [ ] Create `src/lib/supabase.ts` — Supabase client initialization
- [ ] Create `.env` file with Supabase URL + anon key
- [ ] Create `src/lib/database.types.ts` — TypeScript types from Supabase schema

### 1.4 Verify Dev Environment
- [ ] Run `npm install` successfully
- [ ] Run `npm run dev` and confirm app loads
- [ ] Fix any build errors

---

## 🎯 Phase 2: Authentication & Onboarding

### 2.1 Auth Flow
- [ ] Create `src/app/components/AuthScreen.tsx` — Phone number input screen
- [ ] Implement phone OTP flow via Supabase Auth
- [ ] Create `src/app/components/OTPVerification.tsx` — OTP code input
- [ ] Create `src/app/components/OnboardingFlow.tsx` — Multi-step onboarding
- [ ] Add university selection (from `universities` table)
- [ ] Add photo upload (to Supabase Storage)
- [ ] Add bio, interests, age, name fields

### 2.2 Profile Creation
- [ ] On sign-up, create profile in `profiles` table
- [ ] Upload avatar to `profile-pictures` storage bucket
- [ ] Auto-generate `@username` from name
- [ ] Set `university_id` from selection

### 2.3 Auth State Management
- [ ] Create `src/contexts/AuthContext.tsx` — Auth state provider
- [ ] Handle loading, authenticated, unauthenticated states
- [ ] Protect routes behind auth
- [ ] Handle session refresh

---

## 🎯 Phase 3: Discover Feed (Posts & Stories)

### 3.1 Stories
- [ ] Create `src/lib/api/stories.ts` — Story API functions
- [ ] Fetch stories from `stories` table (your story + active stories)
- [ ] Create `src/app/components/StoryViewer.tsx` — Full-screen story viewer
- [ ] Track story views in `story_views` table
- [ ] Show gradient ring for active stories, "+" for your story
- [ ] Auto-advance stories every 5 seconds
- [ ] Green dot for online users

### 3.2 Post Feed
- [ ] Create `src/lib/api/posts.ts` — Post API functions
- [ ] Fetch posts from `posts` table with user profile join
- [ ] Implement infinite scroll / pagination
- [ ] Create `src/app/components/PostCard.tsx` — Post card component
- [ ] Show university badge (from `universities` table)
- [ ] Implement carousel for gallery posts
- [ ] Implement double-tap to like (with heart animation)
- [ ] Implement like/unlike via `posts_like` table
- [ ] Implement report/block dropdown menu

### 3.3 Surprise Meetup Button
- [ ] Connect "Surprise" button to `suprise_queue` table
- [ ] Show "Finding someone…" animation while queued
- [ ] Implement matching logic (find available user)

---

## 🎯 Phase 4: Surprise Meetup (Video Call Flow)

### 4.1 Start Screen
- [ ] Animated dice with "Meet someone new right now"
- [ ] "Start Meetup" button adds user to queue
- [ ] "Not now" dismisses

### 4.2 Finding Screen
- [ ] Pulsing ring animation
- [ ] Search emoji with "Finding someone…"
- [ ] Cancel button to leave queue
- [ ] On match found → transition to call screen

### 4.3 Call Screen
- [ ] Remote user's video (placeholder image for now)
- [ ] Self-view PiP (picture-in-picture)
- [ ] Mic on/off toggle
- [ ] Video on/off toggle
- [ ] Flag button (report during call)
- [ ] Chat overlay with send functionality
- [ ] "Next" button → skip to next person
- [ ] "End call" button → post-call screen
- [ ] Auto-hide controls after 2.5s

### 4.4 Post-Call Screen
- [ ] Show matched user's avatar + name + university
- [ ] "Save Profile" button → saves to `suprise_saves`
- [ ] "Discard" button → dismisses
- [ ] Animated entrance with spring physics

### 4.5 Backend Integration
- [ ] Create `src/lib/api/surprise.ts` — Surprise API functions
- [ ] Connect queue to `suprise_queue` table
- [ ] Connect saves to `suprise_saves` table
- [ ] Implement real-time matching via Supabase Realtime

---

## 🎯 Phase 5: DMs & Chat

### 5.1 Thread List
- [ ] Create `src/lib/api/threads.ts` — Thread API functions
- [ ] Fetch threads from `threads` table
- [ ] Separate into "Matched ✦" (active) and "Waiting for reply" (pending)
- [ ] Show last message preview + timestamp
- [ ] Show unread indicator (gradient dot)
- [ ] Show "X messages left" for pending threads
- [ ] Show lock icon when 5 messages sent with no reply
- [ ] Show online status (green dot)

### 5.2 Chat View
- [ ] Create `src/lib/api/messages.ts` — Message API functions
- [ ] Fetch messages from `messages` table
- [ ] Implement send message (insert into `messages`)
- [ ] Gradient bubbles (burgundy for me, light pink for them)
- [ ] Timestamps on messages
- [ ] 5-message limit enforcement via `message_count` function
- [ ] Lock state when limit reached ("Waiting for reply")
- [ ] Real-time message updates via Supabase Realtime

### 5.3 Matching Logic
- [ ] When user sends first message → create thread (pending status)
- [ ] When recipient replies → thread becomes active (matched!)
- [ ] Update `matches_view` accordingly

---

## 🎯 Phase 6: Matches

### 6.1 Matches Tab
- [ ] Create `src/lib/api/matches.ts` — Match API functions
- [ ] Fetch matches from `matches_view`
- [ ] Show match highlight card with gradient background
- [ ] Show match note ("She replied to your message ✨")
- [ ] Show online status
- [ ] "Message" button → opens chat
- [ ] Empty state with envelope animation + explanation

### 6.2 Match Tips
- [ ] "How matching works" info card
- [ ] Explain 5-message system
- [ ] Link to Discover feed

---

## 🎯 Phase 7: User Profile (Viewing Others)

### 7.1 Profile View
- [ ] Create `src/lib/api/profiles.ts` — Profile API functions
- [ ] Fetch user profile from `profiles` table
- [ ] Full-bleed hero image with gradient overlay
- [ ] Name, age, university with verified badge
- [ ] Bio section
- [ ] Prompt card ("{name} says…")
- [ ] Interest tags
- [ ] More photos grid (2-column)

### 7.2 CTA Buttons
- [ ] "Send Message" button → creates thread or opens existing
- [ ] Heart button → like/save profile
- [ ] Back button → return to previous screen

---

## 🎯 Phase 8: My Profile

### 8.1 Profile Hero
- [ ] Gradient hero with avatar, name, age, university
- [ ] Camera button → change profile photo
- [ ] Edit button → edit profile
- [ ] Bio display
- [ ] Interest tags

### 8.2 Stats Row
- [ ] Posts count (from `posts` table)
- [ ] Matches count (from `matches_view`)
- [ ] DMs count (from `threads` table)

### 8.3 Collections
- [ ] "Liked Posts" tab → grid of liked photos (from `posts_like`)
- [ ] "Saved Surprises" tab → profiles saved from Surprise Meetup (from `suprise_saves`)
- [ ] Empty states for both tabs

### 8.4 Recommendations
- [ ] "People you might click with" horizontal scroll
- [ ] From `suggested_matches_view`
- [ ] Each card shows avatar, name, university
- [ ] Tap → view profile

### 8.5 Settings
- [ ] Account settings
- [ ] Privacy settings
- [ ] Blocked users list (from `blocks` table)
- [ ] Report history (from `reports` table)
- [ ] Log out

---

## 🎯 Phase 9: Post Creation

### 9.1 Media Selection
- [ ] Photo / Video / Gallery tabs
- [ ] Grid of recent photos from device
- [ ] Multi-select for gallery (up to 6)
- [ ] Preview of selected media

### 9.2 Photo Editor
- [ ] 10 filter presets (Original, Warm, Cool, Vivid, Fade, Drama, Glow, Moody, Golden, Film)
- [ ] 5 adjustment sliders (Brightness, Contrast, Saturation, Warmth, Vignette)
- [ ] 4 crop ratios (Free, 1:1, 4:5, 16:9)
- [ ] Text overlay with 60-char limit
- [ ] Per-item editing for galleries

### 9.3 Caption & Post
- [ ] Caption input (100-char limit)
- [ ] Audience selector (Everyone / Matches only / My university)
- [ ] Post type summary
- [ ] "Share to Discover" button
- [ ] Success animation on post
- [ ] Insert into `posts` table with `visibility` field

---

## 🎯 Phase 10: Notifications

### 10.1 Notification System
- [ ] Create `src/lib/api/notifications.ts` — Notification API functions
- [ ] Fetch notifications from `notifications` table
- [ ] Create `src/app/components/NotificationsPanel.tsx`
- [ ] Notification types:
  - New match (someone replied to your message)
  - New message
  - Post like
  - New story from match
  - Surprise Meetup match found

### 10.2 Real-time Updates
- [ ] Subscribe to `notifications` table via Supabase Realtime
- [ ] Show badge count on nav tabs
- [ ] Toast notifications for new events

---

## 🎯 Phase 11: Security & Performance

### 11.1 Row-Level Security (RLS)
- [ ] Apply all RLS policies from `supabase/rls/` folder
- [ ] Profiles: public read, own write
- [ ] Posts: public read, own create/update/delete
- [ ] Messages: thread participants only
- [ ] Stories: 24-hour visibility
- [ ] Blocks: prevent blocked users from seeing each other

### 11.2 Image Upload
- [ ] Connect to Supabase Storage buckets
- [ ] `profile-pictures` bucket for avatars
- [ ] `post-media` bucket for post images/videos
- [ ] `story-media` bucket for story content
- [ ] Implement upload progress indicators
- [ ] Implement image compression before upload

### 11.3 Performance Optimization
- [ ] Lazy load images with blur placeholders
- [ ] Implement virtual scrolling for long lists
- [ ] Cache Supabase queries where appropriate
- [ ] Optimize bundle size (code-split routes)

---

## 🎯 Phase 12: Polish & Launch

### 12.1 Error Handling
- [ ] Create `src/app/components/ErrorBoundary.tsx`
- [ ] Create `src/app/components/EmptyState.tsx`
- [ ] Create `src/app/components/LoadingSkeleton.tsx`
- [ ] Handle network errors gracefully
- [ ] Show user-friendly error messages

### 12.2 Accessibility
- [ ] Add aria labels to all interactive elements
- [ ] Ensure proper color contrast
- [ ] Add keyboard navigation support
- [ ] Test with screen readers

### 12.3 Testing
- [ ] Test auth flow (sign up, sign in, sign out)
- [ ] Test post creation (select, edit, caption, post)
- [ ] Test Surprise Meetup flow (all 4 stages)
- [ ] Test chat (send message, 5-message limit, match)
- [ ] Test profile (view, edit, collections)
- [ ] Test notifications

### 12.4 Deployment
- [ ] Build for production (`npm run build`)
- [ ] Deploy to Vercel / Netlify
- [ ] Configure environment variables
- [ ] Set up custom domain
- [ ] Enable HTTPS

---

## 📦 Database Tables Reference

| Table | Purpose | Status |
|---|---|---|
| `profiles` | User profiles (name, bio, university, photos) | ✅ Migrated |
| `universities` | List of supported universities | ✅ Migrated |
| `posts` | User posts with media and captions | ✅ Migrated |
| `posts_like` | Post likes tracking | ✅ Migrated |
| `stories` | 24-hour stories | ✅ Migrated |
| `story_views` | Story view tracking | ✅ Migrated |
| `threads` | Message threads between users | ✅ Migrated |
| `messages` | Individual messages in threads | ✅ Migrated |
| `suprise_queue` | Queue for Surprise Meetup matching | ✅ Migrated |
| `suprise_saves` | Saved profiles from Surprise Meetup | ✅ Migrated |
| `blocks` | Blocked users | ✅ Migrated |
| `reports` | Reported content | ✅ Migrated |
| `notifications` | User notifications | ✅ Migrated |
| `analytic_events` | App analytics | ✅ Migrated |
| `matches_view` | SQL view for active matches | ✅ Migrated |
| `suggested_matches_view` | SQL view for recommendations | ✅ Migrated |
| `active_stories_view` | SQL view for active stories | ✅ Migrated |
| `message_count` | SQL function for message limits | ✅ Migrated |

---

## 🎨 Design System

### Colors
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
| `--border` | `rgba(139,26,46,0.10)` | Borders |

### Gradients
- **Primary**: `linear-gradient(135deg, #8B1A2E, #C0395A)`
- **Story ring**: `linear-gradient(135deg, #E86A8F, #8B1A2E, #E6B422)`
- **Profile hero**: `linear-gradient(160deg, #6A1B2A, #B5294A, #E86A8F)`

### Typography
- **Display**: Nunito (sans-serif), weights 400, 700, 900
- **Body**: Nunito Sans (sans-serif), weight 400, 600, 700

### Spacing
- App width: 390px (mobile-first, centered)
- Border radius: `--radius: 0.625rem` (with sm/md/lg/xl variants)

---

## 📝 Notes

- The Figma-generated code uses **mock data** — all data needs to be replaced with real Supabase queries
- The app is designed as a **single-page app** (no router) with tab-based navigation
- All animations use **Framer Motion** (imported as `motion/react`)
- The 5-message limit is enforced by the `message_count` SQL function
- Surprise Meetup uses a **queue-based matching system** via `suprise_queue`
- Stories auto-expire after 24 hours (handled by `scheduled_cleanup.sql`)

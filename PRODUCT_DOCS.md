# JapaLearn AI — Product Documentation

**Version:** 1.0  
**Last Updated:** 2026-04-15  
**Author:** Tomide Williams  
**Repo:** https://github.com/jappalearn/japalearn-ai

---

## Table of Contents

1. [What Is JapaLearn AI?](#1-what-is-japalearn-ai)
2. [Tech Stack](#2-tech-stack)
3. [Project Structure](#3-project-structure)
4. [Pages & Features](#4-pages--features)
5. [AI Engine](#5-ai-engine)
6. [Database (Supabase)](#6-database-supabase)
7. [Quiz & Scoring System](#7-quiz--scoring-system)
8. [Dashboard Logic Rules](#8-dashboard-logic-rules)
9. [Referral System](#9-referral-system)
10. [Blog System](#10-blog-system)
11. [Environment Variables](#11-environment-variables)
12. [Version History](#12-version-history)

---

## 1. What Is JapaLearn AI?

JapaLearn AI is an EdTech platform built for **Nigerians planning to relocate abroad**. It removes the guesswork from migration by giving users a personalised readiness score, visa route recommendation, AI-generated curriculum, and a step-by-step 12-month roadmap — all based on their profession, destination, and current situation.

**Core value proposition:**  
Know your visa route, readiness score, and exact action plan before spending a dime.

**Target users:** Nigerian professionals, students, and families considering relocation to Canada, UK, Germany, Australia, Ireland, Portugal, or UAE.

---

## 2. Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (Pages Router) |
| UI Library | React 19 |
| Styling | Tailwind CSS v3 + inline styles |
| Animation | Framer Motion |
| Icons | Lucide React |
| Database & Auth | Supabase (project: `sleohhuyxkgnvfbkhyke`, region: `eu-west-1`) |
| AI — Curriculum & Lessons | OpenAI `gpt-4o-mini` |
| AI — Quiz Generation | Groq `llama-3.3-70b-versatile` |
| Deployment | Vercel (auto-deploys from GitHub `main` branch) |
| Component Primitives | Radix UI (Progress, Slot) |
| Markdown Rendering | react-markdown + remark-gfm |

> **Note:** AI was previously Gemini (free tier quota issues), then Groq for all endpoints, then migrated to OpenAI for curriculum/lesson generation. Groq remains active for quiz generation.

---

## 3. Project Structure

```
japalearn-ai/
├── pages/
│   ├── index.js              # Landing page
│   ├── quiz.js               # Migration assessment quiz
│   ├── report.js             # Score report & visa route results
│   ├── dashboard.js          # Main user dashboard (all tabs)
│   ├── signup.js             # Sign up page
│   ├── login.js              # Login page
│   ├── blog.js               # Blog homepage
│   ├── shared-profile.js     # Public referral profile page
│   ├── privacy.js            # Privacy policy
│   ├── terms.js              # Terms of service
│   ├── _app.js               # Global app wrapper
│   ├── api/
│   │   ├── generate-curriculum.js   # AI: builds personalised curriculum
│   │   ├── generate-lesson.js       # AI: writes full lesson content
│   │   ├── generate-quiz.js         # AI: generates module quiz questions
│   │   └── summarise-lesson.js      # AI: summarises lesson into key takeaways
│   ├── blog/
│   │   └── [slug].js         # Dynamic blog post pages
│   ├── learn/
│   │   └── [curriculumId]/   # Lesson viewer pages
│   ├── u/
│   │   └── [referralCode].js # User public referral profile (/u/username-xxxxx)
│   └── admin/                # Admin panel pages
├── components/
│   └── layout/
│       ├── Navbar.jsx
│       ├── Hero.jsx
│       ├── Stats.jsx
│       ├── ProblemSection.jsx
│       ├── Roadmap.jsx
│       ├── PathwaysMarquee.jsx
│       ├── Testimonials.jsx
│       ├── FAQ.jsx
│       ├── Footer.jsx
│       └── NewsletterModal.jsx
├── lib/
│   ├── quizData.js           # Quiz questions, scoring maps, calculateScoreBreakdown
│   ├── supabase.js           # Supabase client
│   ├── Logo.js               # JapaLearn logo component
│   └── utils.js              # Utility functions (cn, etc.)
├── skills/                   # Internal AI rules / design guidelines
├── public/                   # Static assets (images, favicon)
├── PRODUCT_DOCS.md           # This file
└── package.json
```

---

## 4. Pages & Features

### Landing Page (`/`)
- Navbar with logo and auth CTAs
- Hero section with animated headline and quiz CTA
- Live stats counter (users, destinations, success stories)
- Problem section ("Why migration fails")
- How It Works roadmap (3 steps)
- Pathways marquee (destination countries)
- Testimonials
- FAQ
- Footer with links

### Quiz (`/quiz`)
**Multi-step migration assessment with branching logic:**

1. **Category selection** — 8 broad categories (Tech, Medical, Student, Skilled Worker, etc.)
2. **Sub-category** — role-specific options (e.g. Software Engineer, Medical Doctor)
3. **Destination** — 7 countries (Canada, UK, Germany, Australia, Ireland, Portugal, UAE)
4. **Dynamic questions** — 15–25 segment-specific questions (language test, qualifications, certifications, finances, etc.)
5. **Score calculation** — weighted scoring across 5 dimensions

Questions are defined in `lib/quizData.js` with segment-specific question sets for every profession.

### Report (`/report`)
- Displays readiness score (0–100%)
- Score breakdown across 5 categories
- Recommended visa route (segment + destination lookup)
- CTA to sign up and unlock full dashboard

### Dashboard (`/dashboard`)
The main authenticated experience. Five tabs:

| Tab | What it does |
|---|---|
| **Home** | Greeting, hero score card, priority actions, recent lesson progress |
| **Learning** | AI-generated curriculum with modules and lessons |
| **Roadmap** | 12-month migration milestone tracker (M1/M2/M3 auto-detection) |
| **Resources** | Visa links, document checklists, language test info |
| **Profile** | User details, score breakdown, referral link, settings |

### Auth Pages (`/signup`, `/login`)
- Email + password auth via Supabase
- Google OAuth support
- Welcome message: `"Welcome, [name]!"` on signup, `"Welcome back, [name]!"` on login
- Applies to both email and Google OAuth flows

### Blog (`/blog`, `/blog/[slug]`)
- Dynamic blog system driven by a content array in the blog page
- Articles on migration topics (Canada 2026 guide, AI & migration, medical pathways)
- Each article has author attribution, read time, and category tags

### Referral Profile (`/u/[referralCode]`)
- Public shareable profile page for each user
- Shows user's destination, segment, readiness level
- Styled to match the dashboard (dark slate theme)
- Tracks referral visits via Supabase

### Shared Profile (`/shared-profile`)
- Alternative shareable profile view

---

## 5. AI Engine

### Curriculum Generator (`/api/generate-curriculum`)
- **Model:** OpenAI `gpt-4o-mini`
- **Input:** Full user profile (segment, destination, qualifications, language status, finances, etc.)
- **Output:** JSON — 5–8 modules, each with 3–5 lessons
- **Rules:**
  - Urgent steps first (licensing, language tests)
  - Second-person tone ("You need to…")
  - No fluff — actionable, specific
  - Sources must be official (UKVI, IRCC, AHPRA, etc.)
  - 3 key takeaways per lesson

### Lesson Generator (`/api/generate-lesson`)
- **Model:** OpenAI `gpt-4o-mini`
- **Input:** Lesson title, module title, curriculum title, user's destination + segment
- **Output:** Full markdown lesson (800–1200 words)
- **Features:** Rotating opening styles (5 styles) so no two lessons start the same way
- Saves generated content to Supabase `curriculum_progress` table

### Quiz Generator (`/api/generate-quiz`)
- **Model:** Groq `llama-3.3-70b-versatile`
- **Input:** Module title, lesson summaries
- **Output:** 5 multiple-choice questions to test module comprehension

### Lesson Summariser (`/api/summarise-lesson`)
- **Model:** OpenAI `gpt-4o-mini`
- **Input:** Full lesson content
- **Output:** 3 bullet-point key takeaways

---

## 6. Database (Supabase)

**Project ID:** `sleohhuyxkgnvfbkhyke`  
**Region:** `eu-west-1`

### Tables

#### `profiles`
Stores user profile data created on signup.

| Column | Type | Notes |
|---|---|---|
| id | uuid | Matches Supabase auth user ID |
| full_name | text | |
| email | text | |
| referral_code | text | Unique, auto-generated on signup |
| created_at | timestamp | |

#### `quiz_results`
Stores the user's assessment answers and computed score.

| Column | Type | Notes |
|---|---|---|
| id | uuid | |
| user_id | uuid | FK → profiles.id |
| answers | jsonb | Full answers object from quiz |
| score | int | 0–100 readiness percentage |
| created_at | timestamp | |

#### `curriculum_progress`
Tracks curriculum generation and lesson completion.

| Column | Type | Notes |
|---|---|---|
| id | uuid | |
| user_id | uuid | FK → profiles.id |
| curriculum | jsonb | Full AI-generated curriculum JSON |
| completed_lessons | jsonb | Array of completed lesson identifiers |
| created_at | timestamp | |

---

## 7. Quiz & Scoring System

Scores are calculated in `lib/quizData.js` via `calculateScoreBreakdown()`.

### 5 Score Dimensions

| Dimension | What it measures |
|---|---|
| **Professional Readiness** | Qualifications, registrations, certifications |
| **Language Readiness** | IELTS/OET/language test status |
| **Financial Readiness** | Savings, income, financial stability |
| **Documentation** | Passport, certificates, paperwork status |
| **Destination Knowledge** | Awareness of visa routes, requirements |

Each dimension is scored 0–100. The overall score is a weighted average.

### Score Labels
- `70–100%` → **Strong**
- `45–69%` → **Moderate**
- `0–44%` → **Developing**

> **Rule:** Always import `calculateScoreBreakdown` from `lib/quizData.js`. Never duplicate the scoring maps elsewhere.

---

## 8. Dashboard Logic Rules

These rules govern the dashboard's dynamic behaviour. They must be followed exactly.

### Hero Card (Mobile + Desktop)
- Button when **quiz done** → `"Start Learning"` (goes to Learning tab)
- Button when **no quiz** → `"Start with Quiz"` (goes to `/quiz`)

### Priority Actions (always shows exactly 4)

The actions array in `dashboard.js` is built from conditional items and sliced to 4. The logic ensures 4 always appear:

| Condition | Action shown |
|---|---|
| No quiz taken | Take Migration Assessment (urgent, red) |
| Quiz done, no language test | Register for Language Test (urgent, red) |
| Quiz done + curriculum + lessons started | Continue your module |
| Quiz done, no curriculum OR no lessons started | Start Your Curriculum |
| Score < 40% | Improve IELTS preparation |
| Score ≥ 70% | Prepare your documents |
| Score 40–69% | Prepare Core Documents |
| Quiz done (always) | Review Your Roadmap |

### Welcome / Welcome Back
- First login after signup → `"Welcome, [name]! 🎉"`
- Returning login → `"[Greeting], [name] 👋"` (Good morning / afternoon / evening)

### Roadmap Milestones (M1 / M2 / M3)
- Auto-detected from quiz answers — not manually set
- M1: Language test registered or completed
- M2: Curriculum started / lessons in progress
- M3: Documents in progress

### No-Quiz State (Roadmap tab)
- Show hero card with empty numbers
- Show `"You need to take the quiz"` message only
- Do NOT show milestone designs before quiz is taken

---

## 9. Referral System

- Every user gets a unique referral code on signup: `firstname-xxxxx` (5 random alphanumeric chars)
- Referral link: `japalearn.ai/u/[referralCode]`
- Public profile at `/u/[referralCode]` shows destination, segment, readiness level
- Referral visits are tracked in Supabase

---

## 10. Blog System

- Blog homepage at `/blog` lists all articles
- Each article is a slug-routed page at `/blog/[slug]`
- Content is defined in the blog page as a static array (no CMS)
- Articles include: author, date, category, read time, featured image, full markdown body
- Current articles: Canada 2026 migration guide, AI & migration explainer, medical professional pathway

---

## 11. Environment Variables

These must be set in your `.env.local` (local) and Vercel dashboard (production):

```
NEXT_PUBLIC_SUPABASE_URL=https://sleohhuyxkgnvfbkhyke.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
OPENAI_API_KEY=your_openai_key
GROQ_API_KEY=your_groq_key
```

---

## 12. Version History

> Update this section with every significant change.

| Version | Date | Summary |
|---|---|---|
| 1.0 | 2026-04-15 | Initial documentation. Full product audit. |

### Changelog (from Git)

**April 2026**
- `fix` — Enforce dashboard skills rules for actions and hero button labels
- `fix` — Adjust framer-motion margin to trigger counter animation on mobile
- `fix` — Update hero subtitle text (multiple iterations)
- `fix` — Set global favicon and update site title
- `fix` — Update hero image rendering and styling
- `feat` — Overhaul referral profile UI to dashboard style, update landing stats
- `feat` — Wire up M1/M2/M3 milestone auto-detection on roadmap
- `style` — Full-card strikethrough line on completed roadmap milestones
- `fix` — Score all cert questions; add skills questions to Explorer/Family segments

**March 2026**
- `feat` — Migration Report upsell card on Roadmap + Credit Score bottom nav
- `feat` — Dynamic blog system + Canada 2026 guide
- `feat` — Referral code system (generate, backfill, share links)
- `feat` — Newsletter modal + blog system
- `feat` — Referral profile pages with tracking

**February 2026**
- `fix` — Dashboard personalisation aligned with skills rules
- `fix` — Score breakdown uses `calculateScoreBreakdown` from quizData
- `fix` — Roadmap no-quiz gate; remove placeholder milestone design
- `UI` — Mobile-responsive dashboard + dynamic roadmap overhaul
- `feat` — Module quiz system (compulsory per module)
- `feat` — Report navbar sign-up CTA + welcome vs welcome back logic
- `feat` — Global search in dashboard
- `feat` — Full dark mode + functional Profile tab
- `feat` — Resources + Documents tabs; fix signup flow

**January 2026**
- `feat` — Initial product — quiz, report, dashboard, auth
- `feat` — AI curriculum + lesson generation
- `design` — Landing page with full component system

---

*To export as PDF: open this file in VS Code, use the Markdown PDF extension, or paste into any markdown-to-PDF tool.*

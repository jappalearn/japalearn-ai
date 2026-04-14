# JapaLearn Dashboard – Skills & Migration Hub (MVP Spec)

> **Purpose:** This file is the north star for the AI agent when building, updating, or making decisions about the JapaLearn dashboard. Every specific rule here has been confirmed by the founder. Do not deviate without asking first.

---

## ⚠️ AGENT RULES (READ FIRST)

- **Always make changes for BOTH mobile and desktop.** The dashboard has a `useIsMobile()` hook. Mobile is `< 768px`. Most tab components have separate mobile/desktop render paths — check both.
- **Ask before removing any UI design.** The founder distinguishes between removing placeholder DATA (ok) vs removing the design/layout (not ok). When in doubt, ask.
- **Do not use AI-generated-looking designs.** The prototype in `/magicpath-extracted/` is the visual north star. Match its card styles, spacing, and typography.

---

## 🎯 Core Principle

You are not just showing data.
You are guiding a migration journey.

- Tone = warm, encouraging, human
- Focus = clarity + next steps
- Goal = always move the user forward

---

## 🏠 1. HERO SECTION

### Dynamic Greeting (real-time, based on local time)
- Before 12pm → "Good morning"
- 12pm–5pm → "Good afternoon"
- After 5pm → "Good evening"

### Language rules
- ✅ "Build your personalized learning journey"
- ✅ "Start with Quiz"
- ❌ "Generate curriculum" — never use this phrase anywhere
- ❌ "AI-powered pathway" — never use this phrase
- ❌ "AI-generated" — never use this phrase

### Hero CTA logic
| User State | Button Label | Action |
|---|---|---|
| Has NOT taken quiz | Start with Quiz | → `/quiz` |
| Has taken quiz | Start Learning | → curriculum tab |

---

## 🚨 2. PRE-QUIZ STATES (NO QUIZ TAKEN)

### Core rule
The design layouts ALWAYS show. What changes is the DATA and COPY.
- No placeholder data (fake numbers, fake milestones, fake modules)
- Copy should dynamically explain why the quiz matters for that section
- Buttons that would normally do something should redirect to `/quiz` instead

### Per-tab pre-quiz behaviour
| Tab | Design shown | Data shown | CTA |
|---|---|---|---|
| Overview | Full overview | 0 for readiness, — for others | "Start with Quiz" button |
| Curriculum | "What you'll get" card (blue gradient) | No modules shown pre-quiz | Button → `/quiz`, label "Start with Quiz" |
| Roadmap | Header + blue banner only (NO milestone timeline) | Quiz Required state, 0% progress, — weeks | No CTA button |
| Profile | Full profile design | Name/email from auth only, 0 readiness, — for all quiz fields | "Take Quiz" button only |
| Resources | Full resources design | Shows unfiltered resources if available | No CTA button on empty state |

### Roadmap pre-quiz (IMPORTANT)
The roadmap CANNOT show without quiz data. There is no destination, no visa route, no milestones, no timeline.
- Show the prototype-style header (sub-header text + h1 "My Roadmap" + description)
- Show the blue banner hero with: "QUIZ REQUIRED" label, "Not started yet", description, 0% progress bar, stat chips (— / 0% / 6 ahead)
- Desktop: include the phase strip with all phases dimmed/locked
- Mobile: no phase strip
- NO milestone timeline below
- NO CTA button

### Curriculum pre-quiz
- Show the "What you'll get" blue gradient card with 4 feature tiles
- Feature tiles: 5–8 modules / Matches your gaps / Ready in seconds / Fully unlocked
- Button: "Start with Quiz" → `/quiz`
- Do NOT show the profile tags section (those need quiz data)
- Do NOT disable the button — it should be active and route to quiz

### Resources pre-quiz empty state
- When no resources found and no quiz: "Take the quiz so we know your destination — resources are matched to your profile."
- No CTA button on the empty state message

### Profile pre-quiz
- Show full profile design (blue hero, stats bar, score breakdown, migration profile cards)
- Name and email show from auth (real data)
- Route line: "Take the quiz to build your migration profile"
- Stats bar: 0 readiness, — for everything else
- Score breakdown: warm empty state with "Start with Quiz" button
- Migration profile fields: show — for all quiz-dependent fields
- Only button in header: "Take Quiz" → `/quiz`

---

## 👤 3. PROFILE TAB RULES

- **No Edit button.** The profile is read-only. The only way to change your profile is to retake the quiz.
- **Only button in the header:** "Retake Quiz" (post-quiz) or "Take Quiz" (pre-quiz) — both route to `/quiz`
- Name and email display only — no inline editing
- "Retake Quiz" is the sole mechanism for updating all migration data

---

## 📊 4. STATS CARDS

### Before quiz
| Stat | Value |
|---|---|
| Readiness Score | `0` |
| Modules Active | `—` |
| Day Streak | `—` |
| Docs Ready | `—` |

### After quiz
| Stat | Source |
|---|---|
| Readiness Score | Quiz result only. Must be accurate. Never hardcoded. |
| Modules Active | Count from real curriculum progress (Supabase). Show `1` only when curriculum exists. |
| Day Streak | Activity in curriculum — future feature, show `—` until built |
| Docs Ready | Documents uploaded — future feature, show `—` until built |

---

## 🗺️ 5. ROADMAP DATA RULES

- All milestone done/not-done state must come from real Supabase data
- **Never hardcode `m1Done = true` or any milestone as done**
- **Never infer milestone completion from quiz answers alone**
- All milestone values start as `false` for new accounts
- See `skills/roadmap.md` for the full roadmap north star

---

## 📚 6. CURRICULUM SYSTEM

- Curriculum is NOT auto-generated on page load
- User must explicitly click to trigger generation
- Once generated: saved to Supabase, never re-generated unless user requests
- Button label: "Start Learning" (post-quiz, no curriculum) — never "Generate Curriculum"
- Pre-quiz button: "Start with Quiz" → `/quiz`

---

## ⚡ 7. PRIORITY ACTIONS

Always show 4 actions. Evolve based on real user state.

| User State | Show This Action |
|---|---|
| No quiz | "Take Migration Assessment" (urgent) |
| Quiz done, no language test | "Register for Language Test" (urgent) |
| Quiz done, no curriculum | "Start Your Curriculum" |
| Has curriculum, started module | "Continue your module" |
| Low readiness (< 40) | "Improve your IELTS preparation" |
| High readiness (70+) | "Prepare your documents" |

---

## 🕘 8. RECENT ACTIVITIES

- Before quiz: section is empty — no placeholder filler
- After quiz: show 2–5 real activities (module started, completed, resource opened)
- Never show fake/hardcoded activity items

---

## 💬 9. VOICE & TONE

### Good
- ✅ "Let's take the next step in your journey"
- ✅ "You're making progress — keep going"
- ✅ "Start your journey by taking the assessment"
- ✅ "Your roadmap is built from your results"

### Never
- ❌ "Generate curriculum"
- ❌ "AI-powered pathway"
- ❌ "AI-generated"
- ❌ Robotic or dry copy
- ❌ Overly technical explanations

---

## 📐 10. SCORE BREAKDOWN ACCURACY

- Score breakdown on the dashboard (Profile tab) **must always use `calculateScoreBreakdown(answers)`** imported from `lib/quizData.js`
- **Never duplicate the scoring maps** in `dashboard.js` or any other file — the maps live only in `lib/quizData.js`
- The breakdown is: Experience (30pts), Education (20pts), Language (20pts), Age (10pts), Savings (10pts), Profile/bonus (10pts) = 100 total
- The `calculateScore` and `calculateScoreBreakdown` functions in `lib/quizData.js` share the same constants — the score shown on the report page and on the dashboard will always match

---

## 🧩 11. SYSTEM LOGIC SUMMARY

| Rule | Detail |
|---|---|
| Quiz = entry point | Everything personal depends on it |
| No quiz = no roadmap | Roadmap requires destination + visa route + score — impossible without quiz |
| No quiz = no fake data | Never show hardcoded numbers, fake milestones, or placeholder modules |
| Curriculum = user-triggered | Once only. Saved forever after. |
| Profile = read-only | Only "Retake Quiz" can update it. No edit button. |
| Milestone state = Supabase only | Never hardcode done/not-done for any milestone |
| Mobile + desktop = always both | Every change must be implemented for both breakpoints |
| Design stays, data changes | Pre-quiz: keep the layout, swap in empty/quiz-pointing content |
| Score breakdown = quizData.js only | Always import `calculateScoreBreakdown` — never duplicate maps |

---

## 🔥 Final Product Feel

When a user lands on the dashboard, they should feel:
> *"I know exactly what to do next."*

Not:
> *"What is this platform doing?"*

---

*Last updated: 2026-04-14. Reference this file when making any changes to `pages/dashboard.js` or any dashboard tab component.*

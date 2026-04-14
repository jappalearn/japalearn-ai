# JapaLearn Dashboard – Skills & Migration Hub (MVP Spec)

> **Purpose:** This file is a reference guide for the AI agent when building, updating, or making decisions about the JapaLearn dashboard. It defines the logic, tone, behaviour rules, and UX principles the dashboard must always follow.

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
- Before 12pm → "Good morning ☀️"
- 12pm–5pm → "Good afternoon 🌤️"
- After 5pm → "Good evening 🌙"

### Language rule
- ✅ "Build your personalized learning journey"
- ❌ "Generate curriculum"
- ❌ "AI-powered pathway"

### Hero CTA logic
| User State | Button Label |
|---|---|
| Has NOT taken quiz | Take Assessment |
| Has taken quiz | Start Learning |

---

## 🚨 2. EMPTY STATE (NO QUIZ TAKEN)

Dashboard should feel guided, not broken.

- All activity sections → EMPTY
- All stats → show 0 or —
- Cards → visible but inactive/disabled

**Message to show:**
> "Start your journey by taking a quick assessment. This helps us guide you with the right steps."

### Navigation behaviour (no quiz)
If user clicks ANY nav item (Dashboard, Profile, Curriculum, Roadmap, Resources):
- Do NOT block them silently
- Show a contextual reminder explaining what that section gives them *after* the assessment
- Always offer a path to the quiz

**Section-specific reminder copy:**
| Nav Item Clicked | Reminder Message |
|---|---|
| Curriculum | "Your curriculum is built from your quiz results — it's personalised to your destination, profession, and goals. Take the assessment to unlock it." |
| Roadmap | "Your roadmap is a step-by-step migration timeline based on your profile. Take the assessment to see your personalised plan." |
| Resources | "Resources are filtered to match your destination country and visa route. Take the assessment so we can show you only what's relevant." |
| Profile | "Your profile score, breakdown, and migration details come from your assessment. Take the quiz to fill your profile." |
| Dashboard | "Start your journey by taking a quick assessment. This helps us guide you with the right steps." |

---

## 📊 3. STATS CARDS

### Before quiz
| Stat | Value |
|---|---|
| Readiness Score | 0 |
| Modules Active | — |
| Day Streak | — |
| Docs Ready | — |

### After quiz
| Stat | Source |
|---|---|
| Readiness Score | Quiz result only. Must be accurate. |
| Modules Active | Count of started + completed modules from curriculum progress |
| Day Streak | Activity in curriculum (lesson opens/completions) — track consistency |
| Docs Ready | Documents uploaded. Show — until document upload is live. |

---

## ⚡ 4. PRIORITY ACTIONS

Always show 4 actions. These evolve as the user progresses.

### Default order (after quiz)
1. Start Learning ← most important
2. View Roadmap
3. Explore Free Resources
4. Personalised dynamic action (see table below)

### Dynamic action logic
| User Behaviour | Show This Action |
|---|---|
| Just finished quiz, no curriculum | "Build your personalised learning path" |
| Has curriculum, no progress | "Start your first module" |
| Has curriculum, started module | "Continue your module" |
| Stopped learning mid-module | "Resume where you left off" |
| Low readiness score (< 40) | "Improve your IELTS preparation plan" |
| High readiness score (70+) | "Prepare your documents" |
| Completed all modules | "Review your roadmap and book your visa" |
| Just completed an IELTS-related module | "Book your IELTS exam" |

**Rule:** Actions must always evolve. Never stay static. Always point to the user's next real step.

---

## 📚 5. CURRICULUM SYSTEM

### Key rules
- Curriculum is **NOT** auto-generated on page load
- User must explicitly click "Start Learning" or equivalent CTA to trigger generation
- Once generated: curriculum is saved to Supabase and **never re-generated** unless the user explicitly requests it
- The button copy should say "Start Learning" — never "Generate Curriculum" or "AI-powered"

### Resources section
- Resources are stored in the backend (Supabase `resources` table)
- Uploaded by admin, tagged by: destination country, category (IELTS, Visa, Jobs, Documents, Finance, etc.)
- Only show resources relevant to the user's profile (destination + segment)
- If no profile: show nothing 

---

## 🧠 6. SMART RECOMMENDATION ENGINE

The system should track user activity and surface the most urgent next step.

### Examples
- User just finished an IELTS module → show "Book your IELTS exam" in priority actions
- User has high score but no language test → surface "Register for your language test"
- User has been inactive 3+ days → show "Resume your learning" as top action
- User completed all modules → surface roadmap + visa prep actions

---

## 🕘 7. RECENT ACTIVITIES

### Show: 2–5 latest activities

**Activity types:**
- Started module
- Completed module
- Opened resource
- Deleted item
- Uploaded document (future)

### Behaviour
- Always replace oldest activity when new one is added
- Keep the feed fresh and current
- Before quiz → section is empty (no placeholder filler)

---

## 🧭 8. NAVIGATION RULES

### No quiz taken
- When user clicks any feature: show contextual reminder (see Section 2 table)
- Always offer quiz CTA alongside the reminder
- Do NOT silently redirect without explanation

### Quiz completed
Nav works normally:
- Dashboard (overview)
- Curriculum (learning)
- Roadmap
- Resources
- Profile

---

## 🎴 9. DASHBOARD CARDS

- Cards are always visible (never hidden before quiz)
- Each card includes: icon/emoji, title, short description, action button
- Before quiz: cards are disabled/greyed — clicking redirects to quiz with a contextual message
- After quiz: cards are fully active and show real data

---

## 💬 10. VOICE & TONE

### Always feel:
- Supportive
- Clear
- Directional

### Good examples
- ✅ "Let's take the next step in your journey"
- ✅ "You're making progress — keep going"
- ✅ "Here's what to focus on next"
- ✅ "Start your journey by taking the assessment"
- ✅ "Build your personalized learning journey"

### Avoid
- ❌ "Generate curriculum"
- ❌ "AI-powered pathway"
- ❌ Overly technical language
- ❌ Robotic, dry copy
- ❌ Too many explanations — be concise

---

## 🧩 11. SYSTEM LOGIC SUMMARY

| Rule | Detail |
|---|---|
| Quiz = entry point | Everything personal depends on it |
| Curriculum = user-triggered | Once only. Saved forever after. |
| Actions = always evolving | Based on real user state |
| Dashboard = always guiding | User should always know their next step |
| Empty state = guided | Never feel broken — feel inviting |
| Tone = human | Warm, clear, directional — never robotic |

---

## 🔥 Final Product Feel

When a user lands on the dashboard, they should feel:
> *"I know exactly what to do next."*

Not:
> *"What is this platform doing?"*

---

*Last updated: 2026-04-14. Reference this file when making any changes to `pages/dashboard.js` or any dashboard tab component.*

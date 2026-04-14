# JapaLearn AI — Roadmap Tab North Stars

> **Purpose:** Rules for building, displaying, and evolving the Roadmap tab. Always reference this when changing `RoadmapTab` or `generateMilestones` in `pages/dashboard.js`.

---

## 🎯 Core Principle

The roadmap is a **personalised migration timeline** — not a generic checklist.
It must only exist when there is real quiz data. No quiz = no roadmap.

---

## 🔒 1. QUIZ REQUIRED

- If `answers.destination` is empty (no quiz taken): show `QuizRequiredState` — do NOT render any roadmap structure
- The roadmap is built entirely from quiz answers: destination, segment, language score, and readiness score
- Never show placeholder milestones, demo data, or hardcoded "done" steps

---

## 🗺️ 2. WHAT THE ROADMAP SHOWS

The roadmap has **6 milestones** derived from the user's profile:

| Milestone | What it represents |
|---|---|
| M1 | Profile Assessment (quiz completed) |
| M2 | Language Test Registration / Booking |
| M3 | Language Test Completed (pass threshold met) |
| M4 | Document Preparation |
| M5 | Visa Application Submitted |
| M6 | Travel Ready / Departure |

### Milestone done/not-done rules
- **M1 done** = user has passed a module quiz in their curriculum (real Supabase data)
- **M2 done** = user has registered/booked their language test (quiz answer is NOT "Not taken")
- **M3 done** = user has a passing language score (IELTS 7.0+, OET, CELPIP, etc.)
- **M4, M5, M6** = future: tracked via document upload / visa checklist completion
- **Never hardcode any milestone as `true`** — always derive from real user data

---

## ⏱️ 3. TIMELINE CALCULATION

- Timeline is driven by `answers.timeline` (user-selected at end of quiz):
  - '0–3 months...' → 13 weeks (3-Month Plan)
  - '3–6 months...' → 26 weeks (6-Month Plan)
  - '6–12 months...' → 52 weeks (12-Month Plan)
  - '12–24 months...' → 96 weeks (24-Month Plan)
- Fallback (legacy users with no `answers.timeline`): score ≥ 70 → 16 weeks, score 40–69 → 20 weeks, score < 40 → 24 weeks
- Milestone week ranges are proportional to `totalWeeks` via `getMilestoneWeeks(totalWeeks)`
- `weeksLeft` = `totalWeeks * (1 - pct / 100)`
- `pct` = `completedMilestones / 6 * 100`

---

## 🏁 4. CURRENT MILESTONE

- The "current" milestone = first milestone that is NOT done
- It receives visual emphasis: blue ring, pulsing dot
- Expanded by default when the tab loads

---

## 🌍 5. DESTINATION-SPECIFIC CONTENT

Every milestone has destination-specific action copy:
- Visa portal URLs and names differ by country (IRCC for Canada, UK Visas for UK, etc.)
- Document evaluation body differs (WES for Canada, NARIC/ENIC for UK, etc.)
- Roadmap always names the specific visa route from `getVisaRoute(destination, segment)`

---

## 📐 6. DESIGN RULES

- Mobile and desktop share the same milestone data — layout adapts
- Progress bar at the top reflects `pct`
- Stat chips: Weeks Left, % Complete, Actions Due — all calculated, never hardcoded
- Milestone cards expand on tap/click to show action steps
- Done milestones: blue gradient icon + connecting spine
- Current milestone: white ring + blue dot + glow
- Future milestones: grey number + grey spine

---

## 🚫 7. NEVER DO

- Never show a roadmap when `answers.destination` is empty
- Never hardcode `m1Done = true` or any milestone as done
- Never infer milestone completion from quiz answers alone (e.g. language score → M3 done)
  - Exception: M2 can infer "registered" status from `answers.language !== 'Not taken'`
- Never show a generic roadmap — it must always reflect the user's real destination and segment

---

*Last updated: 2026-04-14. Reference this file when making any changes to the Roadmap tab or `generateMilestones` function.*

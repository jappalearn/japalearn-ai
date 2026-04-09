# JapaLearn AI — Module Quiz System

## Overview
After completing all lessons in a module, users must pass a 10-question AI-generated quiz
before they can access the next module. This applies to every curriculum, for every user.

## Pass Mark
- **7/10 correct (70%)** to pass
- Users can retake as many times as needed (new questions generated each time)
- Best score is kept in the database

## Files

| File | Purpose |
|------|---------|
| `pages/api/generate-quiz.js` | GPT-4o-mini generates 10 MCQ questions from lesson content |
| `pages/learn/[curriculumId]/[moduleIndex]/quiz.js` | Quiz page UI — question by question with explanations |
| `pages/dashboard.js` — LearningTab | Shows quiz status, locks next module until quiz passed |
| `pages/learn/[curriculumId]/[moduleIndex]/[lessonIndex].js` | Last lesson routes to quiz instead of next module |

## Database Table: `module_quiz_results`
```sql
id uuid PRIMARY KEY
user_id uuid → auth.users
curriculum_id uuid → curricula
module_index integer
passed boolean
score integer
total integer (always 10)
attempts integer
completed_at timestamptz
UNIQUE(user_id, curriculum_id, module_index)
```
RLS enabled — users can only read/write their own results.

## User Flow
1. User completes last lesson in a module
2. `goNext()` in lesson page redirects to `/learn/[curriculumId]/[moduleIndex]/quiz`
3. Quiz page calls `/api/generate-quiz` → GPT generates 10 questions from lesson content
4. User answers one question at a time, sees explanation after each answer
5. Results screen shows score, pass/fail, answer review
6. **Pass (≥7/10)** → "Continue to Module X" button unlocks → `module_quiz_results.passed = true`
7. **Fail** → "Retake Quiz" generates fresh questions
8. Dashboard LearningTab: Module N+1 header shows lock icon + "Pass previous module quiz to unlock"

## Dashboard Logic
```js
const isModuleUnlocked = (mi) => {
  if (mi === 0) return true
  return quizPassed[mi - 1] === true  // quizPassed loaded from module_quiz_results
}
```

## Quiz Generation Prompt
- Uses module title, lesson titles, and actual lesson content (key_takeaways) from `lesson_content` table
- 10 questions: 4 easy, 4 medium, 2 harder
- Questions are specific to the user's destination and segment (e.g. UK nurse vs Canada tech)
- Each question has 4 options (A–D), correct index, and explanation
- New questions generated on every retake

## UX Rules
- Module quiz row appears at the bottom of each expanded module lesson list in dashboard
- Quiz row is blue + clickable only when ALL lessons in that module are done
- Quiz row shows "Passed ✓" in green when passed
- Module header shows lock icon when previous quiz not passed
- "Pass previous module quiz to unlock" shown as sublabel on locked modules

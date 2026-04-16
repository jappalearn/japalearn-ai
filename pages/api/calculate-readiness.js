import { generateAIResponse } from '../../lib/ai';
import { SKILLS } from '../../lib/skills';
import { createClient } from '@supabase/supabase-js';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  // Auth guard — must be a signed-in user
  const token = req.headers.authorization?.replace('Bearer ', '');
  if (!token) return res.status(401).json({ error: 'Unauthorized' });

  const anonClient = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );
  const { data: { user } } = await anonClient.auth.getUser(token);
  if (!user) return res.status(401).json({ error: 'Unauthorized' });

  const { answers, resultId } = req.body;
  if (!answers) return res.status(400).json({ error: 'Missing answers' });

  // Safe, narrow search query — never expose the full profile to Google Search
  const searchQuery = `migration readiness ${answers.destination || ''} ${answers.segment || ''}`.trim();

  try {
    const responseText = await generateAIResponse(
      [
        {
          role: 'user',
          content: `Calculate the migration readiness score for this profile:
          ${JSON.stringify(answers, null, 2)}`
        }
      ],
      SKILLS.READINESS_SCORER,
      { enrich: true, searchQuery }
    );

    const result = JSON.parse(responseText.replace(/```json/g, '').replace(/```/g, ''));

    // Save ai_data back to quiz_results — enforce ownership so callers can only update their own row
    if (resultId) {
      const serviceClient = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL,
        process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
      );
      await serviceClient
        .from('quiz_results')
        .update({ ai_data: result, score: result.overall })
        .eq('id', resultId)
        .eq('user_id', user.id);
    }

    return res.status(200).json(result);
  } catch (error) {
    console.error('READINESS SCORER ERROR:', error);
    return res.status(500).json({ error: error.message });
  }
}
